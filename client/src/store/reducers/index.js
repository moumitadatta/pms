import { combineReducers } from 'redux';
import alertReducer from './alertReducer';
import authReducer from './authReducer';
import projectReducer from './projectReducer';
import taskReducer from './taskReducer';

export default combineReducers({
  alert: alertReducer,
  auth: authReducer,
  project: projectReducer,
  task: taskReducer,
});