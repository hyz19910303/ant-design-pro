import { stringify } from 'qs';
import request from '@/utils/request';


export async function queryRoleList(params) {
  return request('/api/security/system/role/list',{
  	method:'POST',
  });
}

export async function queryRolePageList(params) {
  let pageSize=10;
  let pageNum=0;
  if(params){
    pageSize=params['pageSize'];
    pageNum=params['pageNum'];
  }
  return request(`/api/security/system/role/list?${stringify(params)}`,{
    method:'POST',
  });
}

export async function addRole(params) {
  return request('/api/security/system/role/add',{
    method:'POST',
    body:{
      ...params
    }
  });
}

export async function deleteRole(params) {
  const {record} =params
  return request(`/api/security/system/role/delete/${record.id}`,{
    method:'POST'
  });
}

export async function updateRole(params) {
  return request('/api/security/system/role/update/',{
    method:'POST',
    body:{
      ...params
    }
  });
}

export async function queryRoleMenusDetail(params) {
  const { selectedRows} =params;
  let userids=[];
  selectedRows.map(item=>{
    userids.push(item.id);
  });
  return request(`/api/security/system/role/assignMenus/?ids=${userids.join(',')}`,{
    method:'POST',
  });
}

export async function assignRoleMenus(params) {
  const { menuids,roleids} =params;
  return request(`/api/security/system/roleRefMenu/assignMenus?menuids=${menuids.join(',')}&roleids=${roleids.join(',')}`,{
    method:'POST',
  });
}