/** 
 * @Description 物资管理
 */
import {_fetch, addData, editData, delData} from '../tools/';

let actions = {

    actionCreator: (type, state) => ({
        type: type,
        payload: state
    }),
    // *** 请求域管理分页列表 方法内只做数据处理 严禁写任何业务逻辑

    getFormValues: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('GET_FORM_VALUES', state));
    },
    //物资台账
    itemGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/item/findItems',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("ITEM_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    itemNotInReleaseList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/item/findItemsNotInResevies',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("ITEM_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    itemSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/item/saveItem',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    itemUpdate: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/item/updateItem',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },

    deleteItem: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/item/deleteItem',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },

    findItemById: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/item/findItemById',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("ITEM", json.data));
                cb && cb();
            }
        });
    },

    //物资库存
    // ***任务分派***


    inventoryGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/invtentory/findInventorys',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("INVENTORY_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    inventorySave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/inventory/saveInventory',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    inventoryUpdate: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/inventory/updateInventory',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    deleteInventory: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/inventory/deleteInventory',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    findInventorysByItemId: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/inventory/findInventorysByItemId',
            data: param,
            type: 'get',
            formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator("INVENTORY_GET_LIST_BY_ITEM_ID", json.data));
                cb && cb();
            }
        });
    },
    findInventoryDetailById: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/inventory/findInventoryDetailById',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator("INVENTORY", json.data));
                cb && cb();
            }
        });
    },
    findInventorysByStoreroomId: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/inventory/findInventorysByStoreroomId',
            data: param,
            type: 'get',
            formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator("INVENTORY_BY_STOREROOM", json.data));
                cb && cb();
            }
        });
    },
    findInventorysNotInItemNum: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/inventory/findInventorysNotInItemNum ',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator("INVENTORY_GET_LIST", json.data));
                cb && cb();
            }
        });
    },


    //库房管理
    storeroomGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/storeroom/findStoreRooms',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("STOREROOM_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    deleteStoreroom: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/storeroom/deleteStoreRoom',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    findStoreRoomById: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/storeroom/findStoreRoomById',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("STOREROOM_ENTITY", json.data));
                cb && cb();
            }
        });
    },
    storeroomSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/storeroom/saveStoreRoom',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    storeroomUpdate: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/storeroom/updateStoreRoom',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },

    findUsableStoreRoom: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/storeroom/findUsableStoreRoom',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("STOREROOM_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
