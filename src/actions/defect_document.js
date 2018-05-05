/** 
 * @Description: 缺陷管理
 */
import {_fetch} from '../tools/';

let actions = {
    //actionCreator
    actionCreator: (type, state) => ({
        type: type,
        payload: state
    }),
    //*** 请求域管理分页列表 方法内只做数据处理 严禁写任何业务逻辑

    //缺陷单更新state
    updateDefectWorkOrder: (param, cb) => (dispatch, getState) => {

     dispatch(actions.actionCreator("UPDATE_DEFECT_INFO", param));

    },
    updateDefectStatusDescription: (param, cb) => (dispatch, getState) => {

        dispatch(actions.actionCreator("UPDATE_DEFECT_STATUS_DESCRIPTION", param));

    },


    //缺陷单分页
    getdefectPageList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/defectDocument/findPageDefectDocumentList',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("DEFECT_PAGE_LIST", json.data));
                cb && cb(json);
            }
        });
    },
    //保存数据按钮
    getFormValues: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('GET_FORM_VALUES', state));
    },
    //获取，更新更新状态
    getAddState: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('GET_DEFECT_ADD_STATE', state));
    },
    // //获取增加状态
    // getDefectIsAdd: (state) => (dispatch, getState) => {
    //     dispatch(actions.actionCreator('DEFECT_IS_ADD', state));
    // },
    // //获取缺陷单是否可以更改
    // getDefectIsEdit: (state) => (dispatch, getState) => {
    //     dispatch(actions.actionCreator('DEFECT_IS_EDIT', state));
    // },
    saveDefect: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/defectDocument/saveDefectDocumentCommit',
            data: param,
            type: 'post',
            success: json => {
              // dispatch(actions.actionCreator("DEFECT_PAGE_LIST", json.data));
                cb && cb(json);
            }
        });
    },

    //缺陷单详细
    getdefectInfoById: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/defectDocument/findDefectDocumentById',
            data: param,
            type: 'GET',
            success: json => {
                dispatch({
                    type: 'DEFECT_INFO',
                    payload: json.data
                });
                cb && cb(json.data);
            }
        });
    },
    //缺陷单收藏
    defectCollection: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/defectDocument/collect',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                dispatch({
                    type: 'CONSTRUCTION_GET_LIST', //*** reducer接收数据的唯一标识
                    payload: json.data       //*** 数据发送到reducer
                });
                cb && cb();
            }
        });
    },
    //缺陷单取消收藏
    defectCancelCollection: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/defectDocument/collect/cancel',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                dispatch({
                    type: 'CONSTRUCTION_GET_LIST', //*** reducer接收数据的唯一标识
                    payload: json.data       //*** 数据发送到reducer
                });
                cb && cb();
            }
        });
    },
    //缺陷单验证编码唯一性
    checkDefectDocumentNumUnique: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/defectDocument/checkDefectDocumentNumUnique',
            data: param,
            type: 'Get',
            success: json => {
                dispatch({
                    type: 'CONSTRUCTION_GET_LIST', //*** reducer接收数据的唯一标识
                    payload: json.data       //*** 数据发送到reducer
                });
                cb && cb();
            }
        });
    },
    //新建整改单选择缺陷单的查询列表
    findPageDefectOrderByDefectDocumentId: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/defectOrder/findPageDefectOrderByDefectDocumentId',
            data: param,
            type: 'post',
            success: json => {
                dispatch({
                    type: 'CONSTRUCTION_GET_LIST', //*** reducer接收数据的唯一标识
                    payload: json.data       //*** 数据发送到reducer
                });
                cb && cb();
            }
        });
    },
    //删除缺陷单
    deleteDedect: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/defectDocument/deleteDefectDocumentList',
            data: param,
            type: 'get',
            //formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },

    //工作流提交
    defectOrderCommit: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/defectDocument/commit',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
               // dispatch(actions.actionCreator('DISPATCH_ORDER_INFO_COMMIT', json.data));
                cb && cb(json);
            }
        });
    },
    // 变更状态
    statusChange: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/defectDocument/updateDefectDocumentStatusList',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },

};

export default actions;