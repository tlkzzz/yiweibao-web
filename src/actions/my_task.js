/** 
 * @Description 我的任务
 */
import {_fetch} from '../tools/';

let actions = {
    //actionCreator
    actionCreator: (type, state) => ({
        type: type,
        payload: state
    }),
    //*** 请求域管理分页列表 方法内只做数据处理 严禁写任何业务逻辑

    //-----------------------------------全部--------------------------
    //待办的全部
    myTaskBacklogGetAllList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageTaskToDoList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("BACKLOG_ALL_GET_LIST", json.data));
                cb && cb();
            }
        });
    },

    //经办的全部
    myTaskHandleGetAllList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageTaskDoneList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("HANDLE_ALL_GET_LIST", json.data));
                cb && cb();
            }
        });
    },

    //----------------维保工单---------------------
    //待办的维保工单
    myTaskBacklogGetMaintenanceList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageWorkOrderTaskToDoList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("BACKLOG_MAINTENANCE_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //经办的维保工单
    myTaskHandleGetMaintenanceList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageWorkOrderTaskDoneList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("HANDLE_MAINTENANCE_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //------------------------报修工单-------------------------------
    //待办的报修工单
    myTaskBacklogGetRepairList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageRepairOrderTaskToDoList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("BACKLOG_REPAIR_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //经办的报修工单
    myTaskHandleGetRepairList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageRepairOrderTaskDoneList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("HANDLE_REPAIR_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
     //------------------------派工工单-----------------------------
    //待办的派工工单
    myTaskBacklogGetDispatchList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageDispatchOrderTaskToDoList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("BACKLOG_DISPATCH_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //经办的派工工单
    myTaskHandleGetDispatchList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageDispatchOrderTaskDoneList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("HANDLE_DISPATCH_GET_LIST", json.data));
                cb && cb();
            }
        });
    },

    //------------------------  巡检-------------------------------
     //待办的巡检工单
    myTaskBacklogGetPatrolList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPagePatrolOrderTaskToDoList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("BACKLOG_PATROL_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //经办的巡检工单
    myTaskHandleGetPatrolList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPagePatrolOrderTaskDoneList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("HANDLE_PATROL_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //----------------------参数查询数据----------------------------------------
    //待办
    myTaskFindPageTaskToDoList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageTaskToDoList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("MY_TASK_TODO", json.data));
                cb && cb();
            }
        });
    },
    //经办
    myTaskFindPageTaskDoneList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageTaskDoneList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("MY_TASK_DONE", json.data));
                cb && cb();
            }
        });
    },
    //---------------------徽标数-------------------------
    //经办
    myTaskFindLogoDone: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findTaskDoneCountGroupByOrderType',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("MY_TASK_DONE_LOGO", json.data));
                cb && cb();
            }
        });
    },
    //待办
    myTaskFindLogoToDo: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findTaskToDoListTotalGroupByOrderType',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("MY_TASK_DONE_LOGO", json.data));
                cb && cb();
            }
        });
    },



    //获取模糊查询关键字
    myTaskGetKeyword: (param, cb) => (dispatch, getState) => {
        console.log("----myTaskGetKeyword-----------",getState);
        dispatch(actions.actionCreator("HANDLE_GET_KEYWORD", param));
        cb && cb();
    },
};

export default actions;