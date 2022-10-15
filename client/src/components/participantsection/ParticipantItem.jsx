import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { selectConversation } from "../../features/conversation/conversationSlice";

function ParticipantItem({ friend }) {
  const dispatch = useDispatch();
  const item = (
    <>
      <div
        className={`avatar ${
          friend?.connected === true ? "online" : "offline"
        }`}
      >
        <div className="w-14 rounded-full">
          <img src="https://placeimg.com/192/192/people" alt="avatar" />
        </div>
      </div>
      <h3 className="text-sm xl:text-2xl text-white ">{friend?.username}</h3>
    </>
  );
  

  return (
    <li
      className="flex xl:hover:bg-base-100 xl:w-full py-1 px-2 rounded-full cursor-pointer hover:bg-transparent"
      onClick={() => {
        dispatch(selectConversation(friend.id));
      }}
    >
      <Link to={`/chat/${friend.id}`} className="xl:hidden border-none">
        {item}
      </Link>

      <div className="hidden xl:flex space-x-8 py-4">{item}</div>
    </li>
  );
}

export default ParticipantItem;
