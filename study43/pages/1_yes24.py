from bs4 import BeautifulSoup as bs
from requests import get
import pandas as pd
import streamlit as st
import json

st.set_page_config(
  page_title="yes24 수집",
  page_icon="💗",
  layout="wide",
)


# Yes24 베스트셀러 URL 예시
yes24 = "https://www.yes24.com/product/category/weekbestseller"
categoryNumber = "001"
pageNumber = 1
pageSize = 40
type = "week"
saleYear = 2026
weekNo = 1149
sex = "A"
viewMode = "thumb"




def getData():
  try:
    url = (
      f"{yes24}?"
      f"categoryNumber={categoryNumber}&"
      f"pageNumber={pageNumber}&"
      f"pageSize={pageSize}&"
      f"type={type}&"
      f"saleYear={saleYear}&"
      f"weekNo={weekNo}&"
      f"sex={sex}&"
      f"viewMode={viewMode}"
        )
    st.text(f"URL: {url}")
    head = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36'}
    res = get(url, headers=head)
    if res.status_code == 200:
      st.text("yes24 국내도서 주별 베스트 수집 시작!")
      soup = bs(res.text, "html.parser")
      table = soup.select("#yesBestList .itemUnit")
      books = [] # { 도서명, 저자, 별점 }
      for item in table:
        title = item.select_one("a.gd_name").get_text(strip=True)
        author = item.select_one("a").get_text(strip=True)
        star_span = item.select_one("item.rating_grade")
        star = star_span.select_one("item.rating_grade")
        books.append({"title":title,"author":author,"star":star})   
      tab1, tab2, tab3 = st.tabs(["HTML 데이터", "JSON 데이터", "DataFrame"])
      with tab1:
        st.html(table)
      with tab2:
       json_string = json.dumps(books, ensure_ascii=False, indent=2)
       st.text("JSON 출력")
       st.json(body=json_string, expanded=True, width="stretch")
      with tab3:
       st.dataframe(
       pd.DataFrame(books)  
          )
  except Exception as e:
    return 0
  return 1

if st.button(f"수집하기"):
  getData()