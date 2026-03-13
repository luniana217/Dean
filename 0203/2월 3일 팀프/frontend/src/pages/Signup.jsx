import { useNavigate } from "react-router";

const Signup = () => {
   const navigate = useNavigate();
		const move = () =>navigate("/")
		const view = () => navigate("/view")
		const signup = () => navigate("/signup")
		const signin = () => navigate("/signin")
    
   const BSubmit =(e)=> {
		e.preventDefault(); 
		move(); 
	}
    return(
        <>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
			<div className="container-fluid">
				<button onClick={move} className="navbar-brand" href="../index.html">TEAM3</button>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav">
						<li className="nav-item">
							<button onClick={signin} className="nav-link" >로그인</button>
						</li>
						<li className="nav-item">
							<button onClick={move} className="nav-link" >로그아웃</button>
						</li>
						<li className="nav-item">
							<button onClick={signup} className="nav-link" >회원가입</button>
						</li>
						<li className="nav-item">
							<button onClick={view} className="nav-link">회원정보</button>
						</li>
					</ul>
				</div>
			</div>
		</nav>

		{/* <!-- 회원가입 영역 --> */}
		<div className="container mt-3">
			<h1 className="display-1 text-center">회원가입</h1>
			<form>
				<div className="mb-3 mt-3">
					<label htmlFor="name" className="form-label">이름:</label>
					<input type="text" className="form-control" id="name" placeholder="이름을 입력하세요." name="name" />
				</div>
				<div className="mb-3 mt-3">
					<label htmlFor="email" className="form-label">이메일:</label>
					<input type="email" className="form-control" id="email" placeholder="이메일를 입력하세요." name="email" />
				</div>
				<div className="mb-3">
					<label htmlFor="pwd" className="form-label">비밀번호:</label>
					<input type="password" className="form-control" id="pwd" placeholder="비밀번호를 입력하세요." name="pwd" />
				</div>
				<div className="d-flex">
					<div className="p-2 flex-fill">
						<div className="form-check">
							<input type="radio" className="form-check-input" id="radio1" name="gender" value="1" readOnly />남성
							<label className="form-check-label" htmlFor="radio1"></label>
						</div>
					</div>
					<div className="p-2 flex-fill">
						<div className="form-check">
							<input type="radio" className="form-check-input" id="radio2" name="gender" value="2" readOnly />여성
							<label className="form-check-label" htmlFor="radio2"></label>
						</div>
					</div>
				</div>
			</form>
			<div className="d-flex">
				<div className="p-2 flex-fill d-grid">
					<button onSubmit={BSubmit} className="btn btn-primary">가입</button>
				</div>
				<div className="p-2 flex-fill d-grid">
					<button onClick={move} href="../index.html" className="btn btn-primary">취소</button>
				</div>
			</div>
		</div>
        </>
    )
}

export default Signup