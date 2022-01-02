import {createStore} from 'redux';
import {createWrapper} from 'next-redux-wrapper';

// create your reducer
const reducer = (state = {
  ip: 'http://localhost:300',
  isLogin: false
}, action) => {
  switch (action.type) {
    case 'setIp':
      return {...state, ip:action.payload}
    case 'login':
      return {...state, isLogin:action.payload}
    default:
      return state;
  }
};

// create a makeStore function
const makeStore = context => createStore(reducer);

// export an assembled wrapper
export const wrapper = createWrapper(makeStore, {debug: true});