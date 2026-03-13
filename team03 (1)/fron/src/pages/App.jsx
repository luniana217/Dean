import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";
import Login from "@/pages/Login.jsx";
import Signup from "@/pages/Signup.jsx";
import UserEdit from "@/pages/UserEdit.jsx";
import UserView from "@/pages/UserView.jsx";
import Bview from "@/pages/Bview.jsx";
import Bedit from "@/pages/Bedit.jsx";
import Badd from "@/pages/Badd.jsx";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";



 const App = () => {
  const paths = [
    {path: "/", element: <Home />},
    {path: "login", element: <Login />},
    {path: "signup", element: <Signup />},
    {path: "Useredit", element: <UserEdit />},
    {path: "Userview", element: <UserView />},
    {path: "Badd", element: <Badd />},
    {path: "Bedit", element: <Bedit />},
    {path: "Bview", element: <Bview />},
    {path: "*", element: <NotFound />},


  ]
  return (
    <>
      <BrowserRouter>
        <Routes>
          { paths?.map((v, i) => <Route key={i} path={v.path} element={v.element} />) }
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
