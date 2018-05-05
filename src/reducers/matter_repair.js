/**
 * 报事报修reducers 
 */

let initState = {
    submit:false,

    workOrderListData: [],
    taskListData: [],
    getFormValues:false,
    getFormValidate:false,
    sendProcessShow:false,
    repairWorkFlowHistory:[],
    repairWorkOrderInfo:[],
    repairWorkOrderMaterialsList: null,     //报修工单-下发物料列表
    dispatchOrderInfo:null,
    dispatchWorkOrderListData:[],
    dispatchOrderInfoCommit:null,
    dispatchId:null,   //派工单id
    dispatchIsAdd:false, //派工单是否是增加，默认是false
    processOptionExplain:[],//流程选项注释数据

}

let newState;

function matter_repair (state = initState, action) {
    switch (action.type) {
        // 报修工单-分页列表
        case 'REPAIR_WORK_ORDER_GET_LIST':
            newState = Object.assign({}, state, {repairWorkOrderListData: action.payload});
            return newState;
            break;
        //保存表单数据
        case 'GET_FORM_VALUES':
            newState = Object.assign({}, state, {getFormValues: action.payload});
            return newState;
            break;
        //获取表单校验状态
        case 'GET_FORM_VALIDATE':
            newState = Object.assign({}, state, {getFormValidate: action.payload});
            return newState;
            break;
        //发送流程
        case 'SEND_PROCESS':
            newState = Object.assign({}, state, {sendProcessShow: action.payload});
            return newState;
            break;
        //获取执行记录
        case 'REPAIR_WORK_FLOW_HISTORY':
            newState = Object.assign({}, state, {repairWorkFlowHistory: action.payload});
            return newState;
            break;
        //获取工单详情    
        case 'REPAIR_WORK_ORDER_INFORMATION':
            newState = Object.assign({}, state, {repairWorkOrderInfo: action.payload});
            return newState;
            break;
        //获取工单物资列表
        case 'REPAIR_WORK_ORDER_MATERIALS_LIST':
            newState = Object.assign({}, state, {repairWorkOrderMaterialsList: action.payload});
            return newState;
            break;
///////////////////////派工工单
        case 'DISPATCH_WORK_ORDER_GET_LIST':
            newState = Object.assign({}, state, {dispatchWorkOrderListData: action.payload});
            return newState;
            break;
       //派工单详细
        case 'DISPATCH_ORDER_INFO':
            newState = Object.assign({}, state, {dispatchOrderInfo: action.payload});
            return newState;
            break;
          //派工单提交流程
        case 'DISPATCH_ORDER_INFO_COMMIT':
            newState = Object.assign({}, state, {dispatchOrderInfoCommit: action.payload});
            return newState;
            break;
        case 'DISPATCH_WORK_ORDER_INFORMATION':
            newState = Object.assign({}, state, {dispatchOrderInfo: action.payload});
            return newState;
            break;

        default:
            return state;
    }
}

export default matter_repair;