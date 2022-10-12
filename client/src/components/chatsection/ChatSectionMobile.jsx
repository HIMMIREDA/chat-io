import ChatSectionHeader from "./ChatSectionHeader";
import ChatList from "./ChatList";
import ChatForm from "./ChatForm";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { selectConversation } from "../../features/conversation/conversationSlice";

function ChatSectionMobile({ id }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(selectConversation(id));
  }, [dispatch, id]);

  return (
    <section
      className={`bg-dark2 w-full xl:w-3/4 mx-auto flex flex-col  px-12 h-screen max-h-full overflow-y-auto ${
        id ? "justify-between" : "items-center justify-center"
      }`}
    >
      {id ? (
        <>
          <ChatSectionHeader />
          <ChatList />
          <ChatForm />
        </>
      ) : (
        <h1 className="text-5xl text-white">Let's Chat With Friends 👋</h1>
      )}
    </section>
  );
}

export default ChatSectionMobile;
