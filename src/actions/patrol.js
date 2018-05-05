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
    getQrCode: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/qrCode/findQrcodeImge',
            data: param,
            type: 'GET',
            resType: 'img',
            success: data => {
                cb && cb(data);
            }
        });
    },
    //巡检点台账开始
    pointGetFilter: (param, cb) => (dispatch, getState) => {

        let data = {
            "success": true,
            "msg": "查询域值成功",
            "detailMsg": "",
            "data": {
                "pageNum": 1,
                "pageSize": 10,
                "total": 1,
                "pages": 1,
                "list": [
                    {
                        "orgId": null,
                        "siteId": null,
                        "pageNum": 1,
                        "pageSize": 10,
                        "sorts": null,
                        "order": null,
                        "productArray": null,
                        "id": "8a80cb815d4f8450015d4fdb5bf80000",
                        "description": "QQ",
                        "value": "WW",
                        "domainId": "8a80cb815d3ff0ad015d40036ddd0005",
                        "createUser": null,
                        "createDate": null
                    }
                ],
                "lastPage": true,
                "firstPage": true
            },
            "errorCode": null
        }
        data = data.data;

        dispatch(actions.actionCreator('POINT_STATUS', data));
        dispatch(actions.actionCreator('POINT_TYPE', data));
    },
    //*** 请求巡检点分页列表 方法内只做数据处理 严禁写任何业务逻辑
    pointGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("POINT_GET_LIST", []));
        _fetch({
            url: '/patrolPoint/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("POINT_GET_LIST", json.data));
                cb && cb(json.data);
            }
        });
    },
    //巡检点的删除操作
    // 变更状态
    pointStatusChange: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolPoint/updatePatrolPointStatusList',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    patrolPointDel: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolPoint/deleteByIds',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    patrolPointExport: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolPoint/exportPDF',
            data: param,
            type: 'POST',
            resType: 'file',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },

    patrolPointExportPDF: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/qrCode/processQrcodeGeneratePdf',
            data: param,
            type: 'GET',
            resType: 'file',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    //巡检项
    updateList: (param, cb) => (dispatch, getState) => {
        if (param === 'CLEAR_DATA') {
            dispatch(actions.actionCreator('POINT_GET_LIST', []));
        }
        if (Array.isArray(param)) {

            let type = param[0];
            let newData = param[1]; // 新增时值为对象，删除时值为id

            let data = getState().patrol.termListData;

            data.newTermList = data.newTermList ? data.newTermList : [];

            switch (type) {
                case 'TERM_ADD': // 新建巡检项

                    newData[0].id = Date.now();
                    data = addData(data, newData, 'newTermList', 'patrolTermVolist', true);
                    break;
                case 'TERM_EDIT': // 编辑巡检项
                    newData = newData[0];
                    data = editData(data, newData, 'newTermList', 'patrolTermVolist');
                    break;
                case 'TERM_DEL': // 删除巡检项

                    let temp = data.newTermList.length;


                    // 记录里有新增的数据 删掉
                    data.newTermList = data.newTermList.filter((item, i) => {
                        return item.id !== newData.id;
                    });

                    if (newData.patrolOrderId || temp === data.newTermList.length) {
                        // 走这里代表删的是后端过来的数据 记录删除的原数据id
                        data.delOriginalDataId = data.delOriginalDataId ? `${data.delOriginalDataId},${newData.id}` : newData.id;
                    }

                    data.patrolTermVolist = data.patrolTermVolist.filter((item, i) => {
                        return item.id !== newData.id;
                    });

                    break;
            }
            dispatch(actions.actionCreator('TERM_GET_LIST', data));

        } else {
            _fetch({
                url: '/patrolPoint/findPatrolPointVoById',
                data: param,
                type: 'get',
                success: json => {
                    const data = json.data;
                    dispatch(actions.actionCreator('TERM_GET_LIST', data));
                    cb && cb();
                }
            });
        }
    },


    findPatrolTermByOrderId: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolPoint/findPatrolTermByOrderId',
            data: param,
            type: 'get',
            success: json => {
                const data = json.data;
                dispatch(actions.actionCreator('POINT_TERM_GET_LIST', data));
                cb && cb();
            }
        });
    },
    //巡检记录
    updateRecordList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolPoint/findPatrolRecordTermPage',
            data: param,
            type: 'post',
            success: json => {
                const data = json.data;
                dispatch(actions.actionCreator('POINT_RECORD_GET_LIST', data));
                cb && cb();
            }
        });
    },
    // 新建获取巡检点编号
    getCode: (param, actionCode, cb) => (dispatch, getState) => {
        _fetch({
            url: '/getCodegenerator',
            data: param,
            success: json => {
                dispatch(actions.actionCreator(actionCode, json.data));
                cb && cb(json);
            }
        });
    },
    pointInfoSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolPoint/saveOrUpdate',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },


    //巡检点台账结束
    //巡检路线开始
    routeGetFilter: (param, cb) => (dispatch, getState) => {
        let data = {
            "success": true,
            "msg": "查询域值成功",
            "detailMsg": "",
            "data": {
                "pageNum": 1,
                "pageSize": 10,
                "total": 1,
                "pages": 1,
                "list": [
                    {
                        "orgId": null,
                        "siteId": null,
                        "pageNum": 1,
                        "pageSize": 10,
                        "sorts": null,
                        "order": null,
                        "productArray": null,
                        "id": "8a80cb815d4f8450015d4fdb5bf80000",
                        "description": "QQ",
                        "value": "WW",
                        "domainId": "8a80cb815d3ff0ad015d40036ddd0005",
                        "createUser": null,
                        "createDate": null
                    }
                ],
                "lastPage": true,
                "firstPage": true
            },
            "errorCode": null
        }
        data = data.data;

        dispatch(actions.actionCreator('ROUTE_STATUS', data));
        dispatch(actions.actionCreator('ROUTE_TYPE', data));
    },
    //*** 请求巡检点分页列表 方法内只做数据处理 严禁写任何业务逻辑
    routeGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("ROUTE_GET_LIST", []));
        _fetch({
            // url: '/patrol/findPage',
            url: '/patrolRoute/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("ROUTE_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    // 变更状态
    routeStatusChange: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolRoute/updatePatrolRouteStatusList',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    patrolRouteDel: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolRoute/deleteByIds',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },

    //巡检路线基本信息
    updateRouteList: (param, cb) => (dispatch, getState) => {

        if (Array.isArray(param)) {

            let type = param[0],
                newData = param[1], // 新增时值为对象，删除时值为id
                data = getState().patrol.routePointListData;
            // data.newRoutePointList = data.newRoutePointList ? data.newRoutePointList : [];
            switch (type) {
                case 'ROUTE_POINT_STEPS_ADD': // 新建巡检项
                    data = addData(data, newData, 'newRoutePointList', 'patrolPointVoList');
                    break;
                case 'ROUTE_POINT_STEPS_EDIT': // 编辑巡检项
                    data = addData(data, newData, 'newRoutePointList', 'patrolPointVoList');
                    break;
                case 'ROUTE_POINT_STEPS_DEL': // 删除巡检项
                    data = delData(data, newData, 'newRoutePointList', 'patrolPointVoList', 'delOriginalDataId');
                    break;
            }
            dispatch(actions.actionCreator('ROUTE_POINT_GET_LIST', data));

        } else {
            _fetch({
                url: '/patrolRoute/findPatrolRouteVoById',
                data: param,
                type: 'get',
                success: json => {
                    const data = json.data;
                    dispatch(actions.actionCreator('ROUTE_POINT_GET_LIST', data));
                    cb && cb();
                }
            });
        }
    },
    pointAddGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolPoint/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator('POINT_ADD_GET_LIST', json.data));
                cb && cb(json);
            }
        });
    },

    routeInfoSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolRoute/saveOrUpdate',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    //巡检路线结束
    //巡检计划开始
    planGetFilter: (param, cb) => (dispatch, getState) => {

        let data = {
            "success": true,
            "msg": "查询域值成功",
            "detailMsg": "",
            "data": {
                "pageNum": 1,
                "pageSize": 10,
                "total": 1,
                "pages": 1,
                "list": [
                    {
                        "orgId": null,
                        "siteId": null,
                        "pageNum": 1,
                        "pageSize": 10,
                        "sorts": null,
                        "order": null,
                        "productArray": null,
                        "id": "8a80cb815d4f8450015d4fdb5bf80000",
                        "description": "QQ",
                        "value": "WW",
                        "domainId": "8a80cb815d3ff0ad015d40036ddd0005",
                        "createUser": null,
                        "createDate": null
                    }
                ],
                "lastPage": true,
                "firstPage": true
            },
            "errorCode": null
        }
        data = data.data;

        dispatch(actions.actionCreator('PLAN_STATUS', data));
        dispatch(actions.actionCreator('PLAN_TYPE', data));
    },
    //*** 请求巡检假话分页列表 方法内只做数据处理 严禁写任何业务逻辑
    planGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolPlan/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("PLAN_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    // 变更状态
    planStatusChange: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolPlan/updatePatrolPlanStatusList',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    //巡检计划的删除操作
    patrolPlanDel: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolPlan/deleteByIds',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    //巡检计划
    updatePlanList: (param, cb) => (dispatch, getState) => {

        if (Array.isArray(param)) {

            let type = param[0];
            let newData = param[1]; // 新增时值为对象，删除时值为id

            let data = getState().patrol.frequencyListData;

            data.newFrequencyList = data.newFrequencyList ? data.newFrequencyList : [];

            switch (type) {
                case 'FREQUENCY_ADD': // 新建巡检项
                    newData[0].id = Date.now();
                    data = addData(data, newData, 'newFrequencyList', 'patrolPlanFrequencyVoList', true);
                    break;
                case 'FREQUENCY_EDIT': // 编辑巡检项
                    newData = newData[0];
                    data = editData(data, newData, 'newFrequencyList', 'patrolPlanFrequencyVoList');
                    break;
                case 'FREQUENCY_DEL': // 删除巡检项
                    data = delData(data, newData, 'newFrequencyList', 'patrolPlanFrequencyVoList', 'delOriginalDataId');
                    break;
            }
            dispatch(actions.actionCreator('FREQUENCY_GET_LIST', data));

        } else {
            _fetch({
                url: '/patrolPlan/findPatrolPlanVoById',
                data: param,
                type: 'get',
                success: json => {
                    const data = json.data;
                    dispatch(actions.actionCreator('FREQUENCY_GET_LIST', data));
                    cb && cb();
                }
            });
        }
    },

    planInfoSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolPlan/saveOrUpdate',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    //巡检计划结束

    //巡检工单开始
    // 发送流程
    sendProcess: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolOrderFlow/commit',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    orderGetFilter: (param, cb) => (dispatch, getState) => {

        let data = {
            "success": true,
            "msg": "查询域值成功",
            "detailMsg": "",
            "data": {
                "pageNum": 1,
                "pageSize": 10,
                "total": 1,
                "pages": 1,
                "list": [
                    {
                        "orgId": null,
                        "siteId": null,
                        "pageNum": 1,
                        "pageSize": 10,
                        "sorts": null,
                        "order": null,
                        "productArray": null,
                        "id": "8a80cb815d4f8450015d4fdb5bf80000",
                        "description": "QQ",
                        "value": "WW",
                        "domainId": "8a80cb815d3ff0ad015d40036ddd0005",
                        "createUser": null,
                        "createDate": null
                    }
                ],
                "lastPage": true,
                "firstPage": true
            },
            "errorCode": null
        }
        data = data.data;

        dispatch(actions.actionCreator('ORDER_STATUS', data));
        dispatch(actions.actionCreator('ORDER_TYPE', data));
    },
    //*** 请求巡检巡检工单分页列表 方法内只做数据处理 严禁写任何业务逻辑
    orderGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("ORDER_GET_LIST", []));
        _fetch({
            // url: '/patrol/findPage',
            url: '/patrolOrder/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("ORDER_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //巡检工单的删除操作
    patrolOrderDel: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolOrder/deleteByIds',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    //提报
    patrolOrderCommitUpdateList: (param, cb) => (dispatch, getState) => {
        if (Array.isArray(param)) {
            let type = param[0];
            let newData = param[1];

            let data = getState().patrol.patrolOrderCommitListData;

            dispatch(actions.actionCreator('PATROL_ORDER_COMMIT_GET_LIST', data));

        } else {
            _fetch({
                url: '/patrolOrder/findPatrolOrderById',
                data: param,
                type: 'get',
                success: json => {
                    const data = json.data;
                    data.dateArr = actions._recordDateArr(data.eamImpleRecordVoVoList);
                    dispatch(actions.actionCreator('PATROL_ORDER_COMMIT_GET_LIST', data));
                    cb && cb(json);
                }
            });
        }
    },
    orderCommitSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolOrder/saveOrUpdate',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    orderAssignSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolOrder/saveOrUpdate',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    orderPointGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("ORDER_POINT_GET_LIST", []));
        _fetch({
            url: '/patrolOrder/findOrderPointById',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("ORDER_POINT_GET_LIST", json.data));
                cb && cb(json.data);
            }
        });
    },
    findPatrolRecordByOrderAndPoint: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolPoint/findPatrolRecordByOrderAndPoint',
            data: param,
            type: 'get',
            success: json => {
                const data = json.data;
                dispatch(actions.actionCreator('ORDER_RECORD_TIME', data));
                cb && cb();
            }
        });
    },
    //巡检工单结束

    //巡检标准开始

    standardGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolStand/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("STANDARD_GET_LIST", json.data));
                cb && cb();
            }
        });
    },

    deleteStandard: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolStand/deletePatrolStand',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },

    standardSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolStand/savePatrolStand',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },

    standardUpdate: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolStand/updatePatrolStand',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },

    findStandardById: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolStand/findPatrolStandById',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("STANDARD_ENTITY", json.data));
                cb && cb();
            }
        });
    },
    findPatrolStandContent: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolStand/findPatrolStandContent',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator("STANDARD_CONTENT_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    standardContentSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolStand/savePatrolStandContent',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    deletePatrolStandContent: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolStand/deletePatrolStandContent',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },

    updatePatrolStandContentDetail: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/patrolStand/updatePatrolStandContent',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
};
export default actions;