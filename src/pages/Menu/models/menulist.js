import { queryMenuTreeList,addMenu,deleteMenu,updateMenu } from '@/services/menu';

export default {
  namespace: 'menulist',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMenuTreeList, payload);
      let result={};
      if(response.success){
        let list=[response.data];
        result.list=list;
        let pagination={
          current: 1,
          pageSize:10,
          total:10
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
      const response = yield call(addMenu, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback(response);
    },

    *delete({payload,callback},{call,put}){
      const response = yield call(deleteMenu,payload);
      if (callback) callback(response);
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(updateMenu, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateMenu, payload);
      if (callback) callback(response);
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
