// import { xxx } from '../services/xxx';
import {
  getSubAvgCost,getBurdenRatio,getSubAvgCostTrendAndRate,getCostConsistAnalyse,getMediacalDrugCostConsistRate
} from '@/services/business/diseaseAnalysisService';


export default {
  namespace: 'diseaseAnalysisModel',
  state: {
    subAvgCastBarData: {},
    subAvgCastOriginal:{},
    personBurdenRatio:{},
    avgOutPatientEmergencyCost:[],
    CostConsistAnalyse:{},
    MediacalDrugCostConsistRate:{},
  },
  effects: {
    *fetchSubAvgCastData({ payload }, { call, put }) {
      const response = yield call(getSubAvgCost, {
        ...payload,
      });
      yield put({
        type: 'show',
        payload: {
          subAvgCastBarData: response.data.barData,
          subAvgCastOriginal: response.data.original,
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
        'indexCodes[]': ['2-C000101-25','2-C000101-26'].join(','),
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
    }
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

