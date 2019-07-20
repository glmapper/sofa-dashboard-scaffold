import { stringify } from 'qs';
import request from '../utils/request';

export async function queryApplication(params) {
  return request(`/api/application/list?${stringify(params)}`);
}

export async function queryInstance(params) {
  return request(`/api/instance/list?${stringify(params)}`);
}


