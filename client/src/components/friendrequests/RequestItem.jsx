import { useState } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { acceptRequest, deleteRequest } from "../../features/friendrequest/friendRequestSlice";

const RequestItem = ({ request, axiosPrivate }) => {
  const [disableAcceptReq, setDisableAcceptReq] = useState(false);
  const [disableDeleteReq, setDisableDeleteReq] = useState(false);

  const {
    id: requestId,
    from: { username },
  } = request || {};
  const dispatch = useDispatch();
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
      <div className="flex justify-end space-x-2">
        <button className={`bg-green-500 w-10 h-10 flex items-center justify-center rounded-lg ${!disableAcceptReq ? "bg-green-500" : "bg-gray-500"}`}
        disabled={disableAcceptReq}
        onClick={() => {
          dispatch(acceptRequest({axiosPrivate, requestId}));
          setDisableAcceptReq(true);
        }}
        >
          <FaCheck color="white" />
        </button>
        <button className={`w-10 h-10 flex items-center justify-center rounded-lg ${!disableDeleteReq ? "bg-red-500" : "bg-gray-500"}`}
        disabled={disableDeleteReq}
        onClick={() => {
          dispatch(deleteRequest({axiosPrivate, requestId}));
          setDisableDeleteReq(true);
        }}
        >
          <FaTrash color="white" />
        </button>
      </div>
    </li>
  );
};

export default RequestItem;
