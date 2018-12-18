import { stringify } from 'qs';
import request from '@/utils/request';


export async function queryRoleList(params) {
  let pageSize=10;
  let pageNum=0;
  if(params){
	pageSize=params['pageSize'];
	pageNum=params['pageNum'];
  }
  return request(`/api/security/role/list?${stringify(params)}`,{
  	method:'POST',
  	body:{
  		pageSize,
  		pageNum
  	}
  });
}

export async function addRole(params) {
  return request('/api/security/role/add',{
    method:'POST',
    body:{
      ...params
    }
  });
}

export async function deleteRole(params) {
  const {record} =params
  return request(`/api/security/role/delete/${record.id}`,{
    method:'POST'
  });
}

export async function updateRole(params) {
  return request('/api/security/role/update/',{
    method:'POST',
    body:{
      ...params
    }
  });
}