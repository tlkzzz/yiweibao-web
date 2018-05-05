/** 
 * @Description
 */
import {_fetch,addData, editData, delData} from '../tools/';

let actions = {
    //actionCreator
    actionCreator: (type, state) => ({
        type: type,
        payload: state
    }),


    getFormValues: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('GET_FORM_VALUES', state));
    },

    copyMeterGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/daliy/findCopyMeters',
            data: param,
            type: 'post',
            success: json => {
                dispatch({
                    type: 'COPYMETER_GET_LIST', //*** reducer接收数据的唯一标识
                    payload: json.data       //*** 数据发送到reducer
                });
                cb && cb();
            }
        });
    },

    deleteCopyMeter: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/daliy/deleteCopyMeter',
            data: param,
            type: 'get',
            success: json => {
                cb && cb(json);
            }
        });
    },
    findCopyMeterById: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/daliy/findCopyMeterById',
            data: param,
            type: 'get',
            success: json => {
                dispatch({
                    type: 'COPYMETER_ENTITY', //*** reducer接收数据的唯一标识
                    payload: json.data       //*** 数据发送到reducer
                });
                cb && cb(json);
            }
        });
    },
    findCopyMeterDetails: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/daliy/findCopyMeterDetails',
            data: param,
            type: 'get',
            success: json => {
                dispatch({
                    type: 'COPYMETER_DETAIL_GET_LIST', //*** reducer接收数据的唯一标识
                    payload: json.data       //*** 数据发送到reducer
                });
                cb && cb(json);
            }
        });
    },

    copyMeterDetailOperation: (param, cb) => (dispatch, getState) => {

        let type = param[0];
        let newData = param[1];
        let data = getState().daily.copymeterDetailListData;


        switch (type) {
            case 'COPYMETER_SAVE':
                newData = newData.filter((item, i) => {
                    item.thisNum ? delete item.thisNum : null;
                    item.thisDate ? delete item.thisDate : null;
                    return newData;
                });

                data = addData(data, newData, 'newcopymeterDetailList', 'list');
                break;
            case 'COPYMETER_UPDATE':
                data = editData(data, newData, 'newcopymeterDetailList', 'list');
                break;
            case 'COPYMETER_DEL':
                data.newcopymeterDetailList = data.newcopymeterDetailList.filter((item, i) => {
                    return item.id != newData.id;
                });
                data.list = data.list.filter((item, i) => {
                    return item.id != newData.id;
                });

                break;
        }
        dispatch(actions.actionCreator('COPYMETER_DETAIL_GET_LIST', data));
    },

    copyMeterSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/daliy/saveCopyMeter',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    copyMeterUpdate: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/daliy/updateCopyMeter',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    deleteCopyMeterDetail: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/daliy/deleteCopyMeterDetail',
            data: param,
            type: 'get',
            success: json => {
                cb && cb(json);
            }
        });
    },

    findMeters: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/daliy/findMeters',
            data: param,
            type: 'post',
            success: json => {
                dispatch({
                    type: 'METER_GET_LIST', //*** reducer接收数据的唯一标识
                    payload: json.data       //*** 数据发送到reducer
                });
                cb && cb(json);
            }
        });
    },

    copyMeterUpdateStatus: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/daliy/updateCopyMeterStatus',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
};

export default actions;