/** 
 * @Description 我的任务
 */
import {_fetch, addData, delData} from '../tools/';

let actions = {
    //actionCreator
    actionCreator: (type, state) => ({
        type: type,
        payload: state
    }),

    //-----------------------------------settings--------------------------//
    //获取表单值
    getFormValues: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('GET_FORM_VALUES', state));
    },
    //*** 请求域管理分页列表 方法内只做数据处理 严禁写任何业务逻辑
    domainGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/fields/findDomainByPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator('DOMAIN_GET_LIST', json.data));
                cb && cb();
            }
        });
    },
    domainDel: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/fields/deleteDomainValue',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                // dispatch({
                //     type: 'DOMAIN_DEL', //*** reducer接收数据的唯一标识
                //     payload: json.data       //*** 数据发送到reducer
                // });
                cb && cb(json.success);
            }
        });
    },
	//IP管理
    ipGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ip/getIPList',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator('IP_GET_LIST', json.data));
                cb && cb();
            }
        });
    },
    ipSave: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ip/saveIP',
            data: param,
            type: 'post',
            // formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    ipUpdate: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ip/updateIP',
            data: param,
            type: 'post',
            // formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    ipDelete: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ip/deleteIP',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },
    ipFindOne: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ip/findIPDetail',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator('IP_FIND_ONE', json.data));
                cb && cb();
            }
        });
    },
  //二维码管理
    qrCodeGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/qrCode/findPageQRCodeManager',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator('QR_CODE_GET_LIST', json.data));
                cb && cb();
            }
        });
    },
     updateList: (param, cb) => (dispatch, getState) => {

         if (Array.isArray(param)) {

             let type = param[0],
                 newData = param[1], // 新增时值为对象，删除时值为id
                 data = getState().system.codeByIdListData;

             switch (type) {
                 case 'PROPERTY_ADD': // 新建属性
                     newData[0].sequence = data.qrcodeApplicationPropertyVoList ? data.qrcodeApplicationPropertyVoList.length + 1 : 1;
                     data = addData(data, newData, 'newPropertyList', 'qrcodeApplicationPropertyVoList');
                     break;
                 case 'PROPERTY_DEL': // 删除属性
                     data = delData(data, newData, 'newPropertyList', 'qrcodeApplicationPropertyVoList', 'materialDelOriginalDataId');
                     break;
             }
             dispatch(actions.actionCreator('CODE_BYID_GET_LIST', data));

         } else {
             _fetch({
                 url: '/qrCode/findQRCodeManagerByID',
                 data: param,
                 type: 'get',
                 success: json => {
                     const data = json.data;
                     dispatch(actions.actionCreator('CODE_BYID_GET_LIST', data));
                     cb && cb();
                 }
             });
         }
     },
    //保存二维码管理
     qrCodeSave: (param, cb) => (dispatch, getState) => {
         _fetch({
             url: '/qrCode/saveQRCodeManager',
             data: param,
             type: 'post',
             success: json => {
                 dispatch(actions.actionCreator('QR_CODE_GET_LIST', json.data));
                 cb && cb(json);
             }
         });
     },
     //根据Id删除二维码管理
     qrCodeDel: (param, cb) => (dispatch, getState) => {
         _fetch({
             url: '/qrCode/deleteQRCodeManagerList',
             data: param,
             type: 'get',
             success: json => {
                 dispatch(actions.actionCreator('QR_CODE_GET_LIST', json.data));
                 cb && cb(json);
               }
          });
     },
    //查看二维码所有应用程序的属性列表
    allPropertyGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/qrCode/findAllApplicationAllPropertyNotIn',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator('ALL_PROPERTY_GET_LIST', json.data));
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

 //二维码编码列表
   getGrcode: (param, cb) => (dispatch, getState) => {
       _fetch({
           url: '/qrcode/getGrcode',
           data: param,
           type: 'get',
           success: json => {
               cb && cb(json);
           }
       });
   },
