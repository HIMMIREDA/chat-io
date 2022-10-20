import FriendItem from "./FriendItem";

const FriendList = ({ friendsArray }) => {
  return (
    <ul className=" flex flex-col space-y-6 mt-12 px-2">
      {friendsArray && friendsArray.map((friend) => (
        <FriendItem friend={friend} key={friend.id} />
      ))}
    </ul>
  );
};

export default FriendList;
