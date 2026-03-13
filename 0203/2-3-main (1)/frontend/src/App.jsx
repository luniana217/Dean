import { Routes, Route } from "react-router";
import Nav from '@pages/Nav.jsx'
import Login from '@pages/login.jsx'
import Signup from '@pages/signup.jsx'
import Home from "@pages/home.jsx"
import UserEdit from "@/pages/UserEdit.jsx";
import UserView from "@/pages/UserView.jsx";
import BoardView from "@/pages/BoardView.jsx";
import NotFound from '@/pages/NotFound.jsx';
import BAdd from '@/pages/BAdd.jsx';
import BEdit from '@/pages/BEdit.jsx';

function App() {
   const paths = [
    {path: "/", element: <Home />},
    {path: "/login", element: <Login />},
    {path: "/signup", element: <Signup />},
    {path: "/board_add", element: <BAdd />},
    {path: "/board_edit/:no", element: <BEdit />},
    {path: "/board_view/:no", element: <BoardView />},
    {path: "/user_view", element: <UserView />},
    {path: "/user_edit", element: <UserEdit />},
    {path: "*", element: <NotFound />}
  ]
  return (
    <>
      <Nav />
      <Routes>
        { paths?.map((v, i) => <Route key={i} path={v.path} element={v.element} />) }
      </Routes>
    </>
  )
}

export default App