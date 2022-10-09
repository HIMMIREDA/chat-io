import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Spinner";
import { toast } from "react-toastify";
import { reset } from "../../features/conversation/conversationSlice";
import ChatItem from "./ChatItem";
import { useRef } from "react";

function ChatList() {
  const { isLoading, isError, conversation, message } = useSelector(
    (state) => state.conversation
  );
  const bottomRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(reset());
  }, [isError, isLoading, message, dispatch]);

  // scroll to bottom when messages get added
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  if (isLoading) {
    return <Spinner fixed={false} />;
  }
  return (
    <div className="container mx-auto space-y-8 flex flex-col py-4">
      <ul className="space-y-12">
        {conversation.slice().reverse().map((message) => (
          <ChatItem key={message._id} message={message} />
        ))}
        <div ref={bottomRef} />
      </ul>
    </div>
  );
}

export default ChatList;
