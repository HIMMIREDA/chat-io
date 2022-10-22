import { useSelector } from "react-redux";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

function ChatSectionHeader({ showBackBtn }) {
  const { friendId } = useSelector((state) => state.conversation);
  const { friends } = useSelector((state) => state.friends);
  const friend = (friends || []).find((friend) => friend.id === friendId);

  return (
    <div className="flex flex-col space-y-2 mt-2 mb-4 bg-dark2 sticky top-0 z-30">
      <div className="flex space-x-5 sticky top-0 items-center">
        {showBackBtn && (
          <Link to="/chat">
            <FaArrowAltCircleLeft color="#fff" size={35} className="mt-2" />
          </Link>
        )}
        <div
          className={`avatar placeholder ${
            friend?.connected ? "online" : "offline"
          }`}
        >
          <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
            <span className="text-xl">{friend?.username.slice(0, 2)}</span>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl text-white">{friend?.username}</h1>
      </div>
      <span className="h-1 w-full bg-base-300"></span>
    </div>
  );
}

ChatSectionHeader.defaultProps = {
  showBackBtn: false,
};

export default ChatSectionHeader;
