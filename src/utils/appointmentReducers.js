export const modifyAppointment = (state, action) => {
  if (action) {
    return action.map((item) => {
      return {
        userId: item.userId,
        title: item.title,
        id: item.id,
      };
    });
  } else {
    return state;
  }
};
