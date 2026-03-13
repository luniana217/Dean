from bs4 import BeautifulSoup as bs
from requests import get
import pandas as pd
import streamlit as st
import json

st.set_page_config(
  page_title="interpark 수집",
  page_icon="💗",
  layout="wide",
)

# 인터파크 장르별 URL


if 'genre' not in st.session_state:
	st.session_state.genre = 0

# 데이터 수집
def getData():
  try:
    st.text("수집 시작")
    url = (
       # 뮤지컬 url
musical_url = "https://tickets.interpark.com/contents/ranking?genre=MUSICAL"
# 콘서트 url
concert_url = "https://tickets.interpark.com/contents/ranking?genre=CONCERT"
# 클래식 url
classic_url = "https://tickets.interpark.com/contents/ranking?genre=CLASSIC"
# 아동 url
kids_url = "https://tickets.interpark.com/contents/ranking?genre=KIDS"
# 연극 url
drama_url = "https://tickets.interpark.com/contents/ranking?genre=DRAMA"
# 전시 url
exhibit_url = "https://tickets.interpark.com/contents/ranking?genre=EXHIBIT"
    )
    st.text(f"URL: {url}")
    head = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36'}
    res = get(url,headers=head)
    if res.status_code == 200:
      st.text("인터파크 티켓 수집 시작!")
      tickets = [] # { 장르, 티켓이름, 장소, 시작날짜, 종료날짜, 예매율 }
      tab1, tab2, tab3 = st.tabs(["HTML 데이터", "JSON 데이터", "DataFrame"])
      with tab1:
        st.html("html 출력")
      with tab2:
        st.text(
        json_string = json.dumps(genre, ensure_ascii=False, indent=2),
        label = "JSON 출력",
        data=json_string,
        mime="application/json"
       )
      with tab3:
         st.dataframe(
             pd.DataFramegenre(genre).drop(columns=['rank']),
             use_container_width=True)
  except Exception as e:
    return 0
  return 1

if st.button(f"수집하기"):
  getData()
