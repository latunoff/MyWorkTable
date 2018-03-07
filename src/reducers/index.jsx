import { combineReducers } from 'redux';
import page from './page';
import user from './user';
import message from './message';

export default combineReducers({
  page,
  user,
  message
});