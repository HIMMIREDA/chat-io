import React from "react";
import { useSelector } from "react-redux";
import ChatForm from "./ChatForm";
import ChatList from "./ChatList";
import ChatSectionHeader from "./ChatSectionHeader";

function ChatSection() {
  const { friendId } = useSelector((state) => state.conversation);

  return (
    <section
      className={`bg-dark2 w-3/4 xl:w-1/2 hidden xl:flex flex-col  px-12 h-screen max-h-full overflow-y-auto ${
        friendId ? "justify-between" : "items-center justify-center"
      }`}
    >
      {friendId ? (
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



export default ChatSection;
