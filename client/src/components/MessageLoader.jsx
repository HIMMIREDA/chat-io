import { BeatLoader } from "react-spinners";

function MessageLoader() {
  return (
    <div className="absolute w-full flex justify-center">
      <BeatLoader size={15} color="#00A884" />
    </div>
  );
}

export default MessageLoader;
