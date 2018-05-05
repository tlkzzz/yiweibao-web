/** 
 * @Description
 */
import {_fetch} from '../tools/';

let actions = {
    //actionCreator
    actionCreator: (type, state) => ({
        type: type,
        payload: state
    }),
    //***总部计划分页列表 方法内只做数据处理 严禁写任何业务逻辑
    inventoryGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headquartersPlan/findPageList',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator('PLAN_POST_LIST', json.data));
                cb && cb(json.data);
            }
        });
    },
    deletePlan: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headquartersPlan/delete',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                // dispatch({
                //     type: 'DOMAIN_DEL', //*** reducer接收数据的唯一标识
                //     payload: json.data       //*** 数据发送到reducer
                // });
                cb && cb(json);
            }
        });
    },
    //获取总部计划详细页
    getPlanDetail: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headquartersPlan/findDetail',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator('GET_PLAN_DETAIL', json.data));
                cb && cb(json.data);
            }
        });
    },

    //保存数据按钮
    getFormValues: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('GET_FORM_VALUES', state));
    },
    //获取表单校验状态
    getFormValidate: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('GET_FORM_VALIDATE', state));
    },

    //总部计划保存
    savePlanDetail: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headquartersPlan/save',
            data: param,
            type: 'POST',
            // formDataParam: true,
            success: json => {
                cb && cb(json);
                dispatch(actions.actionCreator('GET_PLAN_DETAIL', json.data));

            }
        });
    },
    //总部计划--修改状态
    upStrtus: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headquartersPlan/upStrtus',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    //总部计划--批量下达
    batchRelease: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headquartersPlan/batchRelease',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    //总部计划--生成例行工作
    batchBuildWork: (param,cb) => (dispatch,getState) => {
        _fetch({
            url: '/headquartersPlan/createRoutineWork',
            data: param,
            type: 'POST',
            success: json => {
                cb && cb(json);
            }
        });
    },
    //总部计划--生成派工单
    batchDispatchOrder: (param,cb) => (dispatch,getState) => {
        _fetch({
            url: '/headquartersPlan/batchLabor',
            data: param,
            type: 'POST',
            success: json => {
                cb && cb(json);
            }
        });
    },
    ///总部计划--工单提报
    dispatchWorkOrderSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/dispatch/order/flow/commit',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                // dispatch(actions.actionCreator('DISPATCH_ORDER_INFO', json.data));
                // dispatch(actions.actionCreator('DISPATCH_ORDER_SAVE', json));
                cb && cb(json);
            }
        });
    },
    //例行工作单-列表
    findDailyTaskPageList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headquartersDailyTask/findPageList',
            data: param,
            type: 'GET',
            // formDataParam: true,
            success: json => {
                cb && cb(json);
                dispatch(actions.actionCreator('HEADQUARTERS_DAILYTASK_LIST', json.data));
            }
        });
    },
    //例行工作单-保存
    saveDailyTask: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headquartersDailyTask/save',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                cb && cb(json);
                dispatch(actions.actionCreator('HEADQUARTERS_DAILYTASK_LIST', json.data));
            //    dispatch(actions.actionCreator('HEADQUARTERS_DAILYTASK_INFO', json.data));
               // dispatch(actions.actionCreator('HEADQUARTERS_DAILYTASK', json.data));
            }
        });
    },
    //例行工作单-详细
    getDailyTaskDetail: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headquartersDailyTask/findDetail',
            data: param,
            type: 'GET',
            // formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator('HEADQUARTERS_DAILYTASK_INFO', json.data));
                cb && cb(json);

            }
        });
    },
    //例行工作单-删除
    dailyTaskdelete: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headquartersDailyTask/delete',
            data: param,
            type: 'POST',
             formDataParam: true,
            success: json => {
                cb && cb(json);
               // dispatch(actions.actionCreator('GET_PLAN_DETAIL', json.data));
            }
        });
    },

    //例行工作列表
    getDailyPage: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headquartersDaily/findPageList',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator('DAILY_POST_LIST', json.data));
                cb && cb(json.data);
            }
        });
    },
    //删除例行工作
    deleteDaily: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headquartersDaily/delete',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                // dispatch({
                //     type: 'DOMAIN_DEL', //*** reducer接收数据的唯一标识
                //     payload: json.data       //*** 数据发送到reducer
                // });
                cb && cb(json);
            }
        });
    },
    //获取例行工作详细页
    getDailyDetail: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headquartersDaily/findDetail',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator('GET_DAILY_DETAIL', json.data));
                cb && cb(json.data);
            }
        });
    },
    //例行工作流程提交
    dailyTaskFlowCommit: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headquartersDailyTask/flow/commit',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                //   dispatch(actions.actionCreator('GET_DAILY_DETAIL', json.data));
                cb && cb(json);
            }
        });
    },
    //例行工作保存
    saveDailyDetail: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headquartersDaily/save',
            data: param,
            type: 'POST',
            // formDataParam: true,
            success: json => {
                cb && cb(json);

            }
        });
    },
    //例行工作单批量修改状态
    statusChange:(param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headquartersDailyTask/upStrtus',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    //例行工作批量修改状态
    upWorkStrtus:(param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headquartersDaily/upStrtus',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    //获取，更新更新状态
    updateDailyTaskAddState: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('UPDATE_DAILYTASK_ADD_STATE', state));
    },
    updateDailyTaskInfo: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('UPDATE_DAILYTASK_INFO', state));
    },
}

export default actions;