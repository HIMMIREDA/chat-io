import { useState } from "react";
import { useDispatch } from "react-redux";
import ChatBar from "../components/ChatBar";
import Spinner from "../components/Spinner";
import { logoutUser } from "../features/auth/authSlice";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function Chat() {
  const [userInfos, setUserInfos] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const axiosPrivate = useAxiosPrivate();
  const getUserInfos = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/users/me");
      setUserInfos(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      dispatch(logoutUser());
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <ChatBar />
      <div>{JSON.stringify(userInfos)}</div>
      <button className="btn btn-accent" onClick={() => getUserInfos()}>
        {" "}
        Get user
      </button>
    </>
  );
}

export default Chat;
