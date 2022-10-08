import ConversationItem from "./ConversationItem";
import Spinner from "./Spinner";
import { useSelector, useDispatch } from "react-redux";
import React from "react";
import { clearConversation, fetchConversation } from "../features/conversation/conversationSlice";
import { useState } from "react";

function ConversationsList() {
  const [activeConversationIndx, setActiveConversationIndx] = useState(null);
  const friends = useSelector((state) => state.friends.friends);
  const dispatch = useDispatch();

  if (!friends) {
    return <Spinner fixed={false} />;
  }
  return (
    <ul className="w-full space-y-10 flex flex-col items-center">
      {friends.map((friend, index) => friend.lastMessage && (
        <React.Fragment key={friend.id}>
          <ConversationItem
            friend={friend}
            onClickHandler={() => {
              if (activeConversationIndx !== index) {
                setActiveConversationIndx(index);
                dispatch(clearConversation());
                dispatch(fetchConversation(friend.id));
              }
            }}
            active={activeConversationIndx === index ? true : false}
          />
          <span className="h-1 w-full bg-base-100 lg:w-3/4"></span>
        </React.Fragment>
      ))}
    </ul>
  );
}

export default ConversationsList;
