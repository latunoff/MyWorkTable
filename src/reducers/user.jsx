import { SET_LOGIN } from '../constants/user';

const initialState = {
    user_id: 0,
    user: ''
  }
  
  export default function user(state = initialState, action) {
    switch (action.type) {
        case SET_LOGIN:
            return { ...state, user: action.login }
        default:    
            return state.user
    }
  }