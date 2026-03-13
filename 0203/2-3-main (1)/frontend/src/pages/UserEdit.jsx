import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import {api} from '@/util/api.jsx'

const UserEdit = () => {
  const [no, setNo] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [gender, setGender] = useState(true);

  const navigate = useNavigate();

  const setData = (data) => {
    setNo(data.no);
    setName(data.name);
    setEmail(data.email);
    setGender(Boolean(data.gender));
    setPwd(""); //
  };

  useEffect(() => {
    api.get("/getme")
      .then((res) => {
        if (res.data.status) setData(res.data.user);
        else navigate("/login");
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  const submitEvent = (e) => {
    e.preventDefault();

    const params = {
      email,
      password: pwd,
      gender: gender ? 1 : 0,
    };

    api.put("/user", params)
      .then((res) => {
        if (res.data.status) {
          alert("정상적으로 수정 처리가 완료되었습니다.");
          navigate("/userview");
        } else {
          alert(res.data.message ?? "수정 실패");
        }
      })
      .catch(() => alert("수정 실패"));
  };

  return (
    <div className="container mt-3">
      <h1 className="display-1 text-center">회원정보 수정</h1>

      <form onSubmit={submitEvent}>
        <div className="mb-3 mt-3">
          <label htmlFor="name" className="form-label">이름</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            readOnly
            value={name}
          />
        </div>

        <div className="mb-3 mt-3">
          <label htmlFor="email" className="form-label">이메일</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="pwd" className="form-label">새 비밀번호</label>
          <input
            type="password"
            className="form-control"
            id="pwd"
            name="pwd"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            autoComplete="off"
            required
          />
        </div>

        <div className="d-flex">
          <div className="p-2 flex-fill">
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id="radio1"
                name="gender"
                checked={gender}
                onChange={() => setGender(true)}
              />
              남성
            </div>
          </div>

          <div className="p-2 flex-fill">
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id="radio2"
                name="gender"
                checked={!gender}
                onChange={() => setGender(false)}
              />
              여성
            </div>
          </div>
        </div>

        <div className="d-flex mt-3">
          <div className="p-2 flex-fill d-grid">
            <button type="submit" className="btn btn-primary">저장</button>
          </div>
          <div className="p-2 flex-fill d-grid">
            <button type="button" className="btn btn-primary" onClick={() => navigate("/user_view")}>
              취소
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserEdit;