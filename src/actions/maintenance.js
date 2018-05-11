/**
 * 维修保养actions 
 */
import { _fetch, addData, editData, delData } from '../tools/';

let actions = {
    //actionCreator
    curDate: null,
    actionCreator: (type, state) => ({
        type: type,
        payload: state
    }),

    getFormValues: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('GET_FORM_VALUES', state));
    },

    // 处理执行记录日期
    _recordDateArr: (data) => {

        if (!data) data = [];

        const dateArr = data.map(item => {
            let date = item.endTime ? item.endTime.substr(0,10) : '-';

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

    // ***任务分派***
    // 
    // 查询报修管理工单列表
    getWorkOrderList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/serviceOrder/list',
            data: param,
            type: 'post',
            success: json => {
               // dispatch(actions.actionCreator('WORK_ORDER_GET_LIST', json.data));
                cb && cb(json);
            }
        });
    },
     // 查询待分派 详情
    getAssigned: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/serviceOrder/getAssigned',
            data: param,
            type: 'get',
            success: json => {
               // dispatch(actions.actionCreator('WORK_ORDER_GET_LIST', json.data));
                cb && cb(json);
            }
        });
    },
     // 派工
    dispatch: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/serviceOrder/dispatch',
            data: param,
            type: 'get',
            success: json => {
               // dispatch(actions.actionCreator('WORK_ORDER_GET_LIST', json.data));
                cb && cb(json);
            }
        });
    },
    //dispatchList 查询工单记录信息
          dispatchList: (param, cb) => (dispatch, getState) => {
                _fetch({
                    url: '/serviceOrder/dispatchList',
                    data: param,
                    type: 'get',
                    success: json => {
                        cb && cb(json);
                    }
                });
            },
    workOrderDel: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/workorder/deleteWorkOrderList',
            data: param,
            type: 'get',
            success: json => {
                cb && cb(json);
            }
        });
    },
    updateList: (param, cb) => (dispatch, getState) => {

        if (Array.isArray(param)) {

            let type = param[0],
                newData = param[1], // 新增时值为对象，删除时值为id
                data = getState().maintenance.taskListData;

            switch (type) {
                case 'TASK_STEPS_ADD': // 新建任务步骤
                    newData[0].id = Date.now();
                    data = addData(data, newData, 'newTaskStepsList', 'eamOrderstepVoList', true);
                    break;
                case 'TASK_STEPS_EDIT': // 编辑任务步骤
                    newData = newData[0];
                    data = editData(data, newData, 'newTaskStepsList', 'eamOrderstepVoList');
                    break;
                case 'TASK_STEPS_DEL': // 删除任务步骤
                    data = delData(data, newData, 'newTaskStepsList', 'eamOrderstepVoList', 'delOriginalDataId');
                    break;
                case 'MATERIALS_ADD': // 新建所需物料
                    data = addData(data, newData, 'newMaterialsList', 'eamNeedItemVoList');
                    break;
                case 'MATERIALS_EDIT': // 编辑所需物料
                    data = editData(data, newData, 'newMaterialsList', 'eamNeedItemVoList');
                    break;
                case 'MATERIALS_DEL': // 删除所需物料
                    data = delData(data, newData, 'newMaterialsList', 'eamNeedItemVoList', 'materialDelOriginalDataId');
                    break;
            }
            dispatch(actions.actionCreator('TASK_GET_LIST', data));

        } else {
            _fetch({
                url: '/workorder/findWorkOrderAssignById',
                data: param,
                type: 'get',
                success: json => {
                    const data = json.data;
                    data.dateArr = actions._recordDateArr(data.eamImpleRecordVoVoList);
                    dispatch(actions.actionCreator('TASK_GET_LIST', data));
                    cb && cb();
                }
            });
        }
    },

    materialsAddGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/inventory/findInventorysNotInItems',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator('MATERIALS_ADD_GET_LIST', json.data));
                cb && cb(json);
            }
        });
    },

    // 任务分派保存
    taskAssignSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/workorder/saveWorkOrderAssign',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },

    // ***工单提报***
    workOrderCommitUpdateList: (param, cb) => (dispatch, getState) => {
        if (param === 'CLEAR_DATA') {
            dispatch(actions.actionCreator('WORK_ORDER_COMMIT_GET_LIST', []));
        }
        else if (Array.isArray(param)) {
            let type = param[0];
            let newData = param[1];

            let data = getState().maintenance.workOrderCommitListData;

            switch (type) {
                case 'ASSET_ADD': // 新建设备信息
                    data = addData(data, newData, 'newAssetList', 'assetList');
                    break;
                case 'ASSET_DEL': // 新建设备信息
                    data = delData(data, newData, 'newAssetList', 'assetList', 'delOriginalDataId');
                    break;
            }


            dispatch(actions.actionCreator('WORK_ORDER_COMMIT_GET_LIST', data));

        }
        else {
            _fetch({
                url: '/workorder/findWorkOrderCommitById',
                data: param,
                type: 'get',
                success: json => {
                    const data = json.data;
                    data.dateArr = actions._recordDateArr(data.eamImpleRecordVoVoList);
                    dispatch(actions.actionCreator('WORK_ORDER_COMMIT_GET_LIST', data));
                    cb && cb(json);
                }
            });
        }
    },
    workOrderCommitSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/workorder/saveWorkOrderCommit',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    // ***执行汇报***
    workOrderReportUpdateList: (param, cb) => (dispatch, getState) => {
        if (Array.isArray(param)) {
            // let type = param[0];
            // let newData = param[1];

            // let data = getState().maintenance.workOrderCommitListData;

            // switch (type) {
            //     case 'ASSET_ADD': // 新建设备信息
            //         addData(data, newData, 'newAssetList', 'assetList');
            //         break;
            //     case 'ASSET_DEL': // 新建设备信息
            //         delData(data, newData, 'newAssetList', 'assetList', 'delOriginalDataId');
            //         break;
            // }

            // dispatch(actions.actionCreator('WORK_ORDER_COMMIT_GET_LIST', data));

        } else {
            _fetch({
                url: '/workorder/findWorkOrderReportById',
                data: param,
                type: 'get',
                success: json => {
                    const data = json.data;
                    data.dateArr = actions._recordDateArr(data.eamImpleRecordVoVoList);
                    dispatch(actions.actionCreator('WORK_ORDER_REPORT_GET_LIST', data));
                    cb && cb(json);
                }
            });
        }
    },
    workOrderReportSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/workorder/saveWorkOrderReport',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    // ***验收确认***
    workOrderCheckUpdateList: (param, cb) => (dispatch, getState) => {
        if (Array.isArray(param)) {

        } else {
            _fetch({
                url: '/workorder/findWorkOrderCheckAcceptById',
                data: param,
                type: 'get',
                success: json => {
                    const data = json.data;
                    data.dateArr = actions._recordDateArr(data.eamImpleRecordVoVoList);
                    dispatch(actions.actionCreator('WORK_ORDER_CHECK_GET_LIST', data));
                    cb && cb(json);
                }
            });
        }
    },
    // 确认验收保存
    workOrderCheckSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/workorder/saveWorkOrderCheckAccept',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    // 新建获取工单编码
    getWorkOrderCode: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/getCodegenerator',
            data: param,
            success: json => {
                dispatch(actions.actionCreator('GET_WORK_ORDER_CODE', json.data));
                cb && cb(json);
            }
        });
    },
    // 发送流程
    sendProcess: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/workOrderFlow/commit',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    // 批量分派
    batchAssignment: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/workorder/assignWorkOrderList',
            data: param,
            type: 'post',
         //   formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    // 维保工单列表收藏
    workOrderCollect: (param, cb) => (dispatch, getState) => {
        const { id, checked } = param;
        _fetch({
            url: `/workorder/collect${checked ? '' : '/cancel'}`,
            data: {ids: [id]},
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },

    // ****作业标准****
    
    jobPlanDel: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/jobStandard/deleteJobStandardList',
            data: param,
            type: 'get',
            success: json => {
                cb && cb(json);
            }
        });
    },
    //基本信息详情页
    jobPlanDetailsUpdateList: (param, cb) => (dispatch, getState) => {
        if (param === 'CLEAR_DATA') {
            dispatch(actions.actionCreator('JOB_PLAN_DETAILS_GET_LIST', []));
        }
        else if (Array.isArray(param)) {
            let type = param[0],
                newData = param[1], // 新增时值为对象，删除时值为id
                data = getState().maintenance.jobPlanDetailsListData;

            switch (type) {
                case 'TASK_STEPS_ADD': // 新建任务步骤
                    newData[0].id = Date.now();
                    data = addData(data, newData, 'newTaskStepsList', 'maintenanceJobStandardTaskVoList', true);
                    break;
                case 'TASK_STEPS_EDIT': // 编辑任务步骤
                    newData = newData[0];
                    data = editData(data, newData, 'newTaskStepsList', 'maintenanceJobStandardTaskVoList');
                    break;
                case 'TASK_STEPS_DEL': // 删除任务步骤
                    data = delData(data, newData, 'newTaskStepsList', 'maintenanceJobStandardTaskVoList', 'delOriginalDataId');
                    break;
                case 'MATERIALS_ADD': // 新建所需物料
                    data = addData(data, newData, 'newMaterialsList', 'maintenanceJobStandardItemVoList');
                    break;
                case 'MATERIALS_EDIT': // 编辑所需物料
                    data = editData(data, newData, 'newMaterialsList', 'maintenanceJobStandardItemVoList');
                    break;
                case 'MATERIALS_DEL': // 删除所需物料
                    data = delData(data, newData, 'newMaterialsList', 'maintenanceJobStandardItemVoList', 'materialDelOriginalDataId');
                    break;
            }
            dispatch(actions.actionCreator('JOB_PLAN_DETAILS_GET_LIST', data));

        }
        else {
            _fetch({
                url: '/jobStandard/findJobStandardById',
                data: param,
                success: json => {
                    dispatch(actions.actionCreator("JOB_PLAN_DETAILS_GET_LIST", json.data));
                    cb && cb();
                }
            });
        }
    },
    jpSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/jobStandard/saveJobStandard',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    // 新建获取作业编码
    getJobPlanCode: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/getCodegenerator',
            data: param,
            success: json => {
                dispatch(actions.actionCreator('GET_JOB_PLAN_CODE', json.data));
                cb && cb(json);
            }
        });
    },
    // 作业标准列表收藏
    jobPlanCollect: (param, cb) => (dispatch, getState) => {
        const { id, checked } = param;
        _fetch({
            url: `/jobStandard/collect${checked ? '' : '/cancel'}`,
            data: {ids: [id]},
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },

    // ****预防维护计划****
    maintenancePlanGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/maintenancePlan/findPageMaintenancePlanList',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("MAINTENANCE_PLAN_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    maintenancePlanDel: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/maintenancePlan/deleteMaintenancePlanList',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    mPDetailsUpdateList: (param, cb) => (dispatch, getState) => {
        if (param === 'CLEAR_DATA') {
            dispatch(actions.actionCreator('MAINTENANCE_DETAIL_GET_LIST', []));
        }
        else if (Array.isArray(param)) {
            let type = param[0];
            let newData = param[1];

            let data = getState().maintenance.maintenanceDetailListData;

            switch (type) {
                case 'ASSET_ADD': // 新建维保对象(设备信息)
                    data = addData(data, newData, 'newAssetList', 'assetList');
                    break;
                case 'ASSET_DEL': // 删除维保对象(设备信息)
                    data = delData(data, newData, 'newAssetList', 'assetList', 'delOriginalDataId');
                    break; 
                case 'TERM_DATE_ADD':
                    newData[0].id = Date.now();
                    data = addData(data, newData, 'newTermDatetList', 'maintenancePlanActiveTimeVoList');
                    break;
                case 'TERM_DATE_EDIT':
                    newData = newData[0];
                    data = editData(data, newData, 'newTermDatetList', 'maintenancePlanActiveTimeVoList');
                    break;
                case 'TERM_DATE_DEL':
                    data = delData(data, newData, 'newTermDatetList', 'maintenancePlanActiveTimeVoList', 'termDateDelOriginalDataId');
                    break;
            }
            dispatch(actions.actionCreator('MAINTENANCE_DETAIL_GET_LIST', data));
        }
        else {
            _fetch({
                url: '/maintenancePlan/findMaintenancePlanById',
                data: param,
                type: 'get',
                success: json => {
                    dispatch(actions.actionCreator("MAINTENANCE_DETAIL_GET_LIST", json.data));
                    cb && cb();
                }
            });
        }
    },
    getMaintenancePlanCode: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/getCodegenerator',
            data: param,
            success: json => {
                dispatch(actions.actionCreator('GET_MAINTENANCE_PLAN_CODE', json.data));
                cb && cb(json);
            }
        });
    },
    mpSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/maintenancePlan/saveMaintenancePlan',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    workOrderByMPlanNumGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/workorder/findPageWorkOrderByMaintenancePlanNum',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator('WORK_ORDER_BY_MPNUM_GET_LIST', json.data));
                cb && cb();
            }
        });
    },
    // 预防维护计划列表收藏
    maintenancePlanCollect: (param, cb) => (dispatch, getState) => {
        const { id, checked } = param;
        _fetch({
            url: `/maintenancePlan/collect${checked ? '' : '/cancel'}`,
            data: {ids: [id]},
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    // 变更状态
    statusChange: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/workorder/updateWorkOrderStatusList',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    // 批量派工
    dispatchOrder: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/workorder/assignWorkOrderList',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    // 作业标准变更状态
    jobPlanStatusChange: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/jobStandard/updateJobStandardStatus',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    // 预防维护计划变更状态
    maintenancePlanStatusChange: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/maintenancePlan/updateMaintenancePlanStatus',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
}

export default actions;
