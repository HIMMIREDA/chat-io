import PropTypes from "prop-types";

function ConversationItem({ friend }) {
  const { username, lastMessage, connected, unseenMessageCount } = friend;
  return (
    <li className="flex bg-dark1 py-16 h-20 space-x-6 items-center px-2 w-full cursor-pointer hover:bg-base-100 duration-300">
      <div className={`avatar ${connected ? "online" : "offline"}`}>
        {/* avatar */}
        <div className="w-14 rounded-full">
          <img src="https://placeimg.com/192/192/people" />
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <h2 className="text-xl text-white">{username}</h2>
        <p className="text-xl">
          {lastMessage.at(10) ? lastMessage.at(0).slice(0, 20) : "No Messages Yet"}
        </p>
      </div>
      {unseenMessageCount && (
        <div className="badge badge-secondary rounded-full">
          {unseenMessageCount}
        </div>
      )}
    </li>
  );
}

ConversationItem.propTypes = {
  friend: PropTypes.object.isRequired,
};

export default ConversationItem;