// 物资接收

    receiveGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/goodsreceive/findGoodsReceives',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("GOODSRECEIVES_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    deleteReceive: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/goodsreceive/deleteGoodsReceive',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    receiveSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/goodsreceive/saveGoodsReceive',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    receiveUpdate: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/goodsreceive/updateGoodsReceive',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },

    findGoodsreceiveById: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/goodsreceive/findGoodsreceiveById',
            data: param,
            type: 'get',
            formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator("GOODSRECEIVES_ENTITY", json.data));
                cb && cb();
            }
        });
    },
    findGoodsReceiveDetailByGoodsReceiveId: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/goodsreceive/findGoodsReceiveDetailByGoodsReceiveId',
            data: param,
            type: 'get',
            formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator("GOODSRECEIVEDETAIL_LIST", json.data));
                cb && cb();
            }
        });
    },

    receiveDetailOperation: (param, cb) => (dispatch, getState) => {

        let type = param[0];
        let newData = param[1];
        let data = getState().material.receiveDetailListData;


        switch (type) {
            case 'RECEIVE_SAVE':
                newData = newData.filter((item, i) => {
                    item.receiveQuantity ? delete item.receiveQuantity : null;
                    item.unitCost ? delete item.unitCost : null;
                    item.lineCost ? delete item.lineCost : null;
                    return newData;
                });

                data = addData(data, newData, 'newReceiveDetailList', 'list');
                break;
            case 'RECEIVE_UPDATE':
                data = editData(data, newData, 'newReceiveDetailList', 'list');
                break;
            case 'RECEIVE_DEL':
                data.newReceiveDetailList = data.newReceiveDetailList.filter((item, i) => {
                    return item.id != newData.id;
                });
                data.list = data.list.filter((item, i) => {
                    return item.id != newData.id;
                });

                break;
        }
        dispatch(actions.actionCreator('GOODSRECEIVEDETAIL_LIST', data));


    },
    deleteReceiveDetail: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/goodsreceive/deleteGoodsReceiveDetail',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    updateGoodsReceiveDetail: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/goodsreceive/updateGoodsReceiveDetail',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },

    //物资发放
    releaseGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/release/findMaterialRelease',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("RELEASE_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    deleteRelease: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/release/deleteMaterialRelease',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    deleteReleaseDetail: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/release/deleteMaterialReleaseDetail',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    releaseDetailOperation: (param, cb) => (dispatch, getState) => {

        let type = param[0];
        let newData = param[1];
        let data = getState().material.releasedetailListData;

        switch (type) {
            case 'RELEASE_SAVE':
                newData = newData.filter((item, i) => {
                    item.lineCost ? delete item.lineCost : null;
                    item.quantity ? delete item.quantity : null;
                    return newData;
                });
                data = addData(data, newData, 'newReleaseDetailList', 'list');
                break;
            case 'RELEASE_UPDATE':
                data = editData(data, newData, 'newReleaseDetailList', 'list');
                break;
            case 'RELEASE_DEL':
                data.newReleaseDetailList = data.newReleaseDetailList.filter((item, i) => {
                    return item.id != newData.id;
                });
                data.list = data.list.filter((item, i) => {
                    return item.id != newData.id;
                });
                break;
        }
        dispatch(actions.actionCreator('RELEASEDETAIL_LIST', data));
    },
    releaseSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/release/saveMaterialRelease',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    releaseUpdate: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/release/saveMaterialRelease',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    findMaterialReleaseById: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/release/findMaterialReleaseById',
            data: param,
            type: 'get',
            formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator("RELEASE_ENTITY", json.data));
                cb && cb();
            }
        });
    },
    findMaterialReleaseDetail: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/release/findMaterialReleaseDetail',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("RELEASEDETAIL_LIST", json.data));
                cb && cb();
            }
        });
    },

    updateReleaseDetail: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/release/updateMaterialReleaseDetail',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    //库存盘点
    checkGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/check/findMaterialChecks',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("CHECK_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    deleteCheck: (param, cb) => (dispatch, getState) => {
        // console.info("执行删除");
        _fetch({
            url: '/check/deleteMaterialCheck',
            data: param,
            type: 'get',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },

    findMaterialCheckByInvtoryId: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/check/findMaterialCheckByInvtoryId',
            data: param,
            type: 'get',
            formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator("CHECK_GET_LIST_BY_INVTORY", json.data));
                cb && cb();
            }
        });
    },

    findMaterialCheckById: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/check/findMaterialCheckById',
            data: param,
            type: 'get',
            formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator("CHECK_ENTITY", json.data));
                cb && cb();
            }
        });
    },

    findMaterialCheckDetail: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/check/findMaterialCheckDetail',
            data: param,
            type: 'get',
            formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator("CHECKDETAIL_LIST", json.data));
                cb && cb();
            }
        });
    },
    //物资盘点保存
    saveMaterialCheck: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/check/saveMaterialCheck',
            data: param,
            type: 'POST',
            //  formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator("CHECK_ENTITY", json.data));
                dispatch(actions.actionCreator("CHECKDETAIL_LIST", json.data));
                //   dispatch(actions.actionCreator("CHECKDETAIL_INFO", json.data));
                cb && cb(json);
            }
        });
    },
    //物资盘点状态更新
    updateMaterialCheckStatus: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/check/updateMaterialCheckStatus',
            data: param,
            type: 'POST',
            //  formDataParam: true,
            success: json => {

                //   dispatch(actions.actionCreator("CHECKDETAIL_INFO", json.data));
                cb && cb(json);
            }
        });
    },
    //物资盘点更新
    updateMaterialCheck: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/check/updateMaterialCheck',
            data: param,
            type: 'POST',
            //  formDataParam: true,
            success: json => {
                dispatch(actions.actionCreator("CHECK_ENTITY", json.data));
                dispatch(actions.actionCreator("CHECKDETAIL_LIST", json.data));
                //   dispatch(actions.actionCreator("CHECKDETAIL_INFO", json.data));
                cb && cb(json);
            }
        });
    },
    //物资盘点详细
    materialCheckDetailOperation: (param, cb) => (dispatch, getState) => {

        let type = param[0];
        let newData = param[1];
        //console.log(newData) ;
        let data = getState().material.checkdetailList;

        switch (type) {
            case 'CHECK_SAVE':
                newData = newData.filter((item, i) => {
                    delete item.physicalInventory;
                    return newData;
                });
                data = addData(data, newData, 'newCheckDetailList', 'list');
                break;
            case 'CHECK_UPDATE':
                data = editData(data, newData, 'newCheckDetailList', 'list');
                break;
            case 'CHECK_DEL':
                data.newCheckDetailList = data.newCheckDetailList.filter((item, i) => {
                    return item.id != newData.id;
                });
                data.list = data.list.filter((item, i) => {
                    return item.id != newData.id;
                });
                break;
        }
        dispatch(actions.actionCreator('CHECKDETAIL_LIST', data));
    },
    findInventorysNotInCheck: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/invtentory/findInventorysNotInCheck',
            data: param,
            //  formDataParam: true,
            type: 'GET',
            success: json => {
                dispatch(actions.actionCreator("INVENTORY_BY_STOREROOMIDANDCHECKID", json.data));
                cb && cb(json);
            }
        });
    },
    //删除物资盘点详细（支持批量）
    deleteMaterialCheckDetail: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/check/deleteMaterialCheckDetail',
            data: param,
            //  formDataParam: true,
            type: 'GET',
            success: json => {
                cb && cb(json);
            }
        });
    },

    getUnit: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/measures/findAll',
            data: param,
            type: 'GET',
            success: json => {
                dispatch(actions.actionCreator("UNIT_LIST", json.data));
                cb && cb(json);
            }
        });
    },
    updateItemStatus: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/item/updateItemStatus',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    updateInventoryStatus: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/inventory/updateInventoryStatus',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },

    updateStoreroomStatus: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/storeroom/changeStroeRoomStatus',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    updateCheckStatus: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/check/updateMaterialCheckStatus',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    updateReceiveStatus: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/goodsreceive/updateGoodsReceiveStatus',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },

    updateRleaseStatus: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/release/updateMaterialReleaseStatus',
            data: param,
            type: 'POST',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
};
export default actions;