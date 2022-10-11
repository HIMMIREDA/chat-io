

function ParticipantItem({ friend }) {
  return (
    <li
              className="flex space-x-8 hover:bg-base-100 w-full py-4 px-2 rounded-full cursor-pointer"
            >
              <div className={`avatar ${friend?.connected === true ? "online" : "offline"}`}>
                <div className="w-14 rounded-full">
                  <img src="https://placeimg.com/192/192/people" />
                </div>
              </div>
              <h3 className="text-sm xl:text-2xl text-white ">{friend?.username}</h3>
            </li>
  );
}

export default ParticipantItem;
