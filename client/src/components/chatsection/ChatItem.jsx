import { useSelector } from "react-redux";
// import {} from "date-fns";

function ChatItem({ message }) {
  const { user } = useSelector((state) => state.auth);
  const { content, from: sender, createdAt } = message;
  const { friends } = useSelector((state) => state.friends);
  const friend = friends.find((friend) => friend.id === sender?._id);

  return (
    <li className="flex space-x-8 bg-dark2 items-start p-2">
      <div
        className={`avatar ${
          friend && (friend.connected ? "online" : "offline")
        }`}
      >
        <div className="w-14 rounded-full">
          <img src="https://placeimg.com/192/192/people" alt="avatar" />
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex space-x-6 items-center">
          <h2 className="text-2xl text-white ">{user.id === sender._id ? "Me" : sender?.username}</h2>
          <span className="text-gray-400">{createdAt}</span>
        </div>
        <p className="text-white text-lg">{content}</p>
      </div>
    </li>
  );
}

export default ChatItem;
