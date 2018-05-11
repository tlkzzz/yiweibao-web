/**
 * @Description 设备台账
 */
import { _fetch } from '../tools/';

let actions = {
  //actionCreator
     actionCreator: (type, state) => ({
         type: type,
         payload: state
     }),
     //主页面批量删除
     delAsset: (param, cb) => (dispatch, getState) => {
         _fetch({
             url: '/asset/delAsset',
             data: param,
             type: 'get',
             success: json => {
                 cb && cb(json);
             }
         });
     },

    //查询公司下面所有站点 select选择器
        getCompanyServicePoints: (param, cb) => (dispatch, getState) => {
           _fetch({
               url: '/servicePoints/getCompanyServicePoints',
               data: param,
               type: 'get',
               success: json => {
                   cb && cb(json);
               }
           });
       },
 //查询站点下面所有分类 select选择器
        getCompanyAsset: (param, cb) => (dispatch, getState) => {
           _fetch({
               url: '/asset/getCompanyAsset',
               data: param,
               type: 'get',
               success: json => {
                   cb && cb(json);
               }
           });
       },


     //获取设备列表
     statusList: (param, cb) => (dispatch, getState) => {
         _fetch({
             url: '/asset/getAsset',
             data: param,
             type: 'get',
             success: json => {
                 // dispatch(actions.actionCreator("STATUS_LIST", json.data));
                 cb && cb(json);
             }
         });
     },
      //新增设备
     saveAsset: (param, cb) => (dispatch, getState) => {
         _fetch({
             url: '/asset/saveAsset',
             data: param,
             type: 'get',
             success: json => {
                 // dispatch(actions.actionCreator("STATUS_LIST", json.data));
                 cb && cb(json);
             }
         });
     },
     //新增设备分类
      saveAssetType: (param, cb) => (dispatch, getState) => {
         _fetch({
             url: '/asset/saveAssetType',
             data: param,
             type: 'get',
             success: json => {
                 // dispatch(actions.actionCreator("STATUS_LIST", json.data));
                 cb && cb(json);
             }
         });
     },
     // 变更状态
     assetStatusChange: (param, cb) => (dispatch, getState) => {
         _fetch({
             url: '/ams/open/assets/updateStatus',
             data: param,
             type: 'get',
             success: json => {
                 dispatch(actions.actionCreator("ASSET_GET_LIST", json.data));
                 cb && cb(json);
             }
         });
     },

  //获取设备分类列表
    getAssetType: (param, cb) => (dispatch, getState) => {
        // dispatch(actions.actionCreator("LOCATIONS_GET_LIST", []));
        _fetch({
            url: '/asset/getAssetType',
            data: param,
            type: 'get',
            success: json => {
                // dispatch(actions.actionCreator("LOCATIONS_GET_LIST", json.data));
                cb && cb(json);
            }
        });
    },
    //关联设备设施
    assetGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("ASSET_GET_LIST", []));
        _fetch({
            url: '/ams/open/assets/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("ASSET_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //子位置列表
    subGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/locations/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("SUB_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //根据locationId查询维保记录
    locationMaintenanceGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("LOCATION_MAINTENANCE_GET_LIST", []));
            _fetch({
                url: '/workorder/findPageWorkOrderByAssetId',
                data: param,
                type: 'post',
                success: json => {
                    dispatch(actions.actionCreator("LOCATION_MAINTENANCE_GET_LIST", json.data));
                    cb && cb();
            }
        });
    },
    //位置体系主页面删除 //位置体系删除
    delAssetType: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/asset/delAssetType',
            data: param,
            type: 'get',
            success: json => {
                cb && cb(json);
            }
        });
    },

    //位置体系基本信息页面---location_1
    locationDetailGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("LOCATION_DETAIL_GET_LIST", []));
        _fetch({
            url: '/ams/open/locations/findById',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("LOCATION_DETAIL_GET_LIST", json.data));
                cb && cb();
            }
        });
    },

    //位置体系增加
    locationDetailAdd: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/locations/add',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },

    //位置体系修改
    locationDetailUpdate: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/locations/update',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("LOCATIONS_GET_LIST", json.data));
                cb && cb(json);
            }
        });
    },

	
    

    getFormValues: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('GET_FORM_VALUES', state));
    },

    //设备设施详情页面---tab_1设备设施信息的接口
    informationGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("INFORMATION_GET_LIST", []));
        _fetch({
            url: '/ams/open/assets/findById',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("INFORMATION_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //新建时自动生成编码
    codeGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/getCodegenerator',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator('CODE_GET_LIST', json.data));
                cb && cb();
            }
        });
    },

    informationEntity: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/assets/findById',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("METER_NETITY", json.data));
                cb && cb();
            }
        });
    },
    informationAdd: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/assets/add',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("INFORMATION_GET_LIST", json.data));
                cb && cb(json);
            }
        });
    },
    informationUpdate: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/assets/update',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("INFORMATION_GET_LIST", json.data));
                cb && cb(json);
            }
        });
    },

    //设备设施详情页面---tab_2设备设施结构的接口
    structureGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("STRUCTURE_GET_LIST", []));
        _fetch({
            url: '/ams/open/assets/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("STRUCTURE_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //备件物料信息展示接口
    materialsByIdGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("MATERIALS_BYID_GET_LIST", []));
        _fetch({
            url: '/item/findItemByAssertId',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("MATERIALS_BYID_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //选择备件信息接口
    materialsGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("MATERIALS_GET_LIST", []));
        _fetch({
            url: '/item/findItems',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("MATERIALS_GET_LIST", json.data));
                cb && cb();
            }
        });
    },

    //tab_3 技术参数
    technologyGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("TECHNOLOGY_GET_LIST", []));
        _fetch({
            url: '/ams/open/assetattributes/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("TECHNOLOGY_GET_LIST", json.data));
                cb && cb();
            }
        });
    },

    //删除技术参数
    technologyDel: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/assetattributes/delete',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("TECHNOLOGY_GET_LIST", json.data));
                cb && cb(json);
            }
        });
    },
    //新建技术参数
    technologyAdd: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/assetattributes/add',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("TECHNOLOGY_GET_LIST", json.data));
                cb && cb(json);
            }
        });
    },
    //---tab_4作业标准的接口
    worksGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("WORKS_GET_LIST", []));
        _fetch({
            url: '/jobStandard/findJobStandardById',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("WORKS_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //---tab_5保养计划的接口
    maintenanceGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("MAINTENANCE_GET_LIST", []));
        _fetch({
            url: '/maintenancePlan/findPageMaintenancePlanByAssetId',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("MAINTENANCE_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //---tab_6关联测点的接口
    meterGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("METER_LIST", []));
        _fetch({
            url: '/ams/open/meters/findByAssetId',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("METER_LIST", json.data));
                cb && cb(json.data);
            }
        });
    },
    //新建关联测点
    meterAdd: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/meters/add',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("METER_LIST", json.data));
                cb && cb(json);
            }
        });
    },
    //获取测量点数据
    pointGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("POINT_GET_LIST", []));
        _fetch({
            url: '/ams/open/meters/findHistoryData',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("POINT_GET_LIST", json.data));
                cb && cb();
            }
        });
    },

    //删除关联测点
    metersDel: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/meters/delete',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("METER_LIST", json.data));
                cb && cb(json);
            }
        });
    },
    //新建关联测点
    metersAdd: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/meters/add',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("METERS_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //---tab_7维保记录的接口
    recordsGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("RECORDS_GET_LIST", []));
        _fetch({
            url: '/workorder/findPageWorkOrderByAssetId',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("RECORDS_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //---tab_8图纸资料的接口
    drawGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("DRAW_GET_LIST", []));
        _fetch({
            url: 'dss/fileinfos/findByQuoteTypeAndQuoteId',
            data: param,
            success: json => {
                dispatch(actions.actionCreator("DRAW_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //删除关联测点
    drawDel: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/dss/fileinfos/delete',
            data: param,
            success: json => {
                dispatch(actions.actionCreator("DRAW_GET_LIST", json.data));
                cb && cb(json);
            }
        });
    },
    //仪表台账接口 meter
    meterLedgerGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("METER_LEDGER_GET_LIST", []));
        _fetch({
            url: '/ams/open/assets/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("METER_LEDGER_GET_LIST", json.data));
                cb && cb();
            }
        });
    },

    // 能源管理 获取列表
    energyPriceGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/energyPrice/getEnergyPriceList',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("ENERGYPRICE_GET_LIST", json.data));
                cb && cb();
            }
        });
    },

    // 能源管理 删除
    energyPriceDel: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/energyPrice/deleteEnergyPrice',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },

    // 能源管理 新建
    energyPriceCreate: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/energyPrice/saveEnergyPrice',
            data: param,
            type: 'post',
            success: json => {
                cb && cb();
            }
        });
    },

    // 能源管理 修改
    energyPriceUpdate: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/energyPrice/updateEnergyPrice',
            data: param,
            type: 'post',
            success: json => {
                cb && cb();
            }
        });
    },

};

export default actions;
