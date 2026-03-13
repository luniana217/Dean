const Nav = () =>{

<nav class="navbar navbar-expand-lg bg-body-tertiary">
		<div class="container-fluid">
			<a class="navbar-brand" href="../index.html">TEAM3</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>


			<div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav">
					<li class="nav-item">
						<a class="nav-link" href="#">로그인</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="../index.html">로그아웃</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="./signup.html">회원가입</a>
					</li>
					<li class="nav-item">
						<button onClick={()=>("/view")} class="nav-link" >회원정보</button>
					</li>
				</ul>
			</div>
		</div>
		</nav>
}

export default Nav