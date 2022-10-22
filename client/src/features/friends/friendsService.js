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
};


export default friendsService;
