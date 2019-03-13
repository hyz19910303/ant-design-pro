// import { queryRule, removeRule, addRule, updateRule } from '@/services/api';
import { queryMessagePageList,addMessage,deleteMessage,updateMessage,sendMessage,fetchTargets
 } from '@/services/message';

export default {
  namespace: 'messagelist',

  state: {
    list: [],
    data:[],
    pageSize:5,
    pageNum:1,
  },

  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(queryMessagePageList, payload);
      let result={};
      if(response.success){
        let list=response.data.content;
        result.list=list;
        result.data=list;
        let number=response.data.number+1;
        result.pageNum=number;
        // let total=response.data.totalElements
      }      
      yield put({
        type: 'save',
        payload: result,
      });
      if(callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addMessage, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback(response);
    },

    *delete({payload,callback},{call,put}){
      const { id }=payload;
      const response = yield call(deleteMessage,id);
      if (callback) callback(response);
    },
    *submit({ payload, callback }, { call, put }) {
      const response = yield call(sendMessage, payload);
      if (callback) callback(response);
    },
    *fetchTargets({ payload, callback }, { call, put }) {
      const response = yield call(fetchTargets, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      const data=action.payload.data;
      let pageNum=action.payload.pageNum;
      if(data.length>=state.pageSize){
          pageNum++;
      }
      const list = state.list.concat(data);
      return {
        ...state,
        data: data,
        list:list,
        pageNum:pageNum,
      };
    },
  },
};
