const initialState = {
    message: ''
  }
  
  export default function message(state = initialState, action) {
    switch (action.type) {
        case 'MESSAGE_OK':
            return { ...state, message: action.ok }
        case 'MESSAGE_WARNING':
            return { ...state, message: action.warning }
        case 'MESSAGE_ERROR':
            return { ...state, message: action.error }
        default:    
            return state.message
    }
  }