import streamlit as st
import trafilatura as tra
import ollama
import re

st.set_page_config(
    page_title="4. 뉴스기사요약",
    page_icon="🤺",
    layout="wide",
) 

st.title("[5] 뉴스기사 요약")

def extract_txt_image(url: str):
    html = tra.fetch_url(url)
    text = tra.extract(html, output_format="markdown", include_comments=False)
    image = tra.extract_metadata(html).image
    return text, image

if url := st.text_input("주소 입력", placeholder="URL을 입력하세요"):
    text, image = extract_txt_image(url)
    message = ""
    if re.search('[ㄱ-ㅎㅏ-ㅣ가-힣]',text):
     message = text
    else:
     prompt = f"다음 영어 기사를 한글로 번역해주세요:\n {text}"
     message = ollama.chat(model="gpt-oss:20b", messages=[{"role":"user","content":prompt}])
     
    st.image(image)
    st.markdown(message)
