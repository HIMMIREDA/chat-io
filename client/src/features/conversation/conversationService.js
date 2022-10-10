
const LIMIT = 10;

const fetchConversation = async (axiosPrivate ,friendId, token, page) => {
  const response = await axiosPrivate.get(
    `/messages/${friendId}?page=${page}&limit=${LIMIT}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

const conversationService = {
  fetchConversation,
};

export default conversationService;
