const LIMIT = 10;

const fetchConversation = async (axiosPrivate, abortController, friendId, token, page) => {
  if (page === null) {
    return [];
  }
  const response = await axiosPrivate.get(
    `/messages/${friendId}?page=${page}&limit=${LIMIT}`,
    {
      signal: abortController.signal,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      
    },
  );

  return response.data;
};

const conversationService = {
  fetchConversation,
};

export default conversationService;
