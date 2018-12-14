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