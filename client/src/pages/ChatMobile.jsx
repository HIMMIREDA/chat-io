import React from "react";
import { useParams } from "react-router-dom";
import ChatSectionMobile from "../components/chatsection/ChatSectionMobile";

function ChatMobile() {
  const { id } = useParams();

  return <ChatSectionMobile id={id} />;
}

export default ChatMobile;
