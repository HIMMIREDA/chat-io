import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Hero from "./components/Hero";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import Chat from "./pages/Chat";
import PersistLogin from "./components/PersistLogin";

function App() {
  return (
    <Router>
      <ToastContainer />
      <main className="flex mx-auto max-h-full flex-col-reverse xl:flex-row">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route element={<PersistLogin />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            {/* those will be  protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/chat" element={<Chat />} />
            </Route>
          </Route>

          <Route path="*" element={<div>Error Not Found</div>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
