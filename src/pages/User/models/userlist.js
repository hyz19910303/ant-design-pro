import { queryRule, removeRule, addRule, updateRule } from '@/services/api';
import { queryUserList } from '@/services/user';

export default {
  namespace: 'userlist',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUserList, payload);
      let result={};
      if(response.success){
        result.list=response.data.content;
        let number=response.data.number;
        let pagination={
          current: number==0?1:number,
          pageSize:response.data.size,
          total:response.data.totalElements
        };
        result.pagination=pagination;
      }else{
        result=response;
      }
      yield put({
        type: 'save',
        payload: result,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
