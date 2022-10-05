import React from "react";
import { FaUser, FaBell } from "react-icons/fa";
import { BiMessage } from "react-icons/bi";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-5 h-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost normal-case text-xl hover:bg-transparent"
        >
          <div className="flex justify-around ">
            <BiMessage size={50} color="#00A884" />
            <h1 className="ml-2 self-center">Chat.io</h1>
          </div>
        </Link>
      </div>
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <FaBell size={30} />
        </button>
      </div>
    </div>
  );
}

export default NavBar;
