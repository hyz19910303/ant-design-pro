import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
//import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { fakeAccountLogin,getFakeCaptchaImg } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload , callback}, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.success) {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const token = response.token;
        localStorage.setItem('token',token);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }else {
        if(callback) callback(response);
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *getCaptchaImg({ payload,callback }, { call }){
       const imgsrc=yield call(getFakeCaptchaImg, payload);

       if(callback){
         callback(imgsrc);
       }
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: undefined,
        },
      });
      
      var href=window.location.href;
      var index=-1;
      if((index=href.indexOf('redirect'))>0){
        href=href.substr(0,index-1);
      }
      reloadAuthorized();
      if(href.indexOf('/user/login')>0){
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({}),
          })
        );
      }else{
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: href,
            }),
          })
        );
      } 
      
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
