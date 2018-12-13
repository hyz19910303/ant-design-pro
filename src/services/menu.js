import { stringify } from 'qs';
import request from '@/utils/request';


export async function getMenuTreeData() {
  const response=request('/api/security/getMenuData');
  return response;
}