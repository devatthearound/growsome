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

load_dotenv()

DISCORD_WEBHOOK_URL = os.getenv('DISCORD_WEBHOOK_URL')

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
    # 크몽의 클래스명이 동적으로 바뀌기 때문에 더 일반적인 선택자 사용
    product_cards = soup.select("h3")
    if not product_cards:
        print("⚠️ 상품 타이틀 요소가 비어있습니다. CSS 선택자 확인 필요")
    return [el.get_text(strip=True) for el in product_cards[:5] if el.get_text(strip=True)]

def format_discord_message(product_dict):
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    lines = [f"📢 크몽 트렌드 상품 알림 ({now})"]
    for category, products in product_dict.items():
        lines.append(f"\n📁 [{category}]")
        if products:
            for product in products:
                lines.append(f"💡 {product}")
        else:
            lines.append("(데이터 없음)")
    return "\n".join(lines)

def send_to_discord(message):
    if not DISCORD_WEBHOOK_URL:
        print("❌ 웹훅 URL이 설정되지 않았습니다.")
        return
    payload = {"content": message}
    try:
        response = requests.post(DISCORD_WEBHOOK_URL, json=payload)
        if response.status_code == 204:
            print("✅ 디스코드 전송 완료!")
        else:
            print(f"❌ 전송 실패: {response.status_code} {response.text}")
    except Exception as e:
        print(f"❌ 요청 에러: {e}")

def save_log(results):
    """크롤링 결과를 로그 파일로 저장"""
    now = datetime.now().strftime("%Y-%m-%d_%H-%M")
    log_path = os.path.join(SAVE_DIR, f"log_{now}.txt")
    with open(log_path, "w", encoding="utf-8") as f:
        for category, items in results.items():
            f.write(f"[{category}]\n")
            for item in items:
                f.write(f"- {item}\n")
            f.write("\n")
    print(f"📝 로그 저장 완료: {log_path}")

def main():
    print("🚀 크몽 자동 키워드 분석 시작...")
    driver = setup_driver()
    results = {}
    for name, cid in CATEGORY_IDS.items():
        try:
            print(f"🔍 {name} 카테고리 크롤링 중...")
            html = fetch_html(driver, cid)
            products = parse_product_titles(html)
            results[name] = products
        except Exception as e:
            print(f"❌ {name} 처리 중 오류: {e}")
    driver.quit()

    if results:
        message = format_discord_message(results)
        print("\n📤 디스코드 전송 메시지:\n", message)
        send_to_discord(message)
        save_log(results)
    else:
        print("❌ 유효한 데이터가 없습니다.")

if __name__ == '__main__':
    main()
