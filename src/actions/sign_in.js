
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
    signIn: (param, cb) => (dispatch, getState) => {
        _fetch({
            type:'POST',
            url: '/login/signin',
            data: param,
            success: json => {
                // console.log('_fetch');
                // console.log(json);
                //返回json
               cb && cb(json);
            }
        });

        /*localStorage.setItem('token', '1a4ed243-c807-482d-866d-52835838387f');
        cb && cb();
        let data = {
            levels: 'SITE_LEVEL',
            siteId: '4028815f5bf62c96015bf63d040c0007',
            code:'你好呀',
        }  

        cb && cb(data);*/
    },
    getInfo: (param, cb) => (dispatch, getState) => {
        console.log('getInfo');
        console.log(param)
    	/*_fetch({
            url: '/uas/open/personandusers/getInfo',
            data: param,
            success: json => {
                cb && cb(json);
            }
        });*/        
        let data = {
            orgId: '4028e6eb5bec6d12015bec6e38bd0021',
            siteId: '4028815f5bf62c96015bf63d040c0007',
        }        
        cb && cb(data);
    }
}

export default actions;