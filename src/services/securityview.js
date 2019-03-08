import { stringify } from 'qs';
import request from '@/utils/request';


export async function fetchSecurityInfo(payload) {
  return request('/api/security/fetchSecurityInfo',{
    method:'POST'
  });
}

export async function updatePassword(payload) {
  const { password} =payload;
  return request(`/api/security/updatePassword?password=${password}`,{
    method:'POST'
  });
}

export async function updateEmail(payload) {
  const { email} =payload;
  return request(`/api/security/updateEmail?email=${email}`,{
    method:'POST'
  });
}


export async function updatePhonoNo(payload) {
  const { phono_number}=payload;
  return request(`/api/security/updatePhonoNo?phono_number=${phono_number}`,{
    method:'POST'
  });
}

