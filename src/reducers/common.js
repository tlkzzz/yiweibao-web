/**
 *  公用组件reducer
 */

let initState = {
    lang: 'zh_CN',
    orgId: '',
    siteId: '',
    orgName: '',
    orgList: '',
    siteName: '',
    siteList: [],
    loginName: '',
    personName: '',
    personId: '',
    personMobile: '',
    productArray: [],
    productList: [],
    userId: '',
    email: '',
    position: '',

    parentCodeListData: [],
    companiesListData: [],
    personListData: [],
    classifiTreeData: [],
    locationsTreeData: [],
    assetsListData: [],
    locationListData: [],
    classifiListData: [],
    codeEntity:'',
    //作业标准列表
    jobPlanListData: [],
    // 域值
    workOrderStatusData: [], // 工单状态
    workOrderTypeData: [], // 工单类型
    workProjectTypeData: [], // 工程类型
    suspensionTypeData: [], // 挂起类型
    standardTypeData: [], // 作业标准类型
    jpTypeData: [], // 作业类型
    jpStatusData: [], // 作业状态
    pmStatusData: [], // 预防维护状态
    responsibleGroupData: [], // 责任班组
    timeFrequencyData: [], // 频率单位

    //物资
    inventoryCostTypeData: [],//发放成本类型
    inventoryABCTypeData: [],// abc类型
    inventoryStatusData: [],//库存状态
    releaseStatusData: [],//物资发放状态
    releaseTypeData: [],//物资发放类型
    receiveTypeData: [],//物资接收类型
    receiveStatusData: [],//物资接收状态
    checkStatusData: [],//盘点状态

    //抄表管理
    meterType: [],
    copymeterStatusData: [],//抄表状态


    departmentList:[],//部门
    workOrderSourceData:[],//工单来源
    incidentNatureData:[],//报修工单-事件性质
    incidentLevelData:[],//报修工单-事件级别
    //巡检
    patrolTypeData: [], // 巡检类型
    pointStatusData: [],//巡检点状态
    routeStatusData: [],//路线状态
    routeListData:[],//路线数据
    planStatusData:[],//计划状态
    planListData:[],//计划数据
    orderStatusData: [],//工单状态

    //二维码应用程序
    applicationListData: [],
    //供应商
    vendorListData: [],


    processExecutionRecord:[],//获取流程执行记录
    taskProperty:[],
    checkItem:[]  ,
    workType:[],
    hqPlanType:[],//总部计划--计划状态
    hqWorkType:[],//例行工作--计划状态
    datilyTaskNum:null,//例行工作单CODE
    dailyTaskState:[],//例行工作单状态
    dispatchOrderState:[],//派工工单状态
    taskType:[],//任务类型（工单）
    taskTypeStauts:[],//任务类型状态
    getPersonByDomain:[],////根据域值value或者域获取人员
    timeFrequency:[],//频率单位
    myTaskStatus:[],//我的任务状态

    //合同
    contractTypeData: [], // 合同类型
    manageStatusData: [],//合同状态
    manageListData: [],//合同数据
    constructionStatusData: [],//施工单状态

    //缺陷
    responsibility:[],//责任属性
    importance:[],//重要程度
    standard:[],//依据标准
    region:[],//区域
    buildingNumber:[],//楼号
    floors:[],//楼层
    defectStatus:[]//缺陷单状态

}

let newState;

