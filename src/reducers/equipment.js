/** 
 * @Description 设备设施台账
 */
let initState = {
//位置体系数据
    locationsListData: [],
    locationDetailListData: [],
    subListData: [],
    assetListData: [],
    locationMaintenanceListData: [],
//设备设施台账数据
    informationListData: [],
    statusList: [],
    getCodeData: [],  //新建时自动生成编码
    technologyListData: [],
    structureListData: [],
    //物料信息
    materialsByIdListData: [],
    materialsListData: [],
    //作业标准
    worksListData: [],
    maintenanceListData: [],
    //关联测点
    meterListData: [],
    pointListData: [],

    recordsListData: [],
    drawListData: [],
    energyPriceListData: [],
    getFormValues: false,
    meterEntity:{},
};

let newState;

function equipmentReducer(state = initState, action) {
    switch (action.type) {
        case 'LOCATIONS_GET_LIST':
            newState = Object.assign({}, state, {locationsListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        //location_1页面信息
        case 'LOCATION_DETAIL_GET_LIST':
            newState = Object.assign({}, state, {locationDetailListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'SUB_GET_LIST':
            newState = Object.assign({}, state, {subListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        //关联设备
        case 'ASSET_GET_LIST':
            newState = Object.assign({}, state, {assetListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        //根据locationId查询维保记录
        case 'LOCATION_MAINTENANCE_GET_LIST':
            newState = Object.assign({}, state, {locationMaintenanceListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        //设备设施信息
        case 'INFORMATION_GET_LIST':
            newState = Object.assign({}, state, {informationListData: action.payload});
            return newState;
            break;
        case 'CODE_GET_LIST':
            newState = Object.assign({}, state, {getCodeData: action.payload});
            return newState;
            break;
        case 'STATUS_LIST':
            newState = Object.assign({}, state, {statusList: action.payload});
            return newState;
            break;
        //技术参数
        case 'TECHNOLOGY_GET_LIST':
            newState = Object.assign({}, state, {technologyListData: action.payload});
            return newState;
            break;
        // 设备设施结构
        case 'STRUCTURE_GET_LIST':
            newState = Object.assign({}, state, {structureListData: action.payload});
            return newState;
            break;
        //物料信息部分
        case 'MATERIALS_BYID_GET_LIST':
            newState = Object.assign({}, state, {materialsByIdListData: action.payload});
            return newState;
            break;
        case 'MATERIALS_GET_LIST':
            newState = Object.assign({}, state, {materialsListData: action.payload});
            return newState;
            break;
        // 作业标准
        case 'WORKS_GET_LIST':
            newState = Object.assign({}, state, {worksListData: action.payload});
            return newState;
            break;
        //保养计划
        case 'MAINTENANCE_GET_LIST':
            newState = Object.assign({}, state, {maintenanceListData: action.payload});
            return newState;
            break;
        //关联测点
       case 'METER_LIST':
           newState = Object.assign({}, state, { meterListData: action.payload });
           return newState;
           break;
       case 'POINT_GET_LIST':
           newState = Object.assign({}, state, { pointListData: action.payload });
           return newState;
           break;
        //维保记录
        case 'RECORDS_GET_LIST':
            newState = Object.assign({}, state, {recordsListData: action.payload});
            return newState;
            break;
        //图纸资料
        case 'DRAW_GET_LIST':
            newState = Object.assign({}, state, {drawListData: action.payload});
            return newState;
            break;
        //仪表台账
        case 'METER_LEDGER_GET_LIST':
            newState = Object.assign({}, state, {drawListData: action.payload});
            return newState;
            break;
        //能源价格
        case 'ENERGYPRICE_GET_LIST':
            newState = Object.assign({}, state, {energyPriceListData: action.payload});
            return newState;
            break;
        //获取form表单数据
        case 'GET_FORM_VALUES':
            newState = Object.assign({}, state, {getFormValues: action.payload});
            return newState;
            break;
        //仪表设备信息
        case 'METER_NETITY':
            newState = Object.assign({}, state, {meterEntity: action.payload});
            return newState;
            break;


        default:
            return state;
    }
}

export default equipmentReducer;
