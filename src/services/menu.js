import { stringify } from 'qs';
import request from '@/utils/request';


export async function getMenuTreeData() {
  const response=request('/api/security/getMenuData');
  return response;
}

export async function queryMenuTreeList(params) {
  let pageSize=10;
  let pageNum=0;
  if(params){
	pageSize=params['pageSize'];
	pageNum=params['pageNum'];
  }
  return request('/api/security/menu/tree/list');
}

export async function addMenu(params) {
  return request('/api/security/menu/add',{
    method:'POST',
    body:{
      ...params
    }
  });
}

export async function deleteMenu(params) {
  const {record} =params
  return request(`/api/security/menu/delete/${record.id}`,{
    method:'POST'
  });
}

export async function updateMenu(params) {
  return request('/api/security/menu/update/',{
    method:'POST',
    body:{
      ...params
    }
  });
}