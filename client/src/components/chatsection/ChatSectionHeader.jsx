import { useSelector } from "react-redux";

function ChatSectionHeader() {
  const { friendId } = useSelector((state) => state.conversation);
  const {friends} = useSelector(state => state.friends);
  const friend = (friends || []).find((friend) => friend.id === friendId);

  
  return (
    <div className="flex flex-col space-y-2 mt-2 mb-4 bg-dark2 sticky top-0 z-30">
      <div className="flex space-x-12 sticky top-0">
        <div className={`avatar ${friend?.connected ? "online" : "offline"}`}>
          <div className="w-14 rounded-full">
            <img src="https://placeimg.com/192/192/people" alt="avatar"/>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl text-white">{friend?.username}</h1>
      </div>
      <span className="h-1 w-full bg-base-300"></span>
    </div>
  );
}

export default ChatSectionHeader;
