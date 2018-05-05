/**
 * 系统管理actions 
 */
import {_fetch, addData, delData} from '../tools/';

let actions = {
    //actionCreator
    actionCreator: (type, state) => ({
        type: type,
        payload: state
    }),
//获取表单值
    getFormValues: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('GET_FORM_VALUES', state));
    },
    //*** 请求域管理分页列表 方法内只做数据处理 严禁写任何业务逻辑
    domainGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/fields/findDomainByPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator('DOMAIN_GET_LIST', json.data));
                cb && cb();
            }
        });
    },
    domainDel: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/fields/deleteDomainValue',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                // dispatch({
                //     type: 'DOMAIN_DEL', //*** reducer接收数据的唯一标识
                //     payload: json.data       //*** 数据发送到reducer
                // });
                cb && cb(json.success);
            }
        });
    },
//IP管理
    ipGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ip/getIPList',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator('IP_GET_LIST', json.data));
                cb && cb();
            }
        });
    },
    ipSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ip/saveIP',
            data: param,
            type: 'post',
            // formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    ipUpdate: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ip/updateIP',
            data: param,
            type: 'post',
            // formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    ipDelete: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ip/deleteIP',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    ipFindOne: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ip/findIPDetail',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator('IP_FIND_ONE', json.data));
                cb && cb();
            }
        });
    },
  //二维码管理
    qrCodeGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/qrCode/findPageQRCodeManager',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator('QR_CODE_GET_LIST', json.data));
                cb && cb();
            }
        });
    },
     updateList: (param, cb) => (dispatch, getState) => {

         if (Array.isArray(param)) {

             let type = param[0],
                 newData = param[1], // 新增时值为对象，删除时值为id
                 data = getState().system.codeByIdListData;

             switch (type) {
                 case 'PROPERTY_ADD': // 新建属性
                    //  newData[0] = Date.now();
                     newData.forEach(function(v,i) {
                         v.id = v.propertyId.substr(0,15);
                     })
                     console.log(newData);
                     
                     data = addData(data, newData, 'newPropertyList', 'qrcodeApplicationPropertyVoList');
                     break;
                 case 'PROPERTY_DEL': // 删除属性
                     data = delData(data, newData, 'newPropertyList', 'qrcodeApplicationPropertyVoList', 'materialDelOriginalDataId');
                     break;
             }
             dispatch(actions.actionCreator('CODE_BYID_GET_LIST', data));

         } else {
             _fetch({
                 url: '/qrCode/findQRCodeManagerByID',
                 data: param,
                 type: 'get',
                 success: json => {
                     const data = json.data;
                     dispatch(actions.actionCreator('CODE_BYID_GET_LIST', data));
                     cb && cb();
                 }
             });
         }
     },
    //保存二维码管理
     qrCodeSave: (param, cb) => (dispatch, getState) => {
         _fetch({
             url: '/qrCode/saveQRCodeManager',
             data: param,
             type: 'post',
             success: json => {
                 dispatch(actions.actionCreator('QR_CODE_GET_LIST', json.data));
                 cb && cb(json);
             }
         });
     },
     //根据Id删除二维码管理
     qrCodeDel: (param, cb) => (dispatch, getState) => {
         _fetch({
             url: '/qrCode/deleteQRCodeManagerList',
             data: param,
             type: 'get',
             success: json => {
                 dispatch(actions.actionCreator('QR_CODE_GET_LIST', json.data));
                 cb && cb(json);
               }
          });
     },
    //查看二维码所有应用程序的属性列表
    allPropertyGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/qrCode/findAllApplicationAllPropertyNotIn',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator('ALL_PROPERTY_GET_LIST', json.data));
                cb && cb();
            }
        });
    },
   //新建时自动生成编码
   codeGetList: (param, cb) => (dispatch, getState) => {
       _fetch({
           url: '/getCodegenerator',
           data: param,
           type: 'get',
           success: json => {
               dispatch(actions.actionCreator('CODE_GET_LIST', json.data));
               cb && cb();
           }
       });
   },
}

export default actions;
