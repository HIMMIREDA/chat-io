import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import {
  FaFacebookMessenger,
  FaSignOutAlt,
  FaTelegramPlane,
  FaUserFriends,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";

const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutClickHandler = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const menus = [
    { name: "My Friends", link: "/myfriends", icon: FaUsers },
    { name: "Chat", link: "/chat", icon: FaTelegramPlane },
    { name: "Requests", link: "/requests", icon: FaUserFriends },
    { name: "Get New Friends", link: "/newfriends", icon: FaUserPlus },
    {
      name: "Logout",
      icon: FaSignOutAlt,
      alignEnd: true,
      onClickHandler: logoutClickHandler,
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`bg-[#0e0e0e] min-h-screen  ${
        open ? "w-72" : "w-16"
      } duration-200 text-gray-100 px-4 `}
    >
      <Link to="/chat" className="flex justify-center my-4">
        <span className="bg-green-500 w-10 h-8 flex items-center justify-center rounded-lg cursor-pointer">
          <FaFacebookMessenger color="white" />
        </span>
      </Link>
      <div className="py-3 flex justify-end ">
        <HiMenuAlt3
          size={26}
          className="cursor-pointer"
          onClick={() => setOpen((open) => !open)}
        />
      </div>
      <div className="mt-4 flex flex-col gap-4 relative ">
        {menus?.map((menu, i) => (
          <Link
            to={menu?.link}
            key={i}
            className={` ${menu?.margin && "mt-5"} ${
              menu?.alignEnd && "mt-auto"
            } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}
            onClick={menu.onClickHandler}
          >
            <div>{React.createElement(menu?.icon, { size: "20" })}</div>
            <h2
              className={`whitespace-pre duration-500 ${
                !open && "opacity-0 translate-x-28 overflow-hidden "
              }`}
            >
              {menu?.name}
            </h2>
            <h2
              className={`${
                open && "hidden"
              } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit z-50`}
            >
              {menu?.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
