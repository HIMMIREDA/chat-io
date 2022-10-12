import ConversationsList from "./ConversationsList";
import { useState } from "react";
import { useSelector } from "react-redux";

function ChatBar() {
  let [searchQuery, setSearchQuery] = useState("");
  const { friends } = useSelector((state) => state.friends);

  return (
    <section className="bg-dark1 w-full h-screen max-h-full overflow-y-auto px-4 py-8 flex flex-col items-center xl:w-1/4 space-y-10 pb-40">
      <input
        type="text"
        placeholder="Search conversation..."
        className="input min-h-12 w-full max-w-xs bg-lightGrey"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ConversationsList
        conversationsItems={friends?.filter((item) => {
          if (searchQuery === "") {
            return true;
          } else if (
            item.username.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            return true;
          } else {
            return false;
          }
        })}
      />
    </section>
  );
}

export default ChatBar;
