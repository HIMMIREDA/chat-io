import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { sendRequest } from "../../features/friendrequest/friendRequestSlice";

const NewFriendItem = ({ friend, axiosPrivate }) => {
  const { username, id } = friend;
  const dispatch = useDispatch();
  const [disableSendReq, setDisableSendReq] = useState(false);

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
          className={` w-10 h-10 flex items-center justify-center rounded-lg ${!disableSendReq ? "bg-green-500" : "bg-gray-500"}`}
          onClick={() => {
            dispatch(sendRequest({ axiosPrivate, friendId: id }));
            setDisableSendReq(true);
          }}
          disabled={disableSendReq}
        >
          <FaPlus color="white" />
        </button>
      </div>
    </li>
  );
};

export default NewFriendItem;
