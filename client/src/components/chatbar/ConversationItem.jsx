import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function ConversationItem({ friend, active, onClickHandler }) {
  const { id, username, lastMessage, connected, unseenMessagesCount } = friend;
  const item = (
    <>
      <div className={`avatar placeholder ${connected ? "online" : "offline"}`}>
        <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
          <span className="text-xl">{username.slice(0, 2)}</span>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <h2 className="text-xl text-white">{username}</h2>
        <p className="text-xl">
          {lastMessage?.content
            ? (lastMessage.from === id ? `${username}: ` : "You: ") +
              lastMessage.content.substring(0, 20) +
              "..."
            : "No Messages Yet"}
        </p>
      </div>
      {Boolean(unseenMessagesCount) && (
        <div className="badge badge-secondary rounded-full">
          {unseenMessagesCount}
        </div>
      )}
    </>
  );

  const itemForMobile = (
    <Link
      to={`/chat/${id}`}
      className="flex bg-dark1 py-16 h-20 space-x-6 items-center px-2 w-full cursor-pointer hover:bg-base-100 duration-300 xl:hidden"
      onClick={() => onClickHandler(id)}
    >
      {item}
    </Link>
  );
  return (
    <>
      <li
        className={`hidden py-16 h-20 space-x-6 items-center px-2 w-full cursor-pointer hover:bg-base-100 duration-300 xl:flex ${
          active ? "bg-base-100" : "bg-dark1"
        }`}
        onClick={() => onClickHandler(id)}
      >
        {item}
      </li>
      {itemForMobile}
    </>
  );
}

ConversationItem.propTypes = {
  friend: PropTypes.object.isRequired,
};

export default ConversationItem;
