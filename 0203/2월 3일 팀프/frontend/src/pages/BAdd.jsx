import { useNavigate } from "react-router"


const BAdd = () =>{
const BSubmit =(e)=> {
		e.preventDefault(); 
		move(); 
	}
   
	const navigate = useNavigate();
        
		const move = () =>navigate("/")
        const view = () => navigate("/view")
        const signup = () => navigate("/signup")
		const signin = () => navigate("/signin")



    return(
   <>
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
			<div className="container-fluid">
				<button onClick={move} className="navbar-brand" >Team3</button>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav">
						<li className="nav-item">
							<button type="button" onClick={signin} className="nav-link">로그인</button>
						</li>
						<li className="nav-item">
							<button type="button" onClick={move} className="nav-link">로그아웃</button>
						</li>
						<li className="nav-item">
							<button type="button" onClick={signup} className="nav-link">회원가입</button>
						</li>
						<li className="nav-item">
							<button type="button" onClick={view} className="nav-link">회원정보</button>
						</li>
					</ul>
				</div>
			</div>
		</nav>

		
		<div className="container mt-3">
			<h1 className="display-1 text-center">게시글 작성</h1>
			<form onSubmit={BSubmit}>
				<div className="mb-3 mt-3">
					<label htmlFor="title" className="form-label">제목</label>
					<input type="text" className="form-control" id="title" placeholder="제목을 입력하세요." name="title" />
				</div>
				<div className="mb-3 mt-3">
					<label htmlFor="name" className="form-label">작성자</label>
					<input type="text" className="form-control" id="name" name="name" disabled />
				</div>
				<div className="mb-3 mt-3">
					<label htmlFor="content" className="form-label">내용</label>
					<textarea type="text" className="form-control h-50" rows="10" placeholder="내용을 입력하세요." name="content"></textarea>
				</div>
				<div className="d-flex">
					<div className="p-2 flex-fill d-grid">
						<button type="submit"   className="btn btn-primary">등록</button>
					</div>
					<div className="p-2 flex-fill d-grid">
						<button type="button"  onClick={move} className="btn btn-primary">취소</button>
					</div>
				</div>
			</form>
		</div>
</>
 
   )
   
   }
    
        
    





export default BAdd;