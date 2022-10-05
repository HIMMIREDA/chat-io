import ConversationItem from "./ConversationItem";
import Spinner from "./Spinner";
import { useSelector, useDispatch } from "react-redux";

function ConversationsList() {
  const friends = useSelector((state) => state.friends.friends);
  const dispatch = useDispatch();

  if (!friends) {
    return <Spinner />;
  }
  return <ul className="w-full space-y-10 flex flex-col items-center">
    {friends.map((friend) => (
        <ConversationItem key={friend.id} friend={friend} />    
    ))}
  </ul>;
}

export default ConversationsList;
