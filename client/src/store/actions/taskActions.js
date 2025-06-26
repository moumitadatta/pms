import api from '../../utils/api';
export const getTasks = () => async (dispatch) => {
  try {
    const res = await api.get('/tasks');
    dispatch({
      type: 'GET_TASKS',
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: 'TASK_ERROR',
      payload: {
        msg: err.response?.statusText || err.message,
        status: err.response?.status || 500
      }
    });
  }
};
