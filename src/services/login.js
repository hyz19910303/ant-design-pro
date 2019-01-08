import { stringify } from 'qs';
import request from '@/utils/request';

export async function getFakeCaptchaImg() {
  var stmp=new Date().getTime()
  return '/api/security/captcha?_='+stmp;
}

