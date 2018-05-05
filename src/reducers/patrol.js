/** 
 * @Description
 */
let initState = {
    getFormValues: true,
    pointListData: [], //*** 初始化巡检点台账分页列表数据
    pointStatusData: [],
    pointTypeData: [],
    termListData: [],    //巡检项
    pointCode: [],
    pointRecordListData: [],//巡检记录
    routeListData: [], //*** 初始化巡检路线分页列表数据
    routeStatusData: [],
    routeTypeData: [],
    routePointListData: [],    //巡检路线-巡检点
    pointAddListData: [],
    routeCode: [],
    planListData: [], //*** 初始化巡检计划分页列表数据
    planStatusData: [],
    planTypeData: [],
    frequencyListData: [],    //频率
    planCode: [],
    orderListData: [], //*** 初始化巡检工单分页列表数据
    orderStatusData: [],
    orderTypeData: [],
    patrolOrderCommitListData: [],//提报
    orderCode: [],
    orderPointListData:[],
    orderRecordTimeData: [],    //执行记录
    recordListData: [],    //执行记录
    standListData: [],// 巡检标准列表数据
    standardEntity: {},//根据id查找对象
    standardContentListData: [],//巡检标准内容列表数据
    pointTermListData:[],

};

let newState;

function patrolReducer(state = initState, action) {
    switch (action.type) {
        case 'POINT_STATUS':
            newState = Object.assign({}, state, {pointStatusData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'POINT_TYPE':
            newState = Object.assign({}, state, {pointTypeData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'POINT_GET_LIST':
            newState = Object.assign({}, state, {pointListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        // 巡检点台账-基本信息
        case 'TERM_GET_LIST':
            newState = Object.assign({}, state, {termListData: action.payload});
            return newState;
            break;
        case 'GET_FORM_VALUES':
            newState = Object.assign({}, state, {getFormValues: action.payload});
            return newState;
            break;
        // 新建获取巡检点编码
        case 'GET_POINT_CODE':
            newState = Object.assign({}, state, {pointCode: action.payload});
            return newState;
            break;
        //巡检点台账-巡检记录
        case 'POINT_RECORD_GET_LIST':
            newState = Object.assign({}, state, {pointRecordListData: action.payload});
            return newState;
            break;
        //巡检路线
        case 'ROUTE_STATUS':
            newState = Object.assign({}, state, {routeStatusData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'ROUTE_TYPE':
            newState = Object.assign({}, state, {routeTypeData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'ROUTE_GET_LIST':
            newState = Object.assign({}, state, {routeListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'POINT_ADD_GET_LIST':
            newState = Object.assign({}, state, {pointAddListData: action.payload});
            return newState;
            break;
        // 巡检路线子页面
        case 'ROUTE_POINT_GET_LIST':
            newState = Object.assign({}, state, {routePointListData: action.payload});
            return newState;
            break;
        // 新建获取巡检点编码
        case 'GET_ROUTE_CODE':
            newState = Object.assign({}, state, {routeCode: action.payload});
            return newState;
            break;
        //巡检计划
        case 'PLAN_STATUS':
            newState = Object.assign({}, state, {planStatusData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'PLAN_TYPE':
            newState = Object.assign({}, state, {planTypeData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'PLAN_GET_LIST':
            newState = Object.assign({}, state, {planListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'FREQUENCY_GET_LIST':
            newState = Object.assign({}, state, {frequencyListData: action.payload});
            return newState;
            break;
        // 新建获取巡检点编码
        case 'GET_PLAN_CODE':
            newState = Object.assign({}, state, {planCode: action.payload});
            return newState;
            break;
        //巡检工单
        case 'ORDER_STATUS':
            newState = Object.assign({}, state, {orderStatusData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'ORDER_TYPE':
            newState = Object.assign({}, state, {orderTypeData: action.payload});
            return newState; //*** 返回新的状态
            break;
            break;
        case 'PATROL_ORDER_COMMIT_GET_LIST':
            newState = Object.assign({}, state, {patrolOrderCommitListData: action.payload});
            return newState;
            break;
        // 新建获取巡检工单编码
        case 'GET_ORDER_CODE':
            newState = Object.assign({}, state, {orderCode: action.payload});
            return newState;
            break;
        case 'ORDER_GET_LIST':
            newState = Object.assign({}, state, {orderListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'ORDER_POINT_GET_LIST':
            newState = Object.assign({}, state, {orderPointListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'POINT_TERM_GET_LIST'://巡检标准内容列表数据
            newState = Object.assign({}, state, {pointTermListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'ORDER_RECORD_TIME':
            newState = Object.assign({}, state, {orderRecordTimeData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'RECORD_GET_LIST':
            newState = Object.assign({}, state, {recordListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'STANDARD_GET_LIST'://巡检标准列表数据
            newState = Object.assign({}, state, {standListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'STANDARD_ENTITY'://巡检标准实体数据
            newState = Object.assign({}, state, {standardEntity: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'STANDARD_CONTENT_GET_LIST'://巡检标准内容列表数据
            newState = Object.assign({}, state, {standardContentListData: action.payload});
            return newState; //*** 返回新的状态
            break;



        default:
            return state;
    }
}

export default patrolReducer;