import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter, Routes, Route } from "react-router";
import '@styles/App.css';
import Home from '@/pages/Home.jsx'
import BAdd from '@/pages/BAdd.jsx'
import BEdit from '@/pages/BEdit.jsx'
import NotFound from '@/pages/NotFound.jsx'
import Signin from '@/pages/Signin.jsx'
import Signup from '@/pages/Signup.jsx'
import View from '@/pages/View.jsx'


const App = () => {
  const paths = [
    {path: "/", element: <Home />},
    {path: "*", element: <NotFound />},
    {path: "badd", element: <BAdd />},
    {path: "bedit", element: <BEdit />},
    {path: "signin", element: <Signin />},
    {path: "signup", element: <Signup />},
    {path: "view", element: <View />}
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