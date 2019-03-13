import { stringify } from 'qs';
import request from '@/utils/request';


export async function queryMessagePageList(params) {
  let pageSize=5;
  let pageNum=1;
  if(params){
    pageSize=params['pageSize'];
    pageNum=params['pageNum'];
  }
  const param={
      pageSize:pageSize,
      pageNum:pageNum
    }
  return request(`/api/security/system/message/list?${stringify(param)}`,{
    method:'POST',
  });
}

export async function addMessage(params) {
  return request('/api/security/system/message/add',{
    method:'POST',
    body:{
      ...params
    }
  });
}

export async function deleteMessage(id) {
  return request(`/api/security/system/message/delete/?id=${id}`,{
    method:'POST'
  });
}

export async function updateMessage(params) {
  return request('/api/security/system/message/update/',{
    method:'POST',
    body:{
      ...params
    }
  });
}

export async function sendMessage(payload) {
  const { id} =payload;
  delete payload.id;
  return request(`/api/security/user/message/send?targets=${id}&type=2`,{
    method:'POST',
    body:{
      ...payload,
    }
  });
}

export async function fetchTargets(payload) {
  const { id} =payload;
  return request(`/api/security/user/message/targets?msgId=${id}`,{
    method:'POST',
  });
}