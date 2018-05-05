/**
 * 维修保养reducers
 */

let initState = {
	// tab2页面维修保养列表
    workOrderListData: [],
    taskListData: [],
    materialsAddListData: [],
    getFormValues: true,
    // 工单提报
    workOrderCommitListData: [],
    // 执行汇报
    workOrderReportListData: [],
    // 验收确认
    workOrderCheckListData: [],
    workOrderCode: '',
    //作业标准
    jobPlanDetailsListData: [],
    jobPlanCode: '',
    //保养计划
    maintenancePlanListData: [],
    maintenanceDetailListData: [],
    maintenancePlanCode: '',
    // tab3 列表
    workOrderByMPlanNumListData: [],
}

let newState;

function sysReducer (state = initState, action) {
    switch (action.type) {
        // 维保工单-分页列表
        case 'WORK_ORDER_GET_LIST':
            newState = Object.assign({}, state, {workOrderListData: action.payload});
            return newState;
            break;

        // 维保工单-任务分派
        case 'TASK_GET_LIST':
            newState = Object.assign({}, state, {taskListData: action.payload});
            return newState;
            break;
        // 维保工单-任务分派-所需物料新建列表
        case 'MATERIALS_ADD_GET_LIST':
            newState = Object.assign({}, state, {materialsAddListData: action.payload});
            return newState;
            break;

        // 维保工单-工单提报
        case 'WORK_ORDER_COMMIT_GET_LIST':
            newState = Object.assign({}, state, {workOrderCommitListData: action.payload});
            return newState;
            break;

        case 'GET_FORM_VALUES':
            newState = Object.assign({}, state, {getFormValues: action.payload});
            return newState;
            break;
        // 维保工单-执行汇报
        case 'WORK_ORDER_REPORT_GET_LIST':
            newState = Object.assign({}, state, {workOrderReportListData: action.payload});
            return newState;
            break;
        // 维保工单-验收确认
        case 'WORK_ORDER_CHECK_GET_LIST':
            newState = Object.assign({}, state, {workOrderCheckListData: action.payload});
            return newState;
            break;
        // 新建工单获取工单编码
        case 'GET_WORK_ORDER_CODE':
            newState = Object.assign({}, state, {workOrderCode: action.payload});
            return newState;
            break;
        
        //作业标准根据id查询
        case 'JOB_PLAN_DETAILS_GET_LIST':
            newState = Object.assign({}, state, {jobPlanDetailsListData: action.payload});
            return newState;
            break;
        case 'GET_JOB_PLAN_CODE':
            newState = Object.assign({}, state, {jobPlanCode: action.payload});
            return newState;
            break;

        //保养计划列表页
        case 'MAINTENANCE_PLAN_GET_LIST':
            newState = Object.assign({}, state, {maintenancePlanListData: action.payload});
            return newState;
            break;
        //预防计划根据id查询
        case 'MAINTENANCE_DETAIL_GET_LIST':
            newState = Object.assign({}, state, {maintenanceDetailListData: action.payload});
            return newState;
            break;
        case 'GET_MAINTENANCE_PLAN_CODE':
            newState = Object.assign({}, state, {maintenancePlanCode: action.payload});
            return newState;
            break;
        case 'WORK_ORDER_BY_MPNUM_GET_LIST':
            newState = Object.assign({}, state, {workOrderByMPlanNumListData: action.payload});
            return newState;
            break;
        default:
            return state;
    }
}

export default sysReducer;
