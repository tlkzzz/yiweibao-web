/** 
 * @Description  我的任务
 */
let initState = {
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
    myTaskRefreshSign:false//刷新标识
};

let newState;

function myTaskReducer(state = initState, action) {
    switch (action.type) {
        case 'BACKLOG_MAINTENANCE_GET_LIST':
            console.log("----------action.payload-----",action.payload);
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'BACKLOG_ALL_GET_LIST':
            console.log("----------action.payload-----",action.payload);
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'BACKLOG_REPAIR_GET_LIST':
            console.log("----------action.payload-----",action.payload);
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'HANDLE_MAINTENANCE_GET_LIST':
            console.log("----------action.payload-----",action.payload);
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'HANDLE_ALL_GET_LIST':
            console.log("----------action.payload-----",action.payload);
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'HANDLE_REPAIR_GET_LIST':
            console.log("----------action.payload-----",action.payload);
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'HANDLE_GET_KEYWORD':
            console.log("------HANDLE_GET_KEYWORD----action.payload-----",action.payload);
            newState = Object.assign({}, state, {keyword:  action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'BACKLOG_PATROL_GET_LIST':
            console.log("----------BACKLOG_PATROL_GET_LIST-----",action.payload);
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'BACKLOG_DISPATCH_GET_LIST':
            console.log("----------BACKLOG_DISPATCH_GET_LIST-----",action.payload);
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'HANDLE_PATROL_GET_LIST':
            console.log("----------HANDLE_PATROL_GET_LIST-----",action.payload);
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'HANDLE_DISPATCH_GET_LIST':
            console.log("----------HANDLE_DISPATCH_GET_LIST-----",action.payload);
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'MY_TASK_TODO':
            console.log("------MY_TASK_TODO-----",action.payload);
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState; //*** 返回新的状态
        case 'MY_TASK_DONE':
            console.log("------MY_TASK_DONE-----",action.payload);
            newState = Object.assign({}, state, {taskPageData:  action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'MY_TASK_TODO_LOGO':
            console.log("------MY_TASK_TODO-----",action.payload);
            newState = Object.assign({}, state, {myTaskLogo:  action.payload});
            return newState; //*** 返回新的状态
        case 'MY_TASK_DONE_LOGO':
            console.log("------MY_TASK_DONE-----",action.payload);
            newState = Object.assign({}, state, {myTaskLogo:  action.payload});
            return newState; //*** 返回新的状态
            break;

        default:
            return state;
    }
}

export default myTaskReducer;