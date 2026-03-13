import { useNavigate } from "react-router"
import { useAuth } from "@/hooks/Authcontext";
import { useEffect, useState } from "react";
import {api} from "@/util/api.jsx"

const BAdd = () =>{
const [title, setTitle]= useState("")
const [content, setContent]= useState("")
const nav = useNavigate();
const { checkAuth, setAuth } = useAuth()
const submitevent =(e)=> {
		e.preventDefault(); 
		const params ={title, content}
		console.log(params)
		api.post("/board_add", params)
		.then(res => {
		console.log(res)
		if(res.data.status) {
			setAuth(res.data.status)
		} else {
			alert(res.data.message)
			e.target.title.value = ""
			e.target.content.value = ""
		}
		})
		.catch(err => console.error(err))
		
	}
useEffect(()=>{
	if(!checkAuth()) nav("/")
},[])
		
    return(
   <>	
		<div className="container mt-3">
			<h1 className="display-1 text-center">게시글 작성</h1>
			<form onSubmit={submitevent}>
				<div className="mb-3 mt-3">
					<label htmlFor="title" className="form-label">제목</label>
					<input type="text" className="form-control" id="title" placeholder="제목을 입력하세요." name="title" value={title} onChange={e=>setTitle(e.target.value)}/>
				</div>
				<div className="mb-3 mt-3">
					<label htmlFor="name" className="form-label">작성자</label>
					<input type="text" className="form-control" id="name" name="name" disabled />
				</div>
				<div className="mb-3 mt-3">
					<label htmlFor="content" className="form-label">내용</label>
					<textarea type="text" className="form-control h-50" rows="10" placeholder="내용을 입력하세요." name="content"value={content} onChange={e=>setContent(e.target.value)}></textarea>
				</div>
				<div className="d-flex">
					<div className="p-2 flex-fill d-grid">
						<button type="submit"   className="btn btn-primary">등록</button>
					</div>
					<div className="p-2 flex-fill d-grid">
						<button type="button"  onClick={()=>nav('/')} className="btn btn-primary">취소</button>
					</div>
				</div>
			</form>
		</div>
</> 
)
}    
export default BAdd;