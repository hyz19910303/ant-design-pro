import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeRegister(params) {
  return request('/api/security/system/user/register', {
    method: 'POST',
    body: params,
  });
}
