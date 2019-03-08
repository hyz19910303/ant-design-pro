import { stringify } from 'qs';
import request from '@/utils/request';




export async function queryOrganTreeList(params) {
  let pageSize=10;
  let pageNum=0;
  if(params){
	pageSize=params['pageSize'];
	pageNum=params['pageNum'];
  }
  return request('/api/security/system/organ/tree/list');
}

export async function addOrgan(params) {
  return request('/api/security/system/organ/add',{
    method:'POST',
    body:{
      ...params
    }
  });
}

export async function deleteOrgan(params) {
  const {record} =params
  return request(`/api/security/system/organ/delete/${record.id}`,{
    method:'POST'
  });
}

export async function updateOrgan(params) {
  return request('/api/security/system/organ/update/',{
    method:'POST',
    body:{
      ...params
    }
  });
}