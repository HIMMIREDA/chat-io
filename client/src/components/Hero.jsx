import React from "react";
import { Link } from "react-router-dom";
import { BiMessage } from "react-icons/bi";
function Hero() {
  return  (
    <div className="hero min-h-screen bg-dark2">
      <div className="hero-content text-center">
        <div className="max-w-md">
        <div className="flex justify-center items-center">

        <BiMessage size={50} className="text-wtsGreen"/>
          <h1 className="text-5xl font-bold ml-5 text-wtsGreen">Chat.io</h1>
        </div>
          <p className="py-6">
             Chat io is an app for chatting made with MERN stack and socket.io
          </p>
          <Link to="/register" className="btn btn-accent">Get Started</Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
