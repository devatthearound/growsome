# growsome_keyword_bot.py (상품 타이틀 기반)
import os
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import requests
from dotenv import load_dotenv
import openai  # OpenAI 라이브러리 추가
import httpx

load_dotenv()

# 환경 변수 설정
DISCORD_WEBHOOK_URL = os.getenv('DISCORD_WEBHOOK_URL')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')  # OpenAI API 키 로드

CATEGORY_IDS = {
    'IT·프로그래밍': 6,
    '마케팅': 2,
    '영상·사진·음향': 7,
    '디자인': 1,
    '번역·통역': 4
}

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SAVE_DIR = os.path.join(SCRIPT_DIR, "bot_saved")
os.makedirs(SAVE_DIR, exist_ok=True)

def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--window-size=1920x1080')
    # Selenium 4 이상에서는 webdriver_manager 대신 Service 객체 사용 권장
    # from selenium.webdriver.chrome.service import Service
    # service = Service(ChromeDriverManager().install()) # webdriver_manager 설치 필요
    # return webdriver.Chrome(service=service, options=chrome_options)
    # 설치된 ChromeDriver 경로를 직접 지정하거나 PATH에 설정해야 함
    return webdriver.Chrome(options=chrome_options)

def fetch_html(driver, category_id):
    url = f"https://kmong.com/category/{category_id}?sort=ranking_points"
    driver.get(url)
    time.sleep(5)  # 페이지 완전 로딩 대기
    html = driver.page_source
    file_path = os.path.join(SAVE_DIR, f"kmong_category{category_id}.html")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"✅ HTML 저장 완료: {file_path}")
    return html

def parse_product_titles(html):
    soup = BeautifulSoup(html, 'html.parser')
    # 더 구체적인 선택자 사용: 상품 카드를 나타내는 article 태그 내부의 h3
    product_cards = soup.select("article a > div:nth-of-type(2) span") 
    
    if not product_cards:
         # 이전 시도 선택자들
        product_cards = soup.select("ul.grid > li article h3")
        if not product_cards:
            product_cards = soup.select("div.service-card h3.title")
            if not product_cards:
                 # 클래스명 기반 (불안정할 수 있음)
                product_cards = soup.select("div.sc-gpHHfC.eUrIMU h3")
    
    if not product_cards:
        print("⚠️ 상품 타이틀 요소를 찾지 못했습니다. 모든 CSS 선택자 시도 실패.")
        return []
        
    titles = [el.get_text(strip=True) for el in product_cards if el.get_text(strip=True)]
    print(f"✅ 상품 제목 {len(titles)}개 추출 완료.")
    return titles[:10] # 상위 10개

