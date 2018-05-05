/**
 *  
 */

let initState = {
	//--------------------settings-------------------------//
    testState: '',
    domainListData: [], //*** 初始化域管理分页列表数据
    ipListData: {}, //*** 初始化域管理分页列表数据
    ipKeyword:{},//IP查询的关键词
    ipDetail: undefined,//详细信息,
    qrCodeListData: [],//二维码管理列表
    codeByIdListData: [],//根据Id查询二维码管理
    allPropertyListData: [],//查询二维码应用程序所有属性
    getCodeData: [],  //新建时自动生成编码
    getFormValues: true,
	//--------------------mytask-------------------------//
    keyword:{},
    taskPageData: {}, //*** 初始化任务分页列表数据
    currentTab:null,//当前页位置
    myTaskStatus:[],//状态数据
    getAllStatus:true,//获取全部按钮，true:获取非关闭，false：全部
    myTaskLogo:null,//待办，经办任务的徽标
    batchAssignmentButton:false ,//true:展示，false :隐藏
    myTaskSelect:[],//选择数据
    myTaskSelectId:null,//选择的数据id,用于主界面和各个批量处理界面传id使用
    myTaskRefresh:null,//保存刷新参数，用于头部刷新子页面
    myTaskRefreshSign:false,//刷新标识
    myTaskLogoNumToDo:{},
    myTaskLogoNumDone:{},
    
	//--------------------mytask-------------------------//

    // dashboard

    // 总部
    dataStatisticsList: [],

    // 项目
    historyTodayList: [],
    todoStatisticsList: [],
    
}

let newState;

function homeReducer (state = initState, action) {
    switch (action.type) {
	//--------------------settings-------------------------//
        case 'DOMAIN_GET_LIST':
            newState = Object.assign({}, state, {domainListData: action.payload});
            return newState;
            break;
        case 'IP_GET_LIST':
            newState = Object.assign({}, state, {ipListData: action.payload});
            return newState;
            break;
        case 'IP_GET_KEYWORD':
            newState = Object.assign({}, state, {ipKeyword: action.payload});
            return newState;
            break;
        case 'IP_FIND_ONE':
            newState = Object.assign({}, state, {ipDetail: action.payload});
            return newState;
            break;
        case 'QR_CODE_GET_LIST':
            newState = Object.assign({}, state, {qrCodeListData: action.payload});
            return newState;
            break;
        case 'CODE_BYID_GET_LIST':
            newState = Object.assign({}, state, {codeByIdListData: action.payload});
            return newState;
            break;
        case 'ALL_PROPERTY_GET_LIST':
            newState = Object.assign({}, state, {allPropertyListData: action.payload});
            return newState;
            break;
        case 'CODE_GET_LIST':
            newState = Object.assign({}, state, {getCodeData: action.payload});
            return newState;
            break;
        case 'GET_FORM_VALUES':
            newState = Object.assign({}, state, {getFormValues: action.payload});
            return newState;
            break;
	//--------------------mytask-------------------------//
        case 'BACKLOG_MAINTENANCE_GET_LIST':
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState;
            break;
        case 'BACKLOG_ALL_GET_LIST':
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState;
            break;
        case 'BACKLOG_REPAIR_GET_LIST':
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState;
            break;
        case 'HANDLE_MAINTENANCE_GET_LIST':
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState;
            break;
        case 'HANDLE_ALL_GET_LIST':
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState;
            break;
        case 'HANDLE_REPAIR_GET_LIST':
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState;
            break;
        case 'HANDLE_GET_KEYWORD':
            newState = Object.assign({}, state, {keyword:  action.payload});
            return newState;
            break;
        case 'BACKLOG_PATROL_GET_LIST':
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState;
            break;
        case 'BACKLOG_DISPATCH_GET_LIST':
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState;
            break;
        case 'HANDLE_PATROL_GET_LIST':
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState;
            break;
        case 'HANDLE_DISPATCH_GET_LIST':
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState;
            break;
        case 'MY_TASK_TODO':
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState;
        case 'MY_TASK_DONE':
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState;
            break;
        case 'MY_TASK_TODO_LOGO':
            newState = Object.assign({}, state, {myTaskLogo:  action.payload});
            return newState;
        case 'MY_TASK_DONE_LOGO':
            newState = Object.assign({}, state, {myTaskLogo:  action.payload});
            return newState;
            break;
        case 'TASK_LOGO_NUM_TODO':
            newState = Object.assign({}, state, {myTaskLogoNumToDo:  action.payload});
            return newState;
            break;
        case 'TASK_LOGO_NUM_DONE':
            newState = Object.assign({}, state, {myTaskLogoNumDone:  action.payload});
            return newState;
            break;
	//--------------------mytask-------------------------//

    // dashboard-总部
        case 'DATA_STATISTICS':
            newState = Object.assign({}, state, {dataStatisticsList: action.payload});
            return newState;
            break;
    // dashboard-项目
        case 'HISTORY_TODAY':
            newState = Object.assign({}, state, {historyTodayList: action.payload});
            return newState;
            break;
        case 'TODO_STATISTICS':
            newState = Object.assign({}, state, {todoStatisticsList: action.payload});
            return newState;
            break;
        default:
            return state;
    }
}

export default homeReducer;

