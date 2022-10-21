const fetchFriendRequests = async (axiosPrivate, abortController, token) => {
  const response = await axiosPrivate.get(`/friendrequests`, {
    signal: abortController.signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const deleteRequest = async (axiosPrivate, token, requestId) => {
  const response = await axiosPrivate.delete(`/friendrequests/${requestId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const sendRequest = async (axiosPrivate, token, friendId) => {
  const response = await axiosPrivate.post(
    `/friendrequests`,
    { friendId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

const acceptRequest = async (axiosPrivate, token, requestId) => {
  const response = await axiosPrivate.put(`/friendrequests/${requestId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const friendRequestService = {
  fetchFriendRequests,
  deleteRequest,
  sendRequest,
  acceptRequest,
};

export default friendRequestService;
