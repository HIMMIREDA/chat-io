const fetchFriends = async (axiosPrivate, abortController, token) => {
  const response = await axiosPrivate.get(`/friends/details`, {
    signal: abortController.signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const deleteFriend = async (axiosPrivate, token, friendId) => {
  const response = await axiosPrivate.delete(`/friends/${friendId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const friendsService = {
  deleteFriend,
  fetchFriends,
};

export default friendsService;
