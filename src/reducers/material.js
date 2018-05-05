/** 
 * @Description 物资管理
 */
let initState = {
    //*** 初始化物资管理分页列表数据
    itemListData: [],
    inventoryListData: [],
    storeroomListData: [],
    goodsreceiveListData: [],
    releaseListData: [],
    checkListData: [],
    itemEntity: {},
    inventoryByItemIdListData: [],
    inventoryEntity: {},
    checkByInvtoryListData: [],
    storeroomEntity: {},
    inventoryByStoreroomIdListData: [],
    receiveEntity: {},
    receiveDetailListData:[],
    releaseEntity:{},
    releasedetailListData:[],
    checkEntity:{},
    checkdetailList:[],
    inventoryByStoreroomIdAndCheckId:[],
    getFormValues: false,
    unitList:[],


};

let newState;

function materialReducer(state = initState, action) {


    switch (action.type) {
        case 'ITEM_GET_LIST':
            newState = Object.assign({}, state, {itemListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'INVENTORY_GET_LIST':
            newState = Object.assign({}, state, {inventoryListData: action.payload});
            return newState; //*** 返回新的状态
            break;

        case 'INVENTORY_GET_LIST_BY_ITEM_ID':
            newState = Object.assign({}, state, {inventoryByItemIdListData: action.payload});
            return newState; //*** 返回新的状态
            break;

        case 'STOREROOM_GET_LIST':
            newState = Object.assign({}, state, {storeroomListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'GOODSRECEIVES_GET_LIST':
            newState = Object.assign({}, state, {goodsreceiveListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'RELEASE_GET_LIST':
            newState = Object.assign({}, state, {releaseListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'CHECK_GET_LIST':
            newState = Object.assign({}, state, {checkListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'ITEM':
            newState = Object.assign({}, state, {itemEntity: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'INVENTORY':
            newState = Object.assign({}, state, {inventoryEntity: action.payload});
            return newState; //*** 返回新的状态
            break;

        case 'CHECK_GET_LIST_BY_INVTORY':
            newState = Object.assign({}, state, {checkByInvtoryListData: action.payload});
            return newState; //*** 返回新的状态
            break;

        case 'STOREROOM_ENTITY':
            newState = Object.assign({}, state, {storeroomEntity: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'INVENTORY_BY_STOREROOM':
            newState = Object.assign({}, state, {inventoryByStoreroomIdListData: action.payload});
            return newState; //*** 返回新的状态
            break;

        case 'GOODSRECEIVES_ENTITY':
            newState = Object.assign({}, state, {receiveEntity: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'GOODSRECEIVEDETAIL_LIST':
            newState = Object.assign({}, state, {receiveDetailListData: action.payload});
            return newState; //*** 返回新的状态
            break;

        case 'RELEASE_ENTITY':
            newState = Object.assign({}, state, {releaseEntity: action.payload});
            return newState; //*** 返回新的状态
            break;

        case 'RELEASEDETAIL_LIST':
            newState = Object.assign({}, state, {releasedetailListData: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'CHECK_ENTITY':
            newState = Object.assign({}, state, {checkEntity: action.payload});
            return newState; //*** 返回新的状态
            break;

        case 'CHECKDETAIL_LIST':
            newState = Object.assign({}, state, {checkdetailList: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'GET_FORM_VALUES':
            newState = Object.assign({}, state, {getFormValues: action.payload});
            return newState;
            break;

        case 'INVENTORY_BY_STOREROOMIDANDCHECKID':
            newState = Object.assign({}, state, {inventoryByStoreroomIdAndCheckId: action.payload});
            return newState; //*** 返回新的状态
            break;
        case 'UNIT_LIST':
            newState = Object.assign({}, state, {unitList: action.payload});
            return newState; //*** 返回新的状态
            break;





        default:
            return state;
    }

}

export default materialReducer;