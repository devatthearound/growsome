# wishket_trend_bot.py
import os
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import openai
from dotenv import load_dotenv
import requests

load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
DISCORD_WEBHOOK_URL = os.getenv('DISCORD_WEBHOOK_URL')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SAVE_DIR = os.path.join(SCRIPT_DIR, "bot_saved")
os.makedirs(SAVE_DIR, exist_ok=True)

WISHKET_URL = "https://www.wishket.com/project/#clear"


def setup_driver():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920x1080')
    return webdriver.Chrome(options=options)


def fetch_wishket_projects():
    driver = setup_driver()
    driver.get(WISHKET_URL)
    time.sleep(10)
    html = driver.page_source
    save_path = os.path.join(SCRIPT_DIR, "wishket_page_source.html")
    with open(save_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"📄 페이지 소스를 {save_path} 로 저장했습니다.")
    driver.quit()
    return html


def parse_wishket_projects(html):
    soup = BeautifulSoup(html, 'html.parser')
    projects = []

    cards = soup.select('div.project-info-box')
    if not cards:
        print("⚠️ 프로젝트 카드 요소를 찾지 못했습니다. CSS 구조 변경 확인 필요.")
        return []

    print(f"🔍 찾은 프로젝트 카드 수: {len(cards)}")

    for card in cards[:10]:  # 최대 10개까지만 처리
        # 제목 추출
        title_el = card.select_one('a.project-link > p')
        title = title_el.get_text(strip=True) if title_el else "(제목 없음)"

        # 예산 추출
        budget_el = card.select_one('p.budget')
        budget = budget_el.get_text(strip=True) if budget_el else "(예산 정보 없음)"

        # 예산 정보 정제
        if "월 금액" in budget:
            budget = budget.replace("월 금액", "").strip()
        elif "예상 금액" in budget:
            budget = budget.replace("예상 금액", "").strip()

        if title != "(제목 없음)":
            projects.append((title, budget))

    print(f"✅ 파싱된 프로젝트 수: {len(projects)}")
    return projects


def analyze_projects_with_chatgpt(projects):
    prompt = """다음은 위시캣에 올라온 프로젝트 요청 제목과 예산 정보입니다. 이 데이터를 기반으로 요즘 많이 요청되는 개발/디자인 항목은 무엇인지, 월 평균 예산 규모는 어느 정도인지 요약 분석해 주세요.\n\n"""
    for title, budget in projects:
        prompt += f"- {title} ({budget})\n"

    if not OPENAI_API_KEY:
        print("❌ OpenAI API 키가 설정되지 않았습니다.")
        return "(분석 실패: API 키 없음)"
        
    try:
        # OpenAI v1.x 클라이언트 생성 및 API 호출 방식으로 수정
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "당신은 IT 프로젝트 시장 트렌드 분석 전문가입니다."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=600
        )
        return response.choices[0].message.content.strip()
    except openai.AuthenticationError as e:
        print(f"❌ GPT 분석 에러 (인증): {e}")
        return f"(분석 실패: API 키 인증 오류)"
    except openai.RateLimitError as e:
        print(f"❌ GPT 분석 에러 (요청 한도): {e}")
        return f"(분석 실패: 요청 한도 초과)"
    except openai.BadRequestError as e:
        print(f"❌ GPT 분석 에러 (잘못된 요청): {e}")
        return f"(분석 실패: 잘못된 요청 오류 - 토큰 초과 등)"
    except Exception as e:
        print(f"❌ ChatGPT 분석 에러 (기타): {e}")
        return f"(분석 실패: {e})"


def send_to_discord(message):
    """포맷된 메시지를 디스코드로 전송"""
    if not DISCORD_WEBHOOK_URL:
        print("❌ 웹훅 URL이 설정되지 않았습니다.")
        return
    
    if not message.strip():
        print("❌ 전송할 메시지가 비어있습니다!")
        return
        
    max_length = 2000 # 디스코드 메시지 길이 제한
    messages = [message[i:i+max_length] for i in range(0, len(message), max_length)]
    
    print(f"\n📤 디스코드 메시지 전송 시도 ({len(messages)}개 파트)...")
    
    for i, part_message in enumerate(messages):
        payload = {"content": part_message}
        try:
            response = requests.post(DISCORD_WEBHOOK_URL, json=payload, timeout=15)
            if response.status_code >= 200 and response.status_code < 300:
                print(f"✅ 디스코드 전송 완료! (Part {i+1}/{len(messages)}) Status: {response.status_code}")
            else:
                print(f"❌ 전송 실패 (Part {i+1}): {response.status_code} {response.text}")
            time.sleep(1) # 연속 전송 딜레이
        except Exception as e:
            print(f"❌ 요청 에러 (Part {i+1}): {e}")


def format_discord_message(projects, gpt_analysis):
    """위시캣 분석 결과를 디스코드 메시지로 포맷"""
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    lines = [f"🔔 위시캣 프로젝트 트렌드 분석 ({now})"]
    
    lines.append("\n## 🤖 ChatGPT 분석 요약")
    lines.append(gpt_analysis)
    lines.append("\n" + ("-" * 30) + "\n")
    
    lines.append("## 📑 최근 프로젝트 목록 (상위 10개)")
    if projects:
        for title, budget in projects:
            lines.append(f"- {title} ({budget})")
    else:
        lines.append("(데이터 없음)")
            
    return "\n".join(lines)


def main():
    print("🚀 위시캣 트렌드 분석 시작...")
    html = fetch_wishket_projects()
    projects = parse_wishket_projects(html)

    print("\n📊 크롤링된 프로젝트:")
    for title, budget in projects:
        print(f"- {title} | {budget}")

    report = analyze_projects_with_chatgpt(projects)
    print("\n🧠 분석 리포트:")
    print(report)

    # 로그 저장
    now = datetime.now().strftime("%Y-%m-%d_%H-%M")
    log_path = os.path.join(SAVE_DIR, f"wishket_trend_{now}.txt")
    with open(log_path, "w", encoding="utf-8") as f:
        f.write("위시캣 프로젝트 분석 리포트\n")
        f.write("========================\n")
        for title, budget in projects:
            f.write(f"- {title} ({budget})\n")
        f.write("\nChatGPT 분석 결과:\n")
        f.write(report)
    print(f"\n📝 로그 저장 완료: {log_path}")

    # 디스코드 메시지 포맷 및 전송
    formatted_message = format_discord_message(projects, report)
    send_to_discord(formatted_message)

if __name__ == '__main__':
    main()
