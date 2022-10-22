import { useEffect } from "react";
import { useState } from "react";
import { FaBan } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { deleteFriend, reset } from "../../features/friends/friendsSlice";
import { toast } from "react-toastify";

const FriendItem = ({ friend, axiosPrivate }) => {
  const { username, id } = friend;
  const dispatch = useDispatch();
  const { isSuccess, isError, message } = useSelector((state) => state.friends);
  const [disableBlockFriend, setDisableBlockFriend] = useState(false);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }

    dispatch(reset());
  }, [isError, dispatch, isSuccess, message]);
  return (
    <li className="flex justify-between   items-center p-5 bg-base-100 rounded-md">
      <div className="flex space-x-6 items-center">
        <div className="avatar placeholder">
          <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
            <span className="text-xl">{username.slice(0, 2)}</span>
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
