import { useSelector } from "react-redux";
import ParticipantItem from "./ParticipantItem";

function ParticipantList() {
  const { friends } = useSelector((state) => state.friends);

  const onlineFriends = (friends || []).filter(
    (friend) => friend.connected === true
  );
  const offlineFriends = (friends || []).filter(
    (friend) => friend.connected === false
  );

  return (
    <>
      <h2 className="text-xl xl:text-2xl text-gray-600 mb-6 hidden xl:block">
        Online - ({onlineFriends.length})
      </h2>
      <ul className="flex items-center  space-x-6 xl:space-y-6 xl:space-x-0 w-full xl:flex-col xl:items-start">
        {onlineFriends.map((friend) => (
          <ParticipantItem key={friend.id} friend={friend} />
        ))}
      </ul>
      <h2 className="text-xl xl:text-2xl mt-11 text-gray-600 mb-6 hidden xl:block">
        Offline - ({offlineFriends.length})
      </h2>
      <ul className="flex-col space-y-6 w-full hidden xl:flex">
        {offlineFriends.map((friend) => (
          <ParticipantItem key={friend.id} friend={friend} />
        ))}
      </ul>
    </>
  );
}

export default ParticipantList;
