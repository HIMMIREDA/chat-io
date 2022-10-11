import ParticipantList from "./ParticipantList";


function ParticipantSection() {
  return (
    <section className="bg-dark1 xl:block px-4 py-8 overflow-x-scroll overflow-y-clip xl:overflow-y-scroll h-32 xl:h-screen max-h-full max-w-full xl:w-1/4">
      <h1 className="text-2xl xl:text-3xl mb-4 text-center text-white hidden xl:block">
        Participants
      </h1>
      <div className="flex flex-col xl:container mx-auto items-start px-2">
        <ParticipantList />
      </div>
    </section>
  );
}

export default ParticipantSection;
