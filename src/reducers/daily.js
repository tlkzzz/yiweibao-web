/** 
 * @Description 日常运行
 */
let initState = {
    copymeterListData: {},
    getFormValues: false,
    copymeterEntity: {},
    meterListData:{},
};

let newState;

function dailyReducer(state = initState, action) {
    switch (action.type) {
        case 'COPYMETER_GET_LIST':
            newState = Object.assign({}, state, {copymeterListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'GET_FORM_VALUES':
            newState = Object.assign({}, state, {getFormValues: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'COPYMETER_ENTITY':
            newState = Object.assign({}, state, {copymeterEntity: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'COPYMETER_DETAIL_GET_LIST':
            newState = Object.assign({}, state, {copymeterDetailListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'METER_GET_LIST':
            newState = Object.assign({}, state, {meterListData: action.payload});
            return newState;
            break;


        default:
            return state;
    }
}

export default dailyReducer;