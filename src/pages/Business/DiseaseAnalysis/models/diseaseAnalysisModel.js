// import { xxx } from '../services/xxx';
import {
  getSubAvgCost,
  getBurdenRatio,
  getSubAvgCostTrendAndRate,
  getCostConsistAnalyse,
  getMediacalDrugCostConsistRate,
} from '@/services/business/diseaseAnalysisService';

export default {
  namespace: 'diseaseAnalysisModel',
  state: {
    subAvgCastBarData: [],
    subAvgCastOriginal: {},
    personBurdenRatio: {},
    avgOutPatientEmergencyCost: [],
    CostConsistAnalyse: {},
    MediacalDrugCostConsistRate: {},
  },
  effects: {
    *fetchSubAvgCastData({ payload }, { call, put }) {
      // const response = yield call(getSubAvgCost, {
      //   ...payload,
      // });
      const response = [
        {
          org_name: '北大人民',
          bus_date: '20170101',
          bus_value: 100,
          bus_name: '门急诊人次',
        },
        {
          org_name: '北大人民',
          bus_date: '20170102',
          bus_value: 110,
          bus_name: '门急诊人次',
        },
        {
          org_name: '北大人民',
          bus_date: '20170103',
          bus_value: 120,
          bus_name: '门急诊人次',
        },
        {
          org_name: '北大人民',
          bus_date: '20170104',
          bus_value: 115,
          bus_name: '门急诊人次',
        },
        {
          org_name: '北大人民',
          bus_date: '20170105',
          bus_value: 108,
          bus_name: '门急诊人次',
        },
        {
          org_name: '北大人民',
          bus_date: '20170101',
          bus_value: 10,
          bus_name: '死亡率',
        },
        {
          org_name: '北大人民',
          bus_date: '20170102',
          bus_value: 9,
          bus_name: '死亡率',
        },
        {
          org_name: '北大人民',
          bus_date: '20170103',
          bus_value: 9,
          bus_name: '死亡率',
        },
        {
          org_name: '北大人民',
          bus_date: '20170104',
          bus_value: 3,
          bus_name: '死亡率',
        },
        {
          org_name: '北大人民',
          bus_date: '20170105',
          bus_value: 5,
          bus_name: '死亡率',
        },
      ];

      yield put({
        type: 'show',
        payload: {
          subAvgCastBarData: response,
        },
      });
    },
    *fetchBurdenRatio({ payload }, { call, put }) {
      const response = yield call(getBurdenRatio, {
        ...payload,
        'indexCodes[]': ['2-C000101-1', '2-C000101-2', '2-C000101-3'].join(','),
      });
      yield put({
        type: 'show',
        payload: {
          personBurdenRatio: response.data,
        },
      });
    },
    *fetchSubAvgCostTrendAndRate({ payload }, { call, put }) {
      const response = yield call(getSubAvgCostTrendAndRate, {
        ...payload,
        'indexCodes[]': ['2-C000101-25', '2-C000101-26'].join(','),
      });

      yield put({
        type: 'show',
        payload: {
          avgOutPatientEmergencyCost: response.data,
        },
      });
    },
    *fetchCostConsistAnalyse({ payload }, { call, put }) {
      const response = yield call(getCostConsistAnalyse, {
        ...payload,
      });
      yield put({
        type: 'show',
        payload: {
          CostConsistAnalyse: response.data,
        },
      });
    },
    *fetchMediacalDrugCostConsistRate({ payload }, { call, put }) {
      const response = yield call(getMediacalDrugCostConsistRate, {
        ...payload,
      });
      yield put({
        type: 'show',
        payload: {
          MediacalDrugCostConsistRate: response.data,
        },
      });
    },
  },
  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
