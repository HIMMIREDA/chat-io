import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchConversation,
  clearConversation,
  reset,
} from "../../features/conversation/conversationSlice";
import ChatItem from "./ChatItem";
import MessageLoader from "../MessageLoader";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";


function ChatList() {
  const { friendId, isLoading, isError, conversation, message, nextPage } =
    useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  const axiosPrivate = useAxiosPrivate();

  const recentMessage = conversation.at(0);

  const bottomRef = useRef();
  const abortControllerRef = useRef();
  const lastPosScroll = useRef();
  const observer = useRef(); // ref for intersection observer

  // callback ref
  const lastMessageRef = useCallback(
    (node) => {
      if (isLoading) {
        if (node) lastPosScroll.current = node
        return;
      }

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(
        (entries) => {
          const target = entries[0];
          if (target.isIntersecting && nextPage) {
            abortControllerRef.current = new AbortController();
            dispatch(
              fetchConversation({
                axiosPrivate,
                abortController: abortControllerRef.current,
              })
            );
          }
        },
        {
          root: null,
          threshold: 1,
        }
      );
      if (node) {
        lastPosScroll.current?.scrollIntoView(true);
        observer.current.observe(node);
      }
    },
    [isLoading, nextPage, dispatch, axiosPrivate]
  );

  useEffect(() => {
    if (friendId) {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      dispatch(clearConversation());
      dispatch(
        fetchConversation({
          axiosPrivate,
          friendId,
          abortController: abortControllerRef.current,
        })
      );
    }
    return () => abortControllerRef.current?.abort();
  }, [friendId, dispatch, axiosPrivate]);

  useEffect(() => {
    if (isLoading) return;
    if (isError && message) {
      toast.error(message);
    }
    dispatch(reset());
  }, [isError, message, dispatch, isLoading]);

  // scroll to bottom when recent messages get added
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: lastPosScroll.current ? "smooth" : "instant",
    });
  }, [recentMessage]);



  return (
    <div className="container mx-auto space-y-8 flex flex-col py-4">
      <ul className="space-y-12 relative">
        {isLoading && <MessageLoader />}
        {conversation
          .slice()
          .reverse()
          .map((message, index) => {
            if (index === 0) {
              return (
                <ChatItem
                  key={message._id}
                  message={message}
                  refCallback={lastMessageRef}
                />
              );
            } else {
              return <ChatItem key={message._id} message={message} />;
            }
          })}
        <div ref={bottomRef} />
      </ul>
    </div>
  );
}

export default ChatList;
