import ConversationsList from "./ConversationsList";

function ChatBar() {
  return (
    <section className="bg-dark1 w-full h-screen max-h-full overflow-y-auto px-4 py-8 flex flex-col items-center xl:w-1/4 space-y-10 pb-40">
      <input
        type="text"
        placeholder="Search conversation..."
        className="input min-h-12 w-full max-w-xs bg-lightGrey"
      />
      <ConversationsList />
    </section>
  );
}

export default ChatBar;
