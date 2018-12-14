import { queryRule, removeRule, addRule, updateRule } from '@/services/api';
import { queryUserList,addUser } from '@/services/user';

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
        let list=response.data.content;
        list=list.map(item=>{
          item['key']=item['id']||item['ID']
          return item;
        })
        result.list=list;
        let number=response.data.number;
        let pagination={
          current: number+1,
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
      const response = yield call(addUser, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback(response);
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
