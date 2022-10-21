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
import ChatMobile from "./pages/ChatMobile";
import MyFriends from "./pages/MyFriends";
import NewFriends from "./pages/NewFriends";
import Requests from "./pages/Requests";
function App() {
  return (
    <Router>
      <ToastContainer />
      
      <main className="flex mx-auto max-h-full bg-dark2">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route element={<PersistLogin />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:id" element={<ChatMobile />} />
              <Route path="/myfriends" element={<MyFriends />} />
              <Route path="/newfriends" element={<NewFriends />} />
              <Route path="/requests" element={<Requests />} />
            </Route>
          </Route>

          <Route path="*" element={<div>Error Not Found</div>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