def analyze_titles_with_gpt(all_titles):
    """ChatGPT를 사용하여 상품 제목 리스트 분석"""
    if not OPENAI_API_KEY:
        return "❌ OpenAI API 키가 설정되지 않았습니다."
    if not all_titles:
        return "ℹ️ 분석할 상품 제목이 없습니다."
    
    # openai.api_key = OPENAI_API_KEY # v1 이상에서는 불필요
    
    # 테스트용 짧은 프롬프트
    prompt = "다음은 인기 상품 키워드입니다. 어떤 트렌드가 보이는지 한 문단으로 요약해줘.\n"
    prompt += "\n".join([f"- {title}" for title in all_titles[:5]]) # 테스트를 위해 5개만 사용
    
    print("\n🧠 ChatGPT 분석 요청 중...")
    
    try:
        # httpx 클라이언트를 명시적으로 생성 (프록시 비활성화)
        http_client = httpx.Client(proxies={}) 
        
        # v1 이상 API 클라이언트 생성 시 httpx_client 전달
        client = openai.OpenAI(
            api_key=OPENAI_API_KEY,
            http_client=http_client # 커스텀 http 클라이언트 사용
        ) 
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", 
            messages=[
                {"role": "system", "content": "당신은 IT 아웃소싱 시장 트렌드 분석 전문가입니다."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300, 
            temperature=0.7
        )
        analysis = response.choices[0].message.content.strip()
        print("✅ ChatGPT 분석 완료")
        return analysis
    except openai.AuthenticationError as e:
        print(f"❌ GPT 분석 에러 (인증): {e}")
        return f"❌ GPT 분석 에러: API 키 인증 실패 ({e})"
    except openai.RateLimitError as e:
        print(f"❌ GPT 분석 에러 (요청 한도): {e}")
        return f"❌ GPT 분석 에러: 요청 한도 초과 ({e})"
    except openai.BadRequestError as e: # 예: 토큰 초과
        print(f"❌ GPT 분석 에러 (잘못된 요청): {e}")
        return f"❌ GPT 분석 에러: 요청 형식 오류 (토큰 초과 등) ({e})"
    except Exception as e:
        print(f"❌ GPT 분석 에러 (기타): {e}")
        return f"❌ GPT 분석 에러: 알 수 없는 오류 ({e})"

def format_discord_message(product_dict, gpt_analysis):
    """크롤링 결과와 GPT 분석을 포함한 디스코드 메시지 포맷"""
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    lines = [f"📢 크몽 트렌드 상품 & GPT 분석 ({now})"]
    
    lines.append("\n## 🤖 ChatGPT 트렌드 분석")
    lines.append(gpt_analysis)
    lines.append("\n" + ("-" * 30) + "\n")
    
    lines.append("## 📁 카테고리별 상품 목록")
    for category, products in product_dict.items():
        lines.append(f"\n### [{category}]")
        if products:
            for product in products:
                lines.append(f"- {product}")
        else:
            lines.append("(데이터 없음)")
            
    return "\n".join(lines)

def send_to_discord(message):
    if not DISCORD_WEBHOOK_URL:
        print("❌ 웹훅 URL이 설정되지 않았습니다.")
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

def save_log(results, gpt_analysis):
    """크롤링 결과와 GPT 분석을 로그 파일로 저장"""
    now = datetime.now().strftime("%Y-%m-%d_%H-%M")
    log_path = os.path.join(SAVE_DIR, f"log_{now}.txt")
    with open(log_path, "w", encoding="utf-8") as f:
        f.write(f"# 크몽 트렌드 분석 로그 ({now})\n\n")
        f.write("## GPT 분석 결과\n")
        f.write(gpt_analysis + "\n\n")
        f.write("## 카테고리별 상품\n")
        for category, items in results.items():
            f.write(f"\n### [{category}]\n")
            for item in items:
                f.write(f"- {item}\n")
            f.write("\n")
    print(f"📝 로그 저장 완료: {log_path}")

def main():
    print("🚀 크몽 자동 키워드 분석 및 GPT 요약 시작...")
    driver = setup_driver()
    results = {}
    all_titles = [] # 모든 제목을 저장할 리스트
    
    for name, cid in CATEGORY_IDS.items():
        try:
            print(f"\n🔍 {name} 카테고리 크롤링 중...")
            html = fetch_html(driver, cid)
            products = parse_product_titles(html)
            results[name] = products
            all_titles.extend(products) # 전체 제목 리스트에 추가
        except Exception as e:
            print(f"❌ {name} 처리 중 오류: {e}")
    driver.quit()

    if results:
        # ChatGPT 분석 실행
        gpt_analysis = analyze_titles_with_gpt(list(set(all_titles))) # 중복 제거 후 분석
        
        # 메시지 포맷 및 전송
        message = format_discord_message(results, gpt_analysis)
        # print("\n📤 디스코드 전송 메시지 미리보기 (첫 500자):\n", message[:500] + "...")
        send_to_discord(message)
        
        # 로그 저장
        save_log(results, gpt_analysis)
    else:
        print("❌ 유효한 데이터가 없습니다.")

if __name__ == '__main__':
    main()
