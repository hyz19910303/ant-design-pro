import { queryUserList,addUser,deleteUser,updateUser,queryUserRolesDetail,allignRoles } from '@/services/user';
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
        // list=list.map(item=>{
        //   item['key']=item['id']||item['ID']
        //   return item;
        // })
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

    *delete({payload,callback},{call,put}){

      const response = yield call(deleteUser,payload);
      if (callback) callback(response);
    },

    *remove({ payload, callback }, { call, put }) {

      const response = yield call(updateUser, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateUser, payload);
      if (callback) callback(response);
    },
    *useroles({ payload, callback }, { call, put }){
      const response = yield call(queryUserRolesDetail, payload);
      if (callback) callback(response);
    },
    *assignRoles({ payload, callback }, { call, put }){
      const response = yield call(allignRoles, payload);
      if (callback) callback(response);
    }
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
