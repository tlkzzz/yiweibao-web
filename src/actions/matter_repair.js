/**
 * @Description 报事报修模块
 */
import { _fetch } from '../tools/';

let actions = {
    //actionCreator
    curDate: null,
    actionCreator: (type, state) => ({
        type: type,
        payload: state
    }),

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
    
    //更新工单数据
    updateRepairWorkOrder: (state, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator('REPAIR_WORK_ORDER_INFORMATION', state));
        cb && cb();
    },
    //更新工单流程数据
    updaterepairOrderFlow: (state, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator('REPAIR_WORK_FLOW_HISTORY', state));
        cb && cb();
    },
    // 变更状态
    repairOrderStatusChange: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/repair/order/flow/change',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    //获取报修工单工程类型对应人员列表
    getRepairWorkOrder_UserListForProjectType: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/repair/order/projectType/userList',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    //发送流程弹框显示
    sendProcess: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('SEND_PROCESS', state));
    },
    //保存数据按钮
    getFormValues: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('GET_FORM_VALUES', state));
    },
    //获取表单校验状态
    getFormValidate: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('GET_FORM_VALIDATE', state));
    },
    //获取工单列表
    repairWorkOrderGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/repair/order/page',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator('REPAIR_WORK_ORDER_GET_LIST', json.data));
                cb && cb();
            }
        });
    },
    //收藏
    repairWorkOrderCollect: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/repair/order/collect',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                // dispatch(actions.actionCreator('REPAIR_WORK_ORDER_COLLECT', json.data));
                cb && cb(json);
            }
        });
    },
    //取消收藏
    repairWorkOrderCollectCancel: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/repair/order/collect/cancel',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                // dispatch(actions.actionCreator('REPAIR_WORK_ORDER_COLLECT_CANCEL', json.data));
                cb && cb(json);
            }
        });
    },
    //根据id删除
    repairWorkOrderDel: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/repair/order/delete',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    //获取执行记录时间轴信息
    repairOrderFlowHistory: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/repair/order/flow/history',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator('REPAIR_WORK_FLOW_HISTORY', json.data));
                cb && cb();
            }
        });
    },
    //获取工单详情页面数据
    repairOrderInformation: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/repair/order',
            data: param,
            type: 'GET',
            success: json => {
                dispatch(actions.actionCreator('REPAIR_WORK_ORDER_INFORMATION', json.data));
                cb && cb(json.data);
            }
        });
    },
    //获取工单物资列表
    repairWorkOrderMaterialsList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/release/findItemInReleaseByorderId',
            data: param,
            type: 'GET',
            success: json => {
                cb && cb(json);
                dispatch(actions.actionCreator('REPAIR_WORK_ORDER_MATERIALS_LIST', json.data));
            }
        });
    },
    //获取派工单详细
    dispatchOrderInfo: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/dispatch/order',
            data: param,
            type: 'GET',
            success: json => {
                cb && cb(json.data);
                dispatch(actions.actionCreator('DISPATCH_ORDER_INFO', json.data));

            }
        });
    },
    //新建是时获取工单编号
    getCodegenerator: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/getCodegenerator',
            data: param,
            type: 'GET',
            success: json => {
                cb && cb(json);
            }
        });
    },
    //工单保存
    repairWorkOrderSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/repair/order/save',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                cb && cb(json);

            }
        });
    },
    repairOrderFlowCommit: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/repair/order/flow/commit',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    updateList: (param, cb) => (dispatch, getState) => {

        if (Array.isArray(param)) {

            let type = param[0];
            let newData = param[1]; // 新增时值为对象，删除时值为id

            let data = getState().maintenance.taskListData;
            let taskStepsList = data.eamOrderstepVoList;
            let taskStepsLen = taskStepsList.length;

            data.newTaskStepsList = data.newTaskStepsList ? data.newTaskStepsList : [];

            switch (type) {
                case 'TASK_STEPS_ADD': // 新建任务步骤

                    newData.step = ++taskStepsLen;
                    newData.id = String(newData.step) + Date.now();

                    data.eamOrderstepVoList = [newData, ...data.eamOrderstepVoList];
                    // 记录新增的数据
                    data.newTaskStepsList = data.newTaskStepsList ? [...data.newTaskStepsList, newData] : [newData];

                    break;
                case 'TASK_STEPS_EDIT': // 编辑任务步骤

                    let editIndex = taskStepsList.findIndex((item, i) => {
                        return item.id === newData.id;
                    });

                    data.eamOrderstepVoList[editIndex] = Object.assign({}, data.eamOrderstepVoList[editIndex], newData);

                    let newTaskStepsIndex = data.newTaskStepsList.findIndex((item, i) => {
                        return item.id === data.eamOrderstepVoList[editIndex].id;
                    });

                    if (newTaskStepsIndex === -1) {
                        data.newTaskStepsList.push(data.eamOrderstepVoList[editIndex]);
                    } else {
                        data.newTaskStepsList[newTaskStepsIndex] = data.eamOrderstepVoList[editIndex];
                    }

                    break;

                case 'TASK_STEPS_DEL': // 删除任务步骤

                    let temp = data.newTaskStepsList.length;


                    // 记录里有新增的数据 删掉
                    data.newTaskStepsList = data.newTaskStepsList.filter((item, i) => {
                        return item.id !== newData.id;
                    });

                    if (newData.workOrderId || temp === data.newTaskStepsList.length) {
                        // 走这里代表删的是后端过来的数据 记录删除的原数据id
                        data.delOriginalDataId = data.delOriginalDataId ? `${data.delOriginalDataId},${newData.id}` : newData.id;
                    }

                    data.eamOrderstepVoList = data.eamOrderstepVoList.filter((item, i) => {
                        return item.id !== newData.id;
                    });

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
                    const recordList = data.eamImpleRecordVoVoList;

                    const dateArr = recordList.map(item => {
                        let date = item.startTime.substr(0, 10);

                        if (date !== actions.curDate) {
                            actions.curDate = date;
                            return date;
                        } else {
                            return false;
                        }
                    });
                    data.dateArr = dateArr;
                    dispatch(actions.actionCreator('TASK_GET_LIST', data));
                    cb && cb();
                }
            });
        }
    },
    ///////////////////派工工单

    //获取工单列表
    dispatchWorkOrderGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/dispatch/order/page',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator('DISPATCH_WORK_ORDER_GET_LIST', json.data));
                cb && cb();
            }
        });
    },
    //收藏
    dispatchWorkOrderCollect: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/dispatch/order/collect',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                // dispatch(actions.actionCreator('DISPATCH_WORK_ORDER_COLLECT', json.data));
                cb && cb(json);
            }
        });
    },
    //更新工单数据
    updateDispatchWorkOrder: (state, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator('DISPATCH_WORK_ORDER_INFORMATION', state));
        cb && cb();
    },
    //取消收藏
    dispatchWorkOrderCollectCancel: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/dispatch/order/collect/cancel',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                // dispatch(actions.actionCreator('DISPATCH_WORK_ORDER_COLLECT_CANCEL', json.data));
                cb && cb(json);
            }
        });
    },
    //根据id删除
    dispatchWorkOrderDel: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/dispatch/order/delete',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    //工单保存
    dispatchWorkOrderSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/dispatch/order/save',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
             //   dispatch(actions.actionCreator('DISPATCH_ORDER_INFO', json.data));
             //   dispatch(actions.actionCreator('DISPATCH_ORDER_SAVE', json));
                cb && cb(json);
            }
        });
    },
    //工作流提交
    dispatchWorkOrderCommit: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/dispatch/order/flow/commit',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator('DISPATCH_ORDER_INFO_COMMIT', json.data));
                cb && cb(json);
            }
        });
    },
    // 变更状态
    statusChange: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/dispatch/order/flow/change',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
}

export default actions;