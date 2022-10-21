import RequestItem from "./RequestItem";

const RequestList = ({ requests, axiosPrivate }) => {
  return (
    <ul className=" flex flex-col space-y-6 mt-12 px-2">
      {requests && requests.map((request) => (
        <RequestItem request={request} axiosPrivate={axiosPrivate} key={request.id}  />
      ))}
    </ul>
  );
};

export default RequestList;