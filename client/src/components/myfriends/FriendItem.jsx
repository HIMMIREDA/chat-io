import { useState } from "react";
import { FaBan } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { deleteFriend, reset } from "../../features/friends/friendsSlice";

const FriendItem = ({ friend, axiosPrivate }) => {
  const { username, id } = friend;
  const dispatch = useDispatch();
  const [disableBlockFriend, setDisableBlockFriend] = useState(false);

  return (
    <li className="flex justify-between   items-center p-5 bg-base-100 rounded-md">
      <div className="flex space-x-6 items-center">
        <div className="avatar">
          <div className="w-10 xl:w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src="https://placeimg.com/192/192/people" alt="avatar" />
          </div>
        </div>
        <h2 className="text-sm sm:text-xl text-white">{username}</h2>
      </div>
      <div className="flex justify-end">
        <button
          className={`w-10 h-10 flex items-center justify-center rounded-lg ${
            !disableBlockFriend ? "bg-red-500" : "bg-gray-500"
          }`}
          disabled={disableBlockFriend}
          onClick={() => {
            dispatch(deleteFriend({ axiosPrivate, friendId: id }));
            setDisableBlockFriend(true);
          }}
        >
          <FaBan color="white" />
        </button>
      </div>
    </li>
  );
};

export default FriendItem;
