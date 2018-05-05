
let path = '';
if (__DEV__) path = '/signin';
if (__PROD__) path = '/api';
import { _fetch } from '../tools/';

import { message } from 'antd';

let actions = {
    //actionCreator
    actionCreator: (type, state) => ({
        type: type,
        payload: state
    }),
    //cb是返回的回调方法
    getAfterSaleOrderList: (param, cb) => (dispatch, getState) => {
        _fetch({
            type:'POST',
            url: '/serviceOrder/list',
            data: param,
            success: json => {
                // console.log('_fetch');
                // console.log(json);
                //返回json
               cb && cb(json);
            }
        });

    },
     //cb是返回的回调方法
    getSalesOrderList: (param, cb) => (dispatch, getState) => {
        _fetch({
            type:'GET',
            url: '/order/list',
            data: param,
            success: json => {
                // console.log('_fetch');
                // console.log(json);
                //返回json
               cb && cb(json);
            }
        });

    },
      //cb是返回的回调方法
    delSalesOrder: (param, cb) => (dispatch, getState) => {
        _fetch({
            type:'GET',
            url: '/order/delete',
            data: param,
            success: json => {
                // console.log('_fetch');
                // console.log(json);
                //返回json
               cb && cb(json);
            }
        });

    },

}

export default actions;