/**
 * @Description 报表
 */
import { _fetch } from '../tools/';

let actions = {
    //actionCreator
    actionCreator: (type, state) => ({
        type: type,
        payload: state
    }),
    //*** 请求域管理分页列表 方法内只做数据处理 严禁写任何业务逻辑
    reportMenuGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/uas/open/resources/findResourceByParentId',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("REPORT_GET_TREE",json.data));
                cb && cb();
            }
        });
    },

};

export default actions;