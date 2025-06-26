import api from '../../utils/api';
export const getProjects = () => async (dispatch) => {
  try {
    const res = await api.get('/projects');
    dispatch({
      type: 'GET_PROJECTS',
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: 'PROJECT_ERROR',
      payload: {
        msg: err.response?.statusText || err.message,
        status: err.response?.status || 500
      }
    });
  }
};
