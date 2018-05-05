/** 
 * @Description 环境监测
 */
import { _fetch } from '../tools/';

let actions = {
    //actionCreator
    actionCreator: (type, state) => ({
        type: type,
        payload: state
    }),

    //环境设备列表
    environmentAssetGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/assets/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("ENVIRONMENT_ASSET_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //详情
    assetGetDetail: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("ENVIRONMENT_ASSET_GET_DETAIL", []));
        _fetch({
            url: '/ams/open/assets/findById',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("ENVIRONMENT_ASSET_GET_DETAIL", json.data));
                cb && cb(json.data);
            }
        });
    },
    getFormValues: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('GET_FORM_VALUES', state));
    },
    //设置 报警规则 传递 当前测点信息
    setMeterInfo: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('SET_METER_INFO', state));
    },
    setMeterListFresh: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('SET_METER_LIST_FRESH', state));
    },
    setMeterListHide : (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('METER_LIST_HIDE', state));
    },
    setWarningFresh: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('WARNING_FRESH', state));
    },
    assetDelete: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/assets/delete',
            data: { 'ids': param },
            type: 'get',
            success: json => {
                cb && cb(json);
            }
        });
    },
    setDetailTitle: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('DETAIL_TITLE', state));
    },
    //测点信息
    meterGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("METER_LIST", []));
        _fetch({
            url: '/ams/open/meters/findByAssetId',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("METER_LIST", json.data));
                cb && cb(json.data);
            }
        });
    },
    warningGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("WARNING_LIST", []));
        _fetch({
            url: '/ams/open/warningRules/findByMeterId',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("WARNING_LIST", json.data));
                cb && cb(json.data);
            }
        });
    },
    operationSymbolTypeGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/enum/warning/types',
            data: param,
            type: 'get',
            success: json => {
                cb && cb(json.data);
            }
        });
    },
    // 环境设备  分类树
    classifiGetTree: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("CLASSIFI_GET_TREE", []));
        _fetch({
            url: '/ams/open/classifications/findTree',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("CLASSIFI_GET_TREE", json.data));
                cb && cb(json.data);
            }
        });
    },
    classifiGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("CLASSIFI_GET_LIST", []));
        _fetch({
            url: '/ams/open/classifications/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("CLASSIFI_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    getGeneratorCode:(param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("GENERATOR_CODE", ''));
        _fetch({
            url: '/getCodegenerator',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("GENERATOR_CODE", json.data));
                cb && cb();
            }
        });
    },
    pointGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("POINT_GET_LIST", []));
        _fetch({
            url: '/ams/open/meters/findHistoryData',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("POINT_GET_LIST", json.data));
                cb && cb();
            }
        });
    },

    // 环境设备  位置树
    locationGetTree: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("LOCATION_GET_TREE", []));
        _fetch({
            url: '/ams/open/locations/findFilterTree',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json.data);
                dispatch(actions.actionCreator("LOCATION_GET_TREE", json.data));    
            }
        });
    },

    environmetnAssetSave: (param, cb) => (dispatch, getState) => {
        if (Array.isArray(param)) {
            let type = param[0];
            let saveData = param[1];
            if (type == 'ENVIRONMENT_ASSET_ADD') {
                saveData.id = null ; 
                _fetch({
                    url: '/ams/open/assets/add',
                    data: saveData,
                    type: 'post',
                    success: json => {
                        cb && cb(json.data);
                    }
                });
            }

            if (type == 'ENVIRONMENT_ASSET_EDIT') {
                _fetch({
                    url: '/ams/open/assets/update',
                    data: saveData,
                    type: 'post',
                    success: json => {
                        cb && cb(json.data);
                    }
                });
            }
        }
    },
    meterUpdate: (param, cb) => (dispatch, getState) => {
        if (Array.isArray(param)) {
            let type = param[0];
            let saveData = param[1];
            if (type == 'METER_ADD') {
                _fetch({
                    url: '/ams/open/meters/add',
                    data: saveData,
                    type: 'post',
                    success: json => {
                        cb && cb(json);
                    }
                });
            } else {
                _fetch({
                    url: '/ams/open/meters/update',
                    data: saveData,
                    type: 'post',
                    success: json => {
                        cb && cb(json.data);
                    }
                });
            }
        }

    },
    warningRuleGrant :(param ,cb) =>(dispatch, getState) => {
        _fetch({
            url: '/ams/open/warningRules/grant',
            data: param,
            type: 'get',
            success: json => {
                cb && cb(json);
            }
        });
    },
    warningRuleSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/warningRules/add',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    warningRuleDelete: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/warningRules/delete',
            data: { 'ids': param },
            type: 'get',
            success: json => {
                cb && cb(json);
            }
        });
    },
    meterDelete: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/meters/delete',
            data: { 'ids': param },
            type: 'get',
            success: json => {
                cb && cb(json);
            }
        });
    },
    //关联工单的接口
    recordsGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("RECORDS_GET_LIST", []));
        _fetch({
            url: '/workorder/findPageWorkOrderByAssetId',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("RECORDS_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
};
// 处理位置数据

export default actions;
