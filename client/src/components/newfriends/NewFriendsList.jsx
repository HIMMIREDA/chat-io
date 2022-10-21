import NewFriendItem from "./NewFriendItem";

const NewFriendsList = ({ newFriendsArray,axiosPrivate }) => {
  return (
    <ul className=" flex flex-col space-y-6 mt-12 px-2">
      {newFriendsArray && newFriendsArray.map((newFriend) => (
        <NewFriendItem friend={newFriend} key={newFriend.id} axiosPrivate={axiosPrivate} />
      ))}
    </ul>
  );
};

export default NewFriendsList;
