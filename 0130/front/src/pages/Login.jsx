import axios from "axios"
import { useState } from "react"
import {jwtDecode} from "jwt-decode"



const Login = () => {
    const[email,setEmail] = useState("")
    const[password,setPassword] = useState("")

    const submitevent= e => {
        e.preventDefault()
        const params = {email, password}
        console.log("확인", params)
        axios.post("http://localhost:23306/login", params)
        .then(res => {
            console.log(res)
			if(res.data.status) {
				console.log(res.data.access_token)
			}else {
				console.log("실패")
			}
        })
        .catch(err=>console.error(err))


    }

    return(
        <>
        {/* <!-- 로그인 영역 --> */}
		<div className="container mt-3">
			<h1 className="display-1 text-center">로그인</h1>
			<form onSubmit={submitevent}>
				<div className="mb-3 mt-3">
					<label htmlFor="email" className="form-label">이메일</label>
					<input type="email" className="form-control" id="email" placeholder="이메일를 입력하세요."  value={email} onChange={e=>setEmail(e.target.value)}/>
				</div>
				<div className="mb-3">
					<label htmlFor="pwd" className="form-label">비밀번호</label>
					<input type="password" className="form-control" id="pwd" placeholder="비밀번호를 입력하세요." value={password} onChange={e=>setPassword(e.target.value)}/>
				</div>
			<div className="d-flex">
				<div className="p-2 flex-fill d-grid">
					<button type="submit" className="btn btn-primary">로그인</button>
				</div>
				<div className="p-2 flex-fill d-grid">
					<a href="../index.html" className="btn btn-primary">취소</a>
				</div>
			</div>
			</form>
		</div>
        </>
	)
}

	export default Login