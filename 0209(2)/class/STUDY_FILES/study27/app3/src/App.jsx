import { useState } from 'react'
import axios from "axios"

function App() {
  const [token,setToken] = useState("")
 const event1 = e=>{
  e.preventDefault()
    console.log("코드발급", e.target.email.value)
    axios.post("http://localhost:8001/login",{"email":e.target.email.value})
    .then(res=>{
      if(res.data.status) {
        e.target.email.value=""
        alert("Email 발급되었습니다")
      }
      console.log(res)
      e.target.email.value = ""
    })
    .catch(err=>console.error(err))
  }
  const event2 = e => {
  e.preventDefault()
    console.log("토큰발급")
    axios.post(import.meta.env.VITE_APP_FASTAPI_CODE,{"id":e.target.code.value})
    .then(res=>{
      console.log(res)
      if(res.data.status){
        setToken(res.data.access_token)
        alert("Token 발급이 되었습니다")
      } else alert("code가 유효하지 않습니다")
      e.target.code.value=""
    })
    .catch(err=>console.error(err))
  }
   const event3 = e=>{
     console.log("사용자 정보 요청")
     axios.post(import.meta.env.VITE_APP_FASTAPI_ME, {},
      {headers: {"Authorization":`Bearer ${token}`} }
     ).then(res=>console.log(res))
     .catch(err=>console.error(err))
    }
 
  return (
    <>
      <form onSubmit={event1}>
        <input type='email' name='email' />
        <button type='submit'>코드발급</button>
      </form>
      <hr />
      <form onSubmit={event2}>
        <input type='text' name='code' />
        <button type='submit'>토큰발급</button>
      </form>
      <hr />
        <button type='button' onClick={event3}>사용자 정보</button>
      
    </>
  )
}

export default App
