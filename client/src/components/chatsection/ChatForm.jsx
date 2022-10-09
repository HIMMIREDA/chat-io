import { useState } from "react";
import { FaPaperPlane, FaSmile } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

function ChatForm() {
  const [textInput, setTextInput] = useState("");
  const { friendId } = useSelector((state) => state.conversation);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim() !== "") {
      dispatch({
        type: "socket/sendMessage",
        payload: { content: textInput, to: friendId },
      });
    }
    setTextInput("");
  };
  return (
    <form className="sticky bottom-0 z-30 mb-4" onSubmit={handleSubmit}>
      <label className="relative">
        <i
          type="button"
          className="text-white cursor-pointer absolute top-1/2 transform -translate-y-1/2 left-3 hover:text-yellow-400"
        >
          <FaSmile />
        </i>
        <input
          type="text"
          className="input input-primary bg-base-200 w-full max-w-full py-6 px-12"
          placeholder="Type message..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />
        <button
          type="submit"
          className="text-white cursor-pointer absolute top-1/2 transform -translate-y-1/2 right-3 hover:text-wtsGreen"
        >
          <FaPaperPlane />
        </button>
      </label>
    </form>
  );
}

export default ChatForm;
