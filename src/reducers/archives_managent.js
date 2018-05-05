

let initState = {

    archivesListData: [],
    findArchivesDetail:[],
    archivesLogList:[],
    getFormValues:true,
    archivesTreeData:[],
    imgPath:[],
    imgPathList:[],
    archivesCode:'',
}

let newState;

function archivesReducer (state = initState, action) {
    switch (action.type) {
        //能源价格
        case 'ARCHIVES_GET_LIST':
            newState = Object.assign({}, state, {archivesListData: action.payload});
            return newState;
            break;
        case 'ARCHIVESDETAIL_LIST':
            newState = Object.assign({}, state, {findArchivesDetail: action.payload});
            return newState;
            break;
        case 'ARCHIVESLOG_GET_LIST':
            newState = Object.assign({}, state, {archivesLogList: action.payload});
            return newState;
            break;
        case 'GET_ARCHIVES_FORM_VALUES':
            newState = Object.assign({}, state, {getFormValues: action.payload});
            return newState;
            break;
        case 'ARCHIVESDETAIL_TREE':
            newState = Object.assign({}, state, {archivesTreeData: action.payload});
            return newState;
            break;
        case 'IMG_PATH':
            newState = Object.assign({}, state, {imgPath: action.payload});
            return newState;
            break;
         case 'IMG_PATH_LIST':
            newState = Object.assign({}, state, {imgPathList: action.payload});
            return newState;
            break;


        default:
            return state;
    }
}

export default archivesReducer;
