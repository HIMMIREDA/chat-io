import { useSelector } from "react-redux";
import { parseISO, formatDistanceToNow } from "date-fns";

function ChatItem({ message, refCallback }) {
  const { user } = useSelector((state) => state.auth);
  const { content, from: sender, createdAt } = message;
  const { friends } = useSelector((state) => state.friends);
  const friend = (friends || []).find((friend) => friend.id === sender?._id);

  const timestamp = formatDistanceToNow(parseISO(createdAt));
  return (
    <li className="flex space-x-8 bg-dark2 items-start p-2" ref={refCallback}>
      <div
        className={`avatar placeholder self-center ${
          friend && (friend.connected ? "online" : "offline")
        }`}
      >
        <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
          <span className="text-xl">{sender?.username.slice(0, 2)}</span>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex space-x-6 items-center">
          <h2 className="text-2xl text-white ">
            {user.id === sender._id ? "Me" : sender?.username}
          </h2>
          <span className="text-gray-400 text-xs sm:text-base">{`${timestamp} ago`}</span>
        </div>
        <p className="text-white text-lg">{content}</p>
      </div>
    </li>
  );
}

export default ChatItem;
