import { query as queryUsers, queryCurrent,saveBaseInfo } from '@/services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *updateBaseInfo({payload,callback},{call,put}){
      const{id, geographic : {city}, geographic:{ province },...rest} = payload;
      const userinfo={
        id:id,
        cityCode:city.key,
        cityName:city.label,
        provinceCode:province.key,
        provinceName:province.label,
        ...rest,
      };
      const response = yield call(saveBaseInfo,userinfo);
      if(callback){
          callback(response);
      }
      if(response.success){
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
      }
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
