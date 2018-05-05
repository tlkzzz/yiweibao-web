/**
 * @Description
 */

import {_fetch, addData, editData, delData} from '../tools/';

let actions = {
    actionCreator: (type, state) => ({
        type: type,     //*** reducer接收数据的唯一标识
        payload: state  //*** 数据发送到reducer
    }),
    dispatchAction: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('TEST', state));
    },

    getFormValues: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('GET_FORM_VALUES', state));
    },
    // 处理执行记录日期
    _recordDateArr: (data) => {

        if (!data) data = [];

        const dateArr = data.map(item => {
            let date = item.endTime ? item.endTime.substr(0, 10) : '-';

            if (date !== actions.curDate) {
                actions.curDate = date;
                return date;
            } else {
                return false;
            }
        });
        actions.curDate = null;

        return dateArr;
    },
    clearList: (param) => (dispatch) => {
        dispatch(actions.actionCreator(param, []));
    },
    // 新建获取编号
    getCode: (param, actionCode, cb) => (dispatch, getState) => {
        _fetch({
            url: '/eam/open/getCodegenerator',
            data: param,
            success: json => {
                dispatch(actions.actionCreator(actionCode, json.data));
                cb && cb(json);
            }
        });
    },
    //*** 请求合同分页列表 方法内只做数据处理 严禁写任何业务逻辑
    manageGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("MANAGE_GET_LIST", []));
        _fetch({
            url: '/eam/open/contract/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("MANAGE_GET_LIST", json.data));
                cb && cb(json.data);
            }
        });
    },

    //合同的删除操作
    contractManageDel: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/eam/open/contract/deleteByIds',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    //合同信息
    contractManageinfoUpdateList: (param, cb) => (dispatch, getState) => {
        if (Array.isArray(param)) {
            let type = param[0];
            let newData = param[1];

            let data = getState().contract.manageInfoListData;

            dispatch(actions.actionCreator('MANAGE_INFO_GET_LIST', data));

        } else {
            _fetch({
                url: '/eam/open/contract/findContractVoById',
                data: param,
                type: 'get',
                success: json => {
                    const data = json.data;
                    data.dateArr = actions._recordDateArr(data.eamImpleRecordVoVoList);
                    dispatch(actions.actionCreator('MANAGE_INFO_GET_LIST', data));
                    cb && cb(json);
                }
            });
        }
    },
    findPatrolTermByOrderId: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/eam/open/contract/findPatrolTermByOrderId',
            data: param,
            type: 'get',
            success: json => {
                const data = json.data;
                dispatch(actions.actionCreator('MANAGE_TERM_GET_LIST', data));
                cb && cb();
            }
        });
    },
    //巡检记录
    updateRecordList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/eam/open/contract/findPatrolRecordTermPage',
            data: param,
            type: 'post',
            success: json => {
                const data = json.data;
                dispatch(actions.actionCreator('MANAGE_RECORD_GET_LIST', data));
                cb && cb();
            }
        });
    },
    // 发送流程
    sendProcess: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/eam/open/contractFlow/commit',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    manageInfoSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/eam/open/contract/saveOrUpdate',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    //施工进度
    constructionGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("CONSTRUCTION_GET_LIST", []));
        _fetch({
            url: '/eam/open/patrolOrder/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("CONSTRUCTION_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    maintenanceOrderGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("MAINTENANCE_ORDER_GET_LIST", []));
        _fetch({
            url: '/eam/open/workorder/findPageWorkOrderList',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("MAINTENANCE_ORDER_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    // ****预防维护计划****
    maintenancePlanGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("MAINTENANCE_PLAN_GET_LIST", []));
        _fetch({
            url: '/eam/open/maintenancePlan/findPageMaintenancePlanList',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("MAINTENANCE_PLAN_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //合同管理结束

    //施工单开始
    constructionGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/eam/open/construction/findPageConstructionList',
            data: param,
            type: 'post',
            success: json => {
                dispatch({
                    type: 'CONSTRUCTION_GET_LIST', //*** reducer接收数据的唯一标识
                    payload: json.data       //*** 数据发送到reducer
                });
                cb && cb();
            }
        });
    },
    constructionDel: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/eam/open/construction/deleteConstructionList',
            data: param,
            type: 'get',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    //施工信息
    constructionInfoUpdateList: (param, cb) => (dispatch, getState) => {
        if (Array.isArray(param)) {
            let type = param[0];
            let newData = param[1];

            let data = getState().contract.constructionInfoListData;

            data.newSuperviseRecordList = data.newSuperviseRecordList ? data.newSuperviseRecordList : [];

            switch (type) {
                case 'SUPERVISE_RECORD_ADD': // 新建巡检项
                    newData[0].id = Date.now();
                    data = addData(data, newData, 'newSuperviseRecordList', 'constructionSuperviseVoList',true);
                    break;
                case 'SUPERVISE_RECORD_EDIT': // 编辑巡检项
                    newData = newData[0];
                    data = editData(data, newData, 'newSuperviseRecordList', 'constructionSuperviseVoList');
                    break;
                case 'SUPERVISE_RECORD_DEL': // 删除巡检项
                    data = delData(data, newData, 'newSuperviseRecordList', 'constructionSuperviseVoList', 'delOriginalDataId');
                    break;
            }
            dispatch(actions.actionCreator('CONSTRUCTION_INFO_GET_LIST', data));

        } else {
            _fetch({
                url: '/eam/open/construction/findConstructionById',
                data: param,
                type: 'get',
                success: json => {
                    const data = json.data;
                    data.dateArr = actions._recordDateArr(data.eamImpleRecordVoVoList);
                    dispatch(actions.actionCreator('CONSTRUCTION_INFO_GET_LIST', data));
                    cb && cb(json);
                }
            });
        }
    },
    constructionInfoSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/eam/open/construction/saveConstruction',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    // 发送流程
    sendConstructionProcess: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/eam/open/construction/commit',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
};
export default actions;