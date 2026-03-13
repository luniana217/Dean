import axios from "axios"
import { useNavigate } from "react-router"
import {api} from "@/util/api.jsx"

const Login = () => {
  const nav = useNavigate()

  const submit = (e) => {
    e.preventDefault()

    const params = {
      email: e.target.email.value,
      pwd: e.target.pwd.value,
    }

    console.log(params)

    api.post("/login", params)
      .then((res) => {
        console.log(res)
        if (res.data.status) {
          localStorage.setItem("user", res.data.user);
          nav("/")
          window.location.reload();
        } else {
          alert("로그인 실패")
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          alert("이메일 또는 비밀번호가 틀렸습니다.")
        } else {
          alert("로그인 실패")
        }
      })
  }

  const click = () => {
    nav("/")
  }

  return (
    <>
      <div className="container mt-3">
        <h1 className="display-1 text-center">로그인</h1>
        <form onSubmit={submit}>
          <div className="mb-3 mt-3">
            <label htmlFor="email" className="form-label">이메일</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="이메일를 입력하세요."
              name="email"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="pwd" className="form-label">비밀번호</label>
            <input
              type="password"
              className="form-control"
              id="pwd"
              placeholder="비밀번호를 입력하세요."
              name="pwd"
              required
            />
          </div>

          <div className="d-flex">
            <div className="p-2 flex-fill d-grid">
              <button type="submit" className="btn btn-primary">로그인</button>
            </div>
            <div className="p-2 flex-fill d-grid">
              <button type="button" className="btn btn-primary" onClick={click}>취소</button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default Login