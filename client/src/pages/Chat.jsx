import { useDispatch, useSelector } from "react-redux";
import ChatBar from "../components/chatbar/ChatBar";
import ChatSection from "../components/chatsection/ChatSection";
import ParticipantSection from "../components/participantsection/ParticipantSection";
import SideBar from "../components/SideBar";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useEffect } from "react";
import { fetchFriends, reset } from "../features/friends/friendsSlice";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

function Chat() {
  const axiosPrivate = useAxiosPrivate();
  const { isLoading, isError, message, isSuccess } = useSelector(
    (state) => state.friends
  );
  const dispatch = useDispatch();

  useEffect(() => {
    let abortController = new AbortController();
    dispatch(
      fetchFriends({
        axiosPrivate,
        abortController,
      })
    );

    return () => {
      abortController.abort();
    };
  }, [axiosPrivate, dispatch]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }

    dispatch(reset());
  }, [isError, message, isSuccess, dispatch, axiosPrivate]);

  return (
    <>
      <SideBar />
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex w-full max-h-full flex-col-reverse xl:flex-row bg-dark2">
          <ChatBar />
          <ChatSection />
          <ParticipantSection />
        </div>
      )}
    </>
  );
}

export default Chat;