//二维码编码删除
   delQrcode: (param, cb) => (dispatch, getState) => {
       _fetch({
           url: '/qrcode/delQrcode',
           data: param,
           type: 'get',
           success: json => {
               cb && cb(json);
           }
       });
   },
   //查询公司信息
    getCompany: (param, cb) => (dispatch, getState) => {
// console.log('--------------')
//         console.log(dispatch)
//         console.log(getState)
       _fetch({
           url: '/company/getCompany',
           data: param,
           type: 'get',
           success: json => {
               cb && cb(json);
           }
       });
   },
   //修改保存公司信息
    editCompany: (param, cb) => (dispatch, getState) => {
       _fetch({
           url: '/company/editCompany',
           data: param,
           type: 'post',
           success: json => {
               cb && cb(json);
           }
       });
   },

   //员工列表分页
    getEmployee: (param, cb) => (dispatch, getState) => {
       _fetch({
           url: '/employee/getEmployee',
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
    addEmployee: (param, cb) => (dispatch, getState) => {
       _fetch({
           url: '/employee/addEmployee',
           data: param,
           type: 'post',
           success: json => {
               cb && cb(json);
           }
       });
   },


     delEmployee: (param, cb) => (dispatch, getState) => {
           _fetch({
               url: '/employee/delEmployee',
               data: param,
               type: 'get',
               success: json => {
                   cb && cb(json);
               }
           });
       },
//客户列表分页
    getCustomer: (param, cb) => (dispatch, getState) => {
       _fetch({
           url: '/customer/getCustomer',
           data: param,
           type: 'get',
           success: json => {
               cb && cb(json);
           }
       });
   },  //删除客户
     delCustomer: (param, cb) => (dispatch, getState) => {
           _fetch({
               url: '/customer/delCustomer',
               data: param,
               type: 'get',
               success: json => {
                   cb && cb(json);
               }
           });
       },
//故障列表分页
    getItem: (param, cb) => (dispatch, getState) => {
       _fetch({
           url: '/item/getItem',
           data: param,
           type: 'get',
           success: json => {
               cb && cb(json);
           }
       });
   },  //删除故障
     delItem: (param, cb) => (dispatch, getState) => {
           _fetch({
               url: '/item/delItem',
               data: param,
               type: 'get',
               success: json => {
                   cb && cb(json);
               }
           });
       },
//品牌列表分页
    getBrand: (param, cb) => (dispatch, getState) => {
       _fetch({
           url: '/brand/getBrand',
           data: param,
           type: 'get',
           success: json => {
               cb && cb(json);
           }
       });
   },  //删除品牌
     delBrand: (param, cb) => (dispatch, getState) => {
           _fetch({
               url: '/brand/delBrand',
               data: param,
               type: 'get',
               success: json => {
                   cb && cb(json);
               }
           });
       },
//售后套餐分页
    getServiceFees: (param, cb) => (dispatch, getState) => {
       _fetch({
           url: '/serviceFees/getServiceFees',
           data: param,
           type: 'get',
           success: json => {
               cb && cb(json);
           }
       });
   },  //删除售后套餐
     delServiceFees: (param, cb) => (dispatch, getState) => {
           _fetch({
               url: '/serviceFees/delServiceFees',
               data: param,
               type: 'get',
               success: json => {
                   cb && cb(json);
               }
           });
       },


       //商品列表
        getProduct: (param, cb) => (dispatch, getState) => {
           _fetch({
               url: '/product/getProduct',
               data: param,
               type: 'get',
               success: json => {
                   cb && cb(json);
               }
           });
       },
        //商品删除
        delProduct: (param, cb) => (dispatch, getState) => {
           _fetch({
               url: '/product/delProduct',
               data: param,
               type: 'get',
               success: json => {
                   cb && cb(json);
               }
           });
       },
        //商品上架下架
        downProduct: (param, cb) => (dispatch, getState) => {
           _fetch({
               url: '/product/downProduct',
               data: param,
               type: 'get',
               success: json => {
                   cb && cb(json);
               }
           });
       },
        //项目列表
        getServicePoints: (param, cb) => (dispatch, getState) => {
           _fetch({
               url: '/servicePoints/getServicePoints',
               data: param,
               type: 'get',
               success: json => {
                   cb && cb(json);
               }
           });
       },
        //项目删除
        delServicePoints: (param, cb) => (dispatch, getState) => {
           _fetch({
               url: '/servicePoints/delServicePoints',
               data: param,
               type: 'get',
               success: json => {
                   cb && cb(json);
               }
           });
       },
    //-----------------------------------mytask--------------------------//
    //待办的全部
    myTaskBacklogGetAllList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageTaskToDoList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("BACKLOG_ALL_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
	//待办logo number
    myTaskLogoNumToDo: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findTaskToDoListTotalGroupByOrderType',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("TASK_LOGO_NUM_TODO", json.data));
                cb && cb();
            }
        });
    },
    //经办logo number
    myTaskLogoNumDone: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findTaskDoneCountGroupByOrderType',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("TASK_LOGO_NUM_DONE", json.data));
                cb && cb();
            }
        });
    },
    //经办的全部
    myTaskHandleGetAllList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageTaskDoneList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("HANDLE_ALL_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //待办任务数量
    

    //----------------维保工单---------------------
    //待办的维保工单
    myTaskBacklogGetMaintenanceList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageWorkOrderTaskToDoList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("BACKLOG_MAINTENANCE_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //经办的维保工单
    myTaskHandleGetMaintenanceList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageWorkOrderTaskDoneList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("HANDLE_MAINTENANCE_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //------------------------报修工单-------------------------------
    //待办的报修工单
    myTaskBacklogGetRepairList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageRepairOrderTaskToDoList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("BACKLOG_REPAIR_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //经办的报修工单
    myTaskHandleGetRepairList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageRepairOrderTaskDoneList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("HANDLE_REPAIR_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
     //------------------------派工工单-----------------------------
    //待办的派工工单
    myTaskBacklogGetDispatchList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageDispatchOrderTaskToDoList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("BACKLOG_DISPATCH_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //经办的派工工单
    myTaskHandleGetDispatchList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageDispatchOrderTaskDoneList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("HANDLE_DISPATCH_GET_LIST", json.data));
                cb && cb();
            }
        });
    },

    //------------------------  巡检-------------------------------
     //待办的巡检工单
    myTaskBacklogGetPatrolList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPagePatrolOrderTaskToDoList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("BACKLOG_PATROL_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //经办的巡检工单
    myTaskHandleGetPatrolList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPagePatrolOrderTaskDoneList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("HANDLE_PATROL_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //----------------------参数查询数据----------------------------------------
    //待办
    myTaskFindPageTaskToDoList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageTaskToDoList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("MY_TASK_TODO", json.data));
                cb && cb();
            }
        });
    },
    //经办
    myTaskFindPageTaskDoneList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findPageTaskDoneList',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("MY_TASK_DONE", json.data));
                cb && cb();
            }
        });
    },
    //---------------------徽标数-------------------------
    //经办
    myTaskFindLogoDone: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findTaskDoneCountGroupByOrderType',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("MY_TASK_DONE_LOGO", json.data));
                cb && cb();
            }
        });
    },
    //待办
    myTaskFindLogoToDo: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/task/findTaskToDoListTotalGroupByOrderType',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("MY_TASK_DONE_LOGO", json.data));
                cb && cb();
            }
        });
    },
    //获取模糊查询关键字
    myTaskGetKeyword: (param, cb) => (dispatch, getState) => {
        console.log("----myTaskGetKeyword-----------",getState);
        dispatch(actions.actionCreator("HANDLE_GET_KEYWORD", param));
        cb && cb();
    },


    // dashboard 总部
    // 本月数据统计
    getDataStatistics: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/dashboardOrg/findMaxCountOrder',
            data: param,
            success: json => {
                dispatch(actions.actionCreator('DATA_STATISTICS', json.data));
            }
        });
    },
    getOrgPieData: (param, cb) => (dispatch, getState) => {
       /*暂时做静态 _fetch({
            url: '/dashboardOrg/findCountOrderTotal',
            data: param,
            success: json => {
                // dispatch(actions.actionCreator('DATA_STATISTICS', json.data));
            }
        });*/
    },

    // dashboard 项目
    // 历史今日
    historyToday: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/dashboardSite/findCountAndRingratio',
            data: param,
            success: json => {
                dispatch(actions.actionCreator('HISTORY_TODAY', json.data));
            }
        });
    },
    // 待办任务统计
    todoStatistics: (param, cb) => (dispatch, getState) => {
        // _fetch({
        //     url: '/task/findTaskToDoListTotalGroupByOrderType',
        //     data: param,
        //     success: json => {
        //         // dispatch(actions.actionCreator('TODO_STATISTICS', json.data));
        //     }
        // });
    },

    
}

export default actions;