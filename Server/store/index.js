import {createStore} from 'redux';
import {createWrapper} from 'next-redux-wrapper';
const env = process.env.forstu
// create your reducer
const reducer = (state = {
  ip: 'http://localhost:300',
  isLogin: env==='y',
  token: ''
}, action) => {
  switch (action.type) {
    case 'setIp':
      return {...state, ip:action.payload}
    case 'login':
      return {...state, isLogin:action.payload}
    case 'set_token':
      return {...state, token:action.payload}
    case 'clear_toekn':
      return {...state, token:''}
    default:
      return state;
  }
};

// create a makeStore function
const makeStore = context => createStore(reducer);

// export an assembled wrapper
export const wrapper = createWrapper(makeStore, {debug: true});