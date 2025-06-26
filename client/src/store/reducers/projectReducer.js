// src/store/reducers/projectReducer.js
import {
  GET_PROJECTS,
  GET_PROJECT,
  PROJECT_ERROR
} from '../actions/types';

const initialState = {
  projects: [],
  project: null,
  loading: true,
  error: {}
};

const projectReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_PROJECTS:
      return {
        ...state,
        projects: payload,
        loading: false
      };
    case GET_PROJECT:
      return {
        ...state,
        project: payload,
        loading: false
      };
    case PROJECT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
};

export default projectReducer;