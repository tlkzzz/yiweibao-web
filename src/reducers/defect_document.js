/**
 * @Description: 缺陷管理
 */
let initState = {
   defectInfo:null,//缺陷详细
   defectPageList:[],//缺陷列表
   defectOrderInfo:null,//整改单详细
    defectOrderList:[],//整改单列表
    defectStatusDescription:null,//缺陷单状态翻译
    getFormValues:false,
    defectIsAdd:false,//是否添加
    defectIsEdit:true,//是否可以编辑
    defectProcessButton:true, //流程按钮状态
    processOptionExplain:[],//流程选项备注数据

};

let newState;

function defectDocumentReducer(state = initState, action) {
    switch (action.type) {
        case 'DEFECT_PAGE_LIST':
            newState = Object.assign({}, state, {defectPageList: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'DEFECT_INFO':
            newState = Object.assign({}, state, {defectInfo: action.payload});
            return newState; //*** 返回新的状态
            break;
        //保存表单数据
        case 'GET_FORM_VALUES':
            newState = Object.assign({}, state, {getFormValues: action.payload});
            return newState;
            break;
        case 'UPDATE_DEFECT_INFO':
            newState = Object.assign({}, state, {defectInfo: action.payload});
            return newState;
            break;
        case 'GET_DEFECT_ADD_STATE':
            newState = Object.assign({}, state, {defectIsAdd: action.payload});
            return newState;
            break;
        case 'UPDATE_DEFECT_STATUS_DESCRIPTION':
            newState = Object.assign({}, state, {defectStatusDescription: action.payload});
            return newState;
            break;


        // //保存表单数据
        // case 'DEFECT_IS_ADD':
        //     newState = Object.assign({}, state, {defectIsAdd: action.payload});
        //     return newState;
        //     break;
        // case 'DEFECT_IS_EDIT':
        //     newState = Object.assign({}, state, {defectIsEdit: action.payload});
        //     return newState;
        //     break;
        default:
            return state;
    }
}

export default defectDocumentReducer;