import { stringify } from 'qs';
import request from '@/utils/request';
// import { baseApi } from '../index-config';
const baseApi='/api/security'

export async function getSubAvgCost(params) {
  const { timeType, beginTime, endTime, ...restParams } = params;
  const url = `${baseApi}/subAvgCost/getSubAvgCost/?type=${timeType}&beginTime=${beginTime}&endTime=${endTime}`;
  const result = request(`${url}&${stringify(restParams)}`);
  return result;
}
//个人负担比例
export async function getBurdenRatio(params) {
  const { timeType, beginTime, endTime,org_codes, ...restParams } = params;
  const url = `${baseApi}/subAvgCost/getBurdenRatio/?type=${timeType}&beginTime=${beginTime}&endTime=${endTime}&org_codes=${org_codes}`;
  const result = request(`${url}&${stringify(restParams)}`);
  return result;
}

//门急诊次均费用趋势和变化率分析
export async function getSubAvgCostTrendAndRate(params) {
  const { timeType, beginTime, endTime,org_codes, ...restParams } = params;
  const url = `${baseApi}/subAvgCost/getSubAvgTrendRate/?type=${timeType}&beginTime=${beginTime}&endTime=${endTime}&org_codes=${org_codes}`;
  const result = request(`${url}&${stringify(restParams)}`);
  return result;
}
//门急诊次均费用构成分析
export async function getCostConsistAnalyse(params) {
  const { timeType, beginTime, endTime,org_codes, ...restParams } = params;
  const url = `${baseApi}/subAvgCost/getCostConsistAnalyse/?type=${timeType}&beginTime=${beginTime}&endTime=${endTime}&org_codes=${org_codes}`;
  const result = request(`${url}&${stringify(restParams)}`);
  return result;
}
export async function getMediacalDrugCostConsistRate(params) {
  const { timeType, beginTime, endTime,org_codes, ...restParams } = params;
  const url = `${baseApi}/subAvgCost/getSubAvgMediacalDrugCostConsistRate/?type=${timeType}&beginTime=${beginTime}&endTime=${endTime}&org_codes=${org_codes}`;
  const result = request(`${url}&${stringify(restParams)}`);
  return result;
}
