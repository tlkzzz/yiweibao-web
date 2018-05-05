/** 
 * @Description 总部计划
 */
let initState = {
    //*** 初始化总部计划分页列表数据
    planListData: [],
    planDetail:{},
    getFormValues:false,
    getFormValidate:false,
    dailyListData:[],
    dailyWorkIsAdd:false,//例行工作
    dailyTaskIsAdd:false,//例行工作单
    routineIsAdd:false,//总部计划
    processOptionExplain:[],//流程选项备注数据
    dailyDetail:{},
    dailyTaskList:[],
    dailyTaskInfo:null,
    workPlan:null

};

let newState;

function materialReducer(state = initState, action) {


    switch (action.type) {

        case 'PLAN_POST_LIST':
            newState = Object.assign({}, state, {planListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'GET_PLAN_DETAIL':
            newState = Object.assign({}, state, {planDetail: action.payload});
            return newState; //*** 返回新的状态
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
        //例行工作列表分页
        case 'DAILY_POST_LIST':
            newState = Object.assign({}, state, {dailyListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        //例行工作详细
        case 'GET_DAILY_DETAIL':
            newState = Object.assign({}, state, {dailyDetail: action.payload});
            return newState; //*** 返回新的状态
            break;
        //------------------------例行工作单----------------------
        //例行工作单-列表
        case 'HEADQUARTERS_DAILYTASK_LIST':
            newState = Object.assign({}, state, {dailyTaskList: action.payload});
            return newState; //*** 返回新的状态
            break;
         //例行工作单详细
        case 'HEADQUARTERS_DAILYTASK_INFO':
            newState = Object.assign({}, state, {dailyTaskInfo: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'UPDATE_DAILYTASK_ADD_STATE':
            newState = Object.assign({}, state, {dailyTaskIsAdd: action.payload});
            return newState;
            break;
        case 'UPDATE_DAILYTASK_INFO':
            newState = Object.assign({}, state, {dailyTaskInfo: action.payload});
            return newState;
            break;
        default:
            return state;
    }

}

export default materialReducer;