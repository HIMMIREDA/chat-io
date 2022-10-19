import NewFriendItem from "./NewFriendItem";

const NewFriendsList = ({ newFriendsArray }) => {
  console.log(newFriendsArray)
  return (
    <ul className=" flex flex-col space-y-6 mt-12 px-2">
      {newFriendsArray && newFriendsArray.map((newFriend) => (
        <NewFriendItem friend={newFriend} key={newFriend.id} />
      ))}
    </ul>
  );
};

export default NewFriendsList;
