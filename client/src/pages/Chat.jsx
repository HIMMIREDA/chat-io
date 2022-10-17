import ChatBar from "../components/ChatBar";
import ChatSection from "../components/chatsection/ChatSection";
import ParticipantSection from "../components/participantsection/ParticipantSection";
import SideBar from "../components/SideBar";
function Chat() {
  return (
    <>
      <SideBar /> 
      <div className="flex w-full max-h-full flex-col-reverse xl:flex-row bg-dark2">
        <ChatBar />
        <ChatSection />
        <ParticipantSection />
      </div>
    </>
  );
}

export default Chat;
