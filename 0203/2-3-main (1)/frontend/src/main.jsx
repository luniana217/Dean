import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "@/App.jsx";
import {AuthProvider}  from "@/hooks/Authcontext.jsx";
import { CookiesProvider } from 'react-cookie';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CookiesProvider defaultSetOptions={{ path: '/' }}>
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
  </CookiesProvider>
);
