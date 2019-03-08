import request from '@/utils/request';

export async function queryProvince() {
  return request('/api/security/geographic/province',{
  	method:'POST'
  });
}

export async function queryCity(province) {
  return request(`/api/security/geographic/city/${province}`,{
  	method:'POST'
  });
}
