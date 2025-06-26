import api from '../../utils/api';
import { setAlert } from './alertActions';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGIN_REQUEST,  // Add this new type
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
} from './types';
import setAuthToken from '../../utils/setAuthToken';

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await api.get('/auth/me');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/auth/register', formData);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    // Set token if available
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
    }

    // Load user data
    await dispatch(loadUser());

  } catch (err) {
    let errorMessage = 'Registration failed';
    let errors = {};

    if (err.response) {
      // Server responded with error status (4xx, 5xx)
      if (err.response.data?.errors) {
        errors = err.response.data.errors;
        errorMessage = 'Validation errors';
      } else if (err.response.data?.message) {
        errorMessage = err.response.data.message;
      }
    } else if (err.request) {
      // Request was made but no response received
      errorMessage = 'No response from server - check your connection';
    } else {
      // Something else happened in setting up the request
      errorMessage = err.message || errorMessage;
    }

    // Dispatch alerts for each error
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        dispatch(setAlert(error.msg || error, 'danger'));
      });
    } else {
      dispatch(setAlert(errorMessage, 'danger'));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};
// Login User
export const login = (email, password, navigate) => async (dispatch) => {
  const body = { email, password };

  try {
    // Dispatch loading state
    dispatch({ type: LOGIN_REQUEST });
    
    const res = await api.post('/auth/login', body);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
      token: res.data.token,
      user: res.data.data  // assuming `data` is the user object
    },
    });

    // Set the token in localStorage and axios headers
    localStorage.setItem('token', res.data.token);
    setAuthToken(res.data.token);

    // Load user data
    const userRes = await api.get('/auth/me');
    dispatch({
      type: USER_LOADED,
      payload: userRes.data.data,
    });

    // Only navigate after everything is complete
    if (navigate) {
      navigate('/dashboard');
    }
  } catch (err) {
    const errors = err.response?.data?.errors || [];

    if (errors.length > 0) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    } else {
      dispatch(setAlert('Login failed', 'danger'));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout / Clear Profile
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};