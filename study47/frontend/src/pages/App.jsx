import { Routes, Route } from "react-router";
import '@styles/App.css'
import NotFound from '@pages/NotFound.jsx'
import Home from '@pages/Home.jsx'
import Home2 from '@pages/Home2.jsx'

function App() {
   const paths = [
    {path: "/", element: <Home />},
    {path: "*", element: <NotFound />},
    {path: "/home2", element: <Home2 />}
  ]
  return (
    <>
      <Routes>
        { paths?.map((v, i) => <Route key={i} path={v.path} element={v.element} />) }
      </Routes>
    </>
  )
}

export default App
