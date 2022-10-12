import ConversationItem from "./ConversationItem";
import Spinner from "./Spinner";
import { useSelector, useDispatch } from "react-redux";
import React from "react";
import {
  clearConversation,
  fetchConversation,
  selectConversation,
} from "../features/conversation/conversationSlice";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useRef } from "react";
import { useEffect } from "react";

function ConversationsList({conversationsItems}) {
  const { friendId } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const abortControllerRef = useRef();

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
  }, [friendId,dispatch,axiosPrivate]);

  if (!conversationsItems) {
    return <Spinner fixed={false} />;
  }
  return (
    <ul className="w-full space-y-10 flex flex-col items-center">
      {conversationsItems.map((friend) => friend.lastMessage && (
        <React.Fragment key={friend.id}>
          <ConversationItem
            friend={friend}
            onClickHandler={() => {
              dispatch(selectConversation(friend.id));
            }}
            active={friendId === friend.id ? true : false}
          />
          <span className="h-1 w-full bg-base-100 lg:w-3/4"></span>
        </React.Fragment>
      ))}
    </ul>
  );
}

export default ConversationsList;
