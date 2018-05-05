/**
 * @Description
 */
let initState = {
    getFormValues: true,
    manageListData: [], //*** 初始化合同管理分页列表数据
    manageStatusData: [],
    manageTypeData: [],
    manageInfoListData: [],    //合同信息
    manageCode: [],
    manageRecordTimeData: [],    //执行记录
    recordListData: [],    //执行记录
    constructionListData: [],//施工单数据
    maintenanceOrderListData: [],//维保工单数据
    maintenancePlanListData: [],//维保计划数据
    //施工单
    constructionListData: [], //*** 初始化域管理分页列表数据
    constructionStatusData: [],
    constructionInfoListData: [],//信息与监管记录
    constructionCode: [],
};

let newState;

function contractReducer(state = initState, action) {
    switch (action.type) {
        case 'CONTRACT_MANAGE_STATUS':
            newState = Object.assign({}, state, {manageStatusData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'CONTRACT_TYPE':
            newState = Object.assign({}, state, {manageTypeData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'MANAGE_GET_LIST':
            newState = Object.assign({}, state, {manageListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        // 合同管理-基本信息
        case 'MANAGE_INFO_GET_LIST':
            newState = Object.assign({}, state, {manageInfoListData: action.payload});
            return newState;
            break;
        case 'GET_FORM_VALUES':
            newState = Object.assign({}, state, {getFormValues: action.payload});
            return newState;
            break;
        // 新建获取合同编码
        case 'GET_MANAGE_CODE':
            newState = Object.assign({}, state, {manageCode: action.payload});
            return newState;
            break;
        case 'MANAGE_RECORD_TIME':
            newState = Object.assign({}, state, {manageRecordTimeData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'RECORD_GET_LIST':
            newState = Object.assign({}, state, {recordListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'CONSTRUCTION_GET_LIST':
            newState = Object.assign({}, state, {constructionListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'MAINTENANCE_ORDER_GET_LIST':
            newState = Object.assign({}, state, {maintenanceOrderListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'MAINTENANCE_PLAN_GET_LIST':
            newState = Object.assign({}, state, {maintenancePlanListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'CONSTRUCTION_GET_LIST':
            newState = Object.assign({}, state, {constructionListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'CONSTRUCTION_STATUS':
            newState = Object.assign({}, state, {constructionStatusData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'CONSTRUCTION_INFO_GET_LIST':
            newState = Object.assign({}, state, {constructionInfoListData: action.payload});
            return newState;
            break;
        // 新建获取巡检工单编码
        case 'GET_CONSTRUCTION_CODE':
            newState = Object.assign({}, state, {constructionCode: action.payload});
            return newState;
            break;
        default:
            return state;
    }
}

export default contractReducer;