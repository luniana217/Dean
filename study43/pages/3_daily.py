from bs4 import BeautifulSoup as bs
from requests import get
import pandas as pd
import streamlit as st
import json

st.set_page_config(
  page_title="daily 수집",
  page_icon="💗",
  layout="wide",
)

map_url = "mapi.ticketlink.co.kr "

def getData():
      try:
        url = ""
        st.text(f"URL: {url}")
        res = get(url)
        if res.status_code == 200:
          st.text("인터파크 티켓 수집 시작!")
          tickets = [] # { 장르, 티켓이름, 장소, 시작날짜, 종료날짜, 예매율 }
          tab1, tab2, = st.tabs(["JSON 데이터", "DataFrame"])
          with tab1:
            st.text("html 출력")
          with tab2:
            st.text("JSON 출력")
          with tab3:
            st.text("DataFrame 출력")
          with tab4:
            st.text("API 출력")
            script_tag = soup.find('script', {'id': '__NEXT_DATA__'})
            json_data = json.loads(script_tag.string)
            st.json(json_data, expanded=False)
            st.html("<hr/>")
            st.text(f"{genre} 목록 출력")
            st.json(json_data.get('props', {}).get('pageProps', {}).get('fallback', {}).get(musical_key, []), expanded=False)  
      except Exception as e:
        return 0
      return 1