import { Link } from "react-router";

const Nav = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/login">TEAM1</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/login">로그인</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">로그아웃</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup">회원가입</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/user_view">회원정보</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
