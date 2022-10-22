import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { selectConversation } from "../../features/conversation/conversationSlice";

function ParticipantItem({ friend }) {
  const dispatch = useDispatch();
  const item = (
    <>
      <div
        className={`avatar placeholder ${
          friend?.connected === true ? "online" : "offline"
        }`}
      >
        <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
          <span className="text-xl">{friend?.username.slice(0, 2)}</span>
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
      <Link
        to={`/chat/${friend.id}`}
        className="xl:hidden border-none flex flex-col items-center space-y-3"
      >
        {item}
      </Link>

      <div className="hidden xl:flex space-x-8 py-4">{item}</div>
    </li>
  );
}

export default ParticipantItem;
