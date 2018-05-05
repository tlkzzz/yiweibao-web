/**
  * @Description 环境监测 设备
 */
let initState = {

    environmentAssetListData: [], //*** 初始化环境监测设备分页列表数据
    classifiTreeData: [],
    classifiListData: [],
    locationTreeData: [],
    assetDetailData: '',
    meterListData: [],
    getFormValues: false,
    meterInfo:'',
    pointListData: [],
    recordsListData: [],
    meterWarningListData: [],
    warningFresh : false ,
    meterListHide: false ,
    meterListFresh: false ,
    detailTitle: '' , //详情页标题
    generatorCode: '' ,//自动编码
}
let newState;

function environmentReducer(state = initState, action) {
    switch (action.type) {
    	/*
	     * 环境监测 设备列表
	     */
        case 'ENVIRONMENT_ASSET_GET_LIST':
            newState = Object.assign({}, state, { environmentAssetListData: action.payload });
            return newState; //*** 返回新的状态
            break;
        /**
         * 位置树结构
         */
        case 'LOCATION_GET_TREE':
            newState = Object.assign({}, state, { locationTreeData: action.payload });
            return newState;
            break;
        /**
         * 分类树结构
         */
        case 'CLASSIFI_GET_TREE':
            newState = Object.assign({}, state, { classifiTreeData: action.payload });
            return newState;
            break;
        /**
         * 环境监测详情
         */
        case 'ENVIRONMENT_ASSET_GET_DETAIL':
            newState = Object.assign({}, state, { assetDetailData: action.payload });
            return newState;
            break;
        /**
         * 相关测点信息
         */
        case 'METER_LIST':
            newState = Object.assign({}, state, { meterListData: action.payload });
            return newState;
            break;
        /**
         * 测点的报警规则
         */
        case 'WARNING_LIST':
            newState = Object.assign({}, state, { meterWarningListData: action.payload });
            return newState;
            break;
        case 'GET_FORM_VALUES':
            newState = Object.assign({}, state, { getFormValues: action.payload });
            return newState;
            break;
        case 'SET_METER_INFO':
            newState = Object.assign({}, state, { meterInfo: action.payload });
            return newState;
            break;
        case 'POINT_GET_LIST':
            newState = Object.assign({}, state, { pointListData: action.payload });
            return newState;
            break;
        //关联工单
        case 'RECORDS_GET_LIST':
            newState = Object.assign({}, state, {recordsListData: action.payload});
            return newState;
            break;
        //刷新报警页面
        case 'WARNING_FRESH':
            newState = Object.assign({}, state, {warningFresh: action.payload});
            return newState;
            break;
        //清空点列表数据
        case 'METER_LIST_HIDE':
            newState = Object.assign({}, state, {meterListHide: action.payload});
            return newState;
            break;
        //刷新点列表
        case 'SET_METER_LIST_FRESH':
            newState = Object.assign({}, state, {meterListFresh: action.payload});
            return newState;
            break;   
        case 'DETAIL_TITLE':
            newState = Object.assign({}, state, { detailTitle: action.payload});
            return newState;
            break;        
        case 'GENERATOR_CODE':
            newState = Object.assign({}, state, { generatorCode: action.payload});
            return newState;
            break; 
        default:
            return state;
    }
}

export default environmentReducer;
