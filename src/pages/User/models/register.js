import { fakeRegister } from '@/services/register';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined,
    message:'',
  },

  effects: {
    *submit({ payload,callback }, { call, put }) {
      const response = yield call(fakeRegister, payload);
      if(callback) callback(response);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      //setAuthority('user');
      //reloadAuthorized();
      return {
        ...state,
        status: payload.success,
        message:payload.message,
      };
    },
  },
};
