// import { queryRule, removeRule, addRule, updateRule } from '@/services/api';
import { queryRolePageList,addRole,deleteRole,updateRole,queryRoleMenusDetail,assignRoleMenus } from '@/services/role';

export default {
  namespace: 'rolelist',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRolePageList, payload);
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
      const response = yield call(addRole, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback(response);
    },

    *delete({payload,callback},{call,put}){

      const response = yield call(deleteRole,payload);
      if (callback) callback(response);
    },

    *remove({ payload, callback }, { call, put }) {

      const response = yield call(updateRole, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRole, payload);
      if (callback) callback(response);
    },
    *roleAssignMenus({ payload, callback }, { call, put }) {
      const response = yield call(queryRoleMenusDetail, payload);
      if (callback) callback(response);
    },
    *assignRoleMenus({ payload, callback }, { call, put }) {
      const response = yield call(assignRoleMenus, payload);
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
