/** 
 * @Description 报表
 */
let initState = {
    menuTreeData: [], //*** 初始化域管理分页列表数据
};

let newState;

function reportReducer(state = initState, action) {
    switch (action.type) {
        case 'REPORT_GET_TREE':
            let treeNode = [];
            action.payload.forEach((item) => {
                if (item.hasChildren) {
                    treeNode.push({key: item.id, title: item.name, url: item.url, children: []});
                } else {
                    treeNode.push({key: item.id, title: item.name, url: item.url});
                }
            });
            newState = Object.assign({}, state, {menuTreeData: treeNode});
            return newState; //*** 返回新的状态
            break;
        default:
            return state;
    }
}

export default reportReducer;