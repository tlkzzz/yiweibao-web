/**
 * 系统管理reducers 
 */

let initState = {
    domainListData: [], //*** 初始化域管理分页列表数据
    ipListData: {}, //*** 初始化域管理分页列表数据
    ipKeyword:{},//IP查询的关键词
    ipDetail: undefined,//详细信息,
    qrCodeListData: [],//二维码管理列表
    codeByIdListData: [],//根据Id查询二维码管理
    allPropertyListData: [],//查询二维码应用程序所有属性
    getCodeData: [],  //新建时自动生成编码
    getFormValues: true,
}

let newState;

function sysReducer (state = initState, action) {
    switch (action.type) {
        case 'DOMAIN_GET_LIST':
            newState = Object.assign({}, state, {domainListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'IP_GET_LIST':
            newState = Object.assign({}, state, {ipListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'IP_GET_KEYWORD':
            newState = Object.assign({}, state, {ipKeyword: action.payload});
            return newState; //*** 返回新的状态
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
        default:
            return state;
    }
}


export default sysReducer;
