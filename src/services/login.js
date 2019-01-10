import { stringify } from 'qs';
import request from '@/utils/request';

export async function getFakeCaptchaImg() {
  var stmp=new Date().getTime()
  return request('/api/security/captcha');
}


export async function fakeAccountLogin(params) {
  const { captcha,username,password,type,...restProps} =params
  return request(`/api/security/login?${stringify(params)}`, {
    method: 'POST',
    body: {}
  });
}