function commonReducer (state = initState, action) {
    switch (action.type) {
        case 'CHANGE_LANG':
            newState = Object.assign({}, state, {lang: action.payload});
            return newState;
            break;
        case 'ORG_ID':
            newState = Object.assign({}, state, {orgId: action.payload});
            return newState;
            break;
        case 'SITE_ID':
            newState = Object.assign({}, state, {siteId: action.payload});
            return newState;
            break;
        case 'ORG_NAME':
            newState = Object.assign({}, state, {orgName: action.payload});
            return newState;
            break;
        case 'ORG_LIST':
            newState = Object.assign({}, state, {orgList: action.payload});
            return newState;
            break;
        case 'SITE_NAME':
            newState = Object.assign({}, state, {siteName: action.payload});
            return newState;
            break;
        case 'SITE_LIST':
            newState = Object.assign({}, state, {siteList: action.payload});
            return newState;
            break;
        case 'LOGIN_NAME':
            newState = Object.assign({}, state, {loginName: action.payload});
            return newState;
            break;
        case 'PERSON_NAME':
            newState = Object.assign({}, state, {personName: action.payload});
            return newState;
            break;
        case 'PERSON_ID':
            newState = Object.assign({}, state, {personId: action.payload});
            return newState;
            break;
        case 'PERSON_MOBILE':
            newState = Object.assign({}, state, {personMobile: action.payload});
            return newState;
            break;
        case 'PRODUCT_ARRAY':
            newState = Object.assign({}, state, {productArray: action.payload});
            return newState;
            break;
        case 'PRODUCT_LIST':
            newState = Object.assign({}, state, {productList: action.payload});
            return newState;
            break;
        case 'USER_ID':
            newState = Object.assign({}, state, {userId: action.payload});
            return newState;
            break;
        case 'EMAIL':
            newState = Object.assign({}, state, {email: action.payload});
            return newState;
            break;
        case 'POSITION':
            newState = Object.assign({}, state, {position: action.payload});
            return newState;
            break;

        case 'PARENT_CODE_GET_LIST':
            newState = Object.assign({}, state, {parentCodeListData: action.payload});
            return newState;
            break;
        case 'COMPANIES_GET_LIST':
            newState = Object.assign({}, state, {companiesListData: action.payload});
            return newState;
            break;

        // 人员列表
        case 'PERSON_GET_LIST':
            newState = Object.assign({}, state, {personListData: action.payload});
            return newState;
            break;
        //获取分类树
        case 'CLASSIFI_GET_TREE':
            newState = Object.assign({}, state, {classifiTreeData: action.payload});
            return newState;
            break;
        //获取位置树
        case 'LOCATIONS_GET_TREE':
            newState = Object.assign({}, state, {locationsTreeData: action.payload});
            return newState;
            break;
        //设备列表
        case 'ASSETS_GET_LIST':
            newState = Object.assign({}, state, {assetsListData: action.payload});
            return newState;
            break;
        //位置列表
        case 'LOCATIONS_GET_LIST':
            newState = Object.assign({}, state, {locationListData: action.payload});
            return newState;
            break;
        //分类列表
        case 'CLASSIFI_GET_LIST':
            newState = Object.assign({}, state, {classifiListData: action.payload});
            return newState;
            break;

        //自动生成编码
        case 'CODE_ENTITY':
            newState = Object.assign({}, state, {codeEntity: action.payload});
            return newState;
            break;
         //作业标准列表页
        case 'JOB_PLAN_GET_LIST':
            newState = Object.assign({}, state, {jobPlanListData: action.payload});
            return newState;
            break;
        // 域值
        case 'WORK_ORDER_STATUS': // 工单状态
            newState = Object.assign({}, state, {workOrderStatusData: action.payload});
            return newState;
            break;
        case 'WORK_ORDER_TYPE': // 工单类型
            newState = Object.assign({}, state, {workOrderTypeData: action.payload});
            return newState;
            break;
        case 'WORK_PROJECT_TYPE': // 工程类型
            newState = Object.assign({}, state, {workProjectTypeData: action.payload});
            return newState;
            break;
        case 'SUSPENSION_TYPE': // 挂起类型
            newState = Object.assign({}, state, {suspensionTypeData: action.payload});
            return newState;
            break;
        case 'STANDARD_TYPE': // 作业标准类型
            newState = Object.assign({}, state, {standardTypeData: action.payload});
            return newState;
            break;
        case 'JP_TYPE': // 作业类型
            newState = Object.assign({}, state, {jpTypeData: action.payload});
            return newState;
            break;
        case 'JP_STATUS': // 作业状态
            newState = Object.assign({}, state, {jpStatusData: action.payload});
            return newState;
            break;
        case 'PM_STATUS': // 预防维护状态
            newState = Object.assign({}, state, {pmStatusData: action.payload});
            return newState;
            break;
        case 'RESPONSIBLE_GROUP': // 责任班组
            newState = Object.assign({}, state, {responsibleGroupData: action.payload});
            return newState;
            break;
        case 'TIME_FREQUENCY': // 频率单位
            newState = Object.assign({}, state, {timeFrequencyData: action.payload});
            return newState;
            break;

        case 'INVENTORY_COST_TYPE': // 发放成本类型
            newState = Object.assign({}, state, {inventoryCostTypeData: action.payload});
            return newState;
            break;
        case 'INVENTORY_ABC_TYPE': // abc类型
            newState = Object.assign({}, state, {inventoryABCTypeData: action.payload});
            return newState;
            break;
        case 'INVENTORY_STATUS': // 库存状态
            newState = Object.assign({}, state, {inventoryStatusData: action.payload});
            return newState;
            break;
        case 'RELEASE_STATUS': // 物资发放状态
            newState = Object.assign({}, state, {releaseStatusData: action.payload});
            return newState;
            break;
        case 'RELEASE_TYPE': // 物资发放类型
            newState = Object.assign({}, state, {releaseTypeData: action.payload});
            return newState;
            break;

        case 'RECEIVE_TYPE': // 物资接收类型
            newState = Object.assign({}, state, {receiveTypeData: action.payload});
            return newState;
            break;
        case 'RECEIVE_STATUS': // 物资接收状态
            newState = Object.assign({}, state, {receiveStatusData: action.payload});
            return newState;
            break;
        case 'CHECK_STATUS': // 盘点状态
            newState = Object.assign({}, state, {checkStatusData: action.payload});
            return newState;
            break;
        case 'DEPARTMENT_GET_LIST':
            newState = Object.assign({}, state, {departmentList: action.payload});
            return newState;
            break;
        case 'WORK_ORDER_SOURCE': //工单来源
            newState = Object.assign({}, state, {workOrderSourceData: action.payload});
            return newState;
            break;
        case 'WORK_ORDER_INCIDENT_NATURE': //报修工单-事件性质
            newState = Object.assign({}, state, {incidentNatureData: action.payload});
            return newState;
            break;
        case 'WORK_ORDER_INCIDENT_LEVEL': //报修工单-事件级别
            newState = Object.assign({}, state, {incidentLevelData: action.payload});
            return newState;
            break;
        case 'PATROL_TYPE': // 巡检类型
            newState = Object.assign({}, state, {patrolTypeData: action.payload});
            return newState;
            break;
        case 'PATROL_POINT_STATUS': // 路线状态
            newState = Object.assign({}, state, {pointStatusData: action.payload});
            return newState;
            break;
        case 'PATROL_ROUTE_STATUS': // 路线状态
            newState = Object.assign({}, state, {routeStatusData: action.payload});
            return newState;
            break;
        case 'ROUTE_GET_LIST':
            newState = Object.assign({}, state, {routeListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'PATROL_PLAN_STATUS': // 路线状态
            newState = Object.assign({}, state, {planStatusData: action.payload});
            return newState;
            break;
        case 'PLAN_GET_LIST':
            newState = Object.assign({}, state, {planListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'PATROL_ORDER_STATUS': // 巡检工单状态
            newState = Object.assign({}, state, {orderStatusData: action.payload});
            return newState;
            break;
        case 'APPLICATION_GET_LIST': // 二维码应用程序
            newState = Object.assign({}, state, {applicationListData: action.payload});
            return newState;
            break;
        case 'VENDOR_GET_LIST': // 二维码应用程序
            newState = Object.assign({}, state, {vendorListData: action.payload});
            return newState;
            break;
        case 'PROCESS_EXECUTION_RECORD': // 获取流程执行记录
            newState = Object.assign({}, state, {processExecutionRecord: action.payload});
            return newState;
            break;
        case 'DATILY_TASK_NUM': // 任务编码
            newState = Object.assign({}, state, {datilyTaskNum: action.payload});
            return newState;
            break;

        case 'TASKPROPERTY': // 任务属性
            newState = Object.assign({}, state, {taskProperty: action.payload});
            return newState;
            break;
        case 'CHECKITEM': // 检查项
            newState = Object.assign({}, state, {checkItem: action.payload});
            return newState;
            break;
        case 'HQ_PLAN_TYPE': // 总部计划--计划状态
            newState = Object.assign({}, state, {hqPlanType: action.payload});
            return newState;
            break;
        case 'HQ_PLAN_NATURE': // 总部计划--计划性质
            newState = Object.assign({}, state, {hqPlanNature: action.payload});
            return newState;
            break;
        case 'HQ_WORK_TYPE': // 例行工作--计划状态
            newState = Object.assign({}, state, {hqWorkType: action.payload});
            return newState;
            break;
        case 'WORKTYPE': // 工作类型
            newState = Object.assign({}, state, {workType: action.payload});
            return newState;
            break;
        case 'DAILY_TASK_STATUS': // 例行工作单状态
            newState = Object.assign({}, state, {dailyTaskState: action.payload});
            return newState;
            break;
        case 'DISPATCH_ORDER': // 派工工单状态
            newState = Object.assign({}, state, {dispatchOrderState: action.payload});
            return newState;
            break;
        case 'TASK_TYPE': // 任务类型（工单）
            newState = Object.assign({}, state, {taskType: action.payload});
            return newState;
            break;
        case 'TASK_TYPE_STATUS': // 任务类型（工单）
        newState = Object.assign({}, state, {taskTypeStauts: action.payload});
        return newState;
        break;
        case 'GET_PERSON_BY_DOMAIN': //根据域值value或者域获取人员
            newState = Object.assign({}, state, {getPersonByDomain: action.payload});
            return newState;
            break;   timeFrequency
        case 'GET_TIME_FREAUENCY': //根据域值value或者域获取人员
            newState = Object.assign({}, state, {timeFrequency: action.payload});
            return newState;
            break;
        case 'TASK_TYPE_STATUS': //根据域值value或者域获取人员
            newState = Object.assign({}, state, {myTaskStatus: action.payload});
            return newState;
            break;
        case 'CONTRACT_TYPE': // 巡检类型
            newState = Object.assign({}, state, {contractTypeData: action.payload});
            return newState;
            break;
        case 'CONTRACT_MANAGE_STATUS': // 路线状态
            newState = Object.assign({}, state, {manageStatusData: action.payload});
            return newState;
            break;
        case 'MANAGE_GET_LIST':
            newState = Object.assign({}, state, {manageListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'CONSTRUCTION_STATUS':
            newState = Object.assign({}, state, {constructionStatusData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'RESPONSIBILITY': // 责任属性
            newState = Object.assign({}, state, {responsibility: action.payload});
            return newState;
            break;
        case 'IMPORTANCE': // 重要程度
            newState = Object.assign({}, state, {importance: action.payload});
            return newState;
            break;
        case 'STANDARD': // 标准依据
            newState = Object.assign({}, state, {standard: action.payload});
            return newState;
            break;
        case 'REGION': // 区域
            newState = Object.assign({}, state, {region: action.payload});
            return newState;
            break;
        case 'BUILDI_NGNUMBER': // 楼号
            newState = Object.assign({}, state, {buildingNumber: action.payload});
            return newState;
            break;
        case 'FLOORS': // 楼层
            newState = Object.assign({}, state, {floors: action.payload});
            return newState;
            break;
        case 'METER_TYPE': //
            newState = Object.assign({}, state, {meterType: action.payload});
            return newState;
            break;
        case 'DEFECT_DOCUMENT_STATUS': // 缺陷单状态 defect
            newState = Object.assign({}, state, {defectDocumentStatus: action.payload});
            return newState;
            break;
        case 'COPY_METER_STATUS':
            newState = Object.assign({}, state, {copymeterStatusData: action.payload});
            return newState;
            break;
        default:
            return state;
    }
}

export default commonReducer;
