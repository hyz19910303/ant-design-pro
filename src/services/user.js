import { stringify } from 'qs';
import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

////////////////////////////
export async function queryUserList(params) {
  let pageSize=10;
  let pageNum=0;
  if(params){
	pageSize=params['pageSize'];
	pageNum=params['pageNum'];
  }
  return request(`/api/security/user/list?${stringify(params)}`,{
  	method:'POST',
  	body:{
  		pageSize,
  		pageNum
  	}
  });
}



export async function addUser(params) {
  return request('/api/security/user/add',{
    method:'POST',
    body:{
      ...params
    }
  });
}

export async function deleteUser(params) {
  const {record} =params
  return request(`/api/security/user/delete/${record.id}`,{
    method:'POST'
  });
}

export async function updateUser(params) {
  return request('/api/security/user/update/',{
    method:'POST',
    body:{
      ...params
    }
  });
}
//查看用户角色分配情况
export async function queryUserRolesDetail(params) {
  const { selectedRows} =params;
  let userids=[];
  selectedRows.map(item=>{
    userids.push(item.id);
  });
  return request(`/api/security/user/assignRoles?ids=${userids.join(',')}`,{
    method:'POST',
  });
}
//分配角色
export async function allignRoles(params) {
  const {userids,roleids} =params;
  return request(`/api/security/userRefRole/assignRole/?userids=${userids.join(',')}&roleids=${roleids.join(',')}`,{
    method:'POST',
  });
}