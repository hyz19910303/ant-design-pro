import { fetchSecurityInfo,updatePassword, updateEmail,updatePhonoNo } from '@/services/securityview';

export default {
  namespace: 'securityview',

  state: {
    confirmLoading: false,
    phono_number:"未绑定" ,
    email:"未绑定",
    passwordStatus:"weak",
  },

  effects: {
    *fetchUserSecurityInfo({payload}, { call, put }){
        const response = yield call(fetchSecurityInfo,payload);
        yield put({
          type:'updateUserInfo',
          payload:response.data
        });
    },
    *updatePassword({payload,callback}, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(updatePassword,payload);
      if(callback){
        callback(response);
      }
      yield put({
        type:'updatePasswordStatus',
        payload:response.data,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *updateEmail({ payload,callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(updateEmail, payload);
      if(callback){
        callback(response);
      }
      yield put({
        type: 'updateEmailStatus',
        payload: payload,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *updatePhonoNo({payload , callback},{call,put}){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(updatePhonoNo, payload);
      if(callback){
        callback(response);
      }
      yield put({
        type: 'updatePhonoNoStatus',
        payload: payload,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    changeLoading(state, action) {
      return {
        ...state,
        confirmLoading: action.payload,
      };
    },
    updateUserInfo(state, action){
      return {
          ...state,
          ...action.payload,
      };
    },
    updatePasswordStatus(state, action){
      return {
          ...state,
         passwordStatus:action.payload
      };
    },
    updatePhonoNoStatus(state, action){
      return {
          ...state,
         phono_number:action.payload.phono_number
      };
    },
    updateEmailStatus(state, action){
      return {
          ...state,
         email:action.payload.email
      };
    }
  },
};
