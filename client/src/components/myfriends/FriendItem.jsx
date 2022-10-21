import { FaBan } from "react-icons/fa";

const FriendItem = ({ friend }) => {
  const { username, id } = friend;
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
        <button className="bg-red-500 w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer ">
          <FaBan color="white" />
        </button>
      </div>
    </li>
  );
};

export default FriendItem;
