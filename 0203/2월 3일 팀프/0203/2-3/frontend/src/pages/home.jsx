import axios from "axios"
import { useState } from "react";
import { useNavigate } from "react-router";

const api = axios.create({
  baseURL: 'https://localhost:8000/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }

});

const Home = () => {
    const [search, setSearch]= useState("")

	const nav = useNavigate()
    
    const submitevent = e =>{
        e.preventDefault()
        const params ={search}
        console.log(params)
        api.get('/search', params)
          .then(res => console.log(res.data.search))
          .catch(err=>console.error(err));
    }
     
    
	const boardlist =[
		{"no": 1, "content": "샘플을 만들었어요", "name": "이나라"},
		{"no": 2, "content": "샘플을 만들어 영원히", "name": "남영준"},
		{"no": 3, "content": "여름이었다...☆", "name": "조윤주"},
		{"no": 4, "content": "이것 뭐에요?", "name": "이채훈"},
	]

return(
<>
	<div className="container mt-3">
		<h1 className="display-1 text-center">게시판</h1>
		<div className="d-flex justify-content-between align-items-center mt-4">
			<div className="btn-group">
				<button className="btn btn-primary" onClick={()=>nav("/board_add")}>게시글 작성</button>
			</div>
			<form className="d-flex" onSubmit={submitevent}>
				<input className="form-control me-2" type="search" placeholder="검색어를 입력하세요"value={search} onChange={e=>setSearch(e.target.value)}/>
				<button className="btn btn-outline-dark" type="submit">Search</button>
			</form>
		</div>
		<table className="table table-hover mt-3 text-center">
			<thead className="table-dark">
				<tr>
					<th>no</th>
					<th>게시글</th>
					<th>작성자</th>
				</tr>
			</thead>
			<tbody > 
				{boardlist.map((v,i) =>
				<tr key={v.no} className="cursor-pointer" onClick={() => nav(`/board_view/${v.no}`)}>
					<td>{v.no}</td>
					<td>{v.content}</td>
					<td>{v.name}</td>
				</tr>)}
			</tbody>
		</table>

		{/* <!-- Pagination 영역  --> */}
		<nav aria-label="Page navigation example">
			<ul className="pagination justify-content-center mt-4">
				<li className="page-item">
					<button className="page-link" onClick={()=>nav(-1)} aria-label="Previous">
						<span aria-hidden="true">&laquo;</span>
					</button>
				</li>
				<li className="page-item"><a className="page-link" href="#">1</a></li>
				<li className="page-item"><a className="page-link" href="#">2</a></li>
				<li className="page-item"><a className="page-link" href="#">3</a></li>
				<li className="page-item">
					<button className="page-link" onClick={()=>nav(1)} aria-label="next">
						<span aria-hidden="true">&raquo;</span>
					</button>
				</li>
			</ul>
		</nav>
	</div>
</>
)
}
export default Home