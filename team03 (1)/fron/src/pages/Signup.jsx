import { useNavigate } from 'react-router'


const Signup = () =>{
      return(
   		 <>
   		 <nav className="navbar navbar-expand-lg bg-body-tertiary">
			<div className="container-fluid">
				<a className="navbar-brand" href="../index.html">TEAM3</a>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav">
						<li className="nav-item">
							<a className="nav-link" href="./login">로그인</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="../index.html">로그아웃</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="#">회원가입</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="./view">회원정보</a>
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
					<input type="email" className="form-control" id="email" placeholder="이메일를 입력하세요." name="email"/ >
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
							<input type="radio" className="form-check-input" id="radio2" name="gender" value="2" />여성
							<label className="form-check-label" htmlFor="radio2"></label>
						</div>
					</div>
				</div>
			</form>
				<div className="p-2 flex-fill d-grid">
			<div className="d-flex">
					<button type="button" href="../index.html" className="btn btn-primary">가입</button>
				</div>
				<div className="p-2 flex-fill d-grid">
					<button type="button" href="../index.html" className="btn btn-primary">취소</button>
				</div>
			</div>
		</div>
    </>
   )
  }
   


export default Signup