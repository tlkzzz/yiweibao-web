/**
 *  公用组件actions 
 */
import { _fetch } from '../tools/';

let actions = {
    //actionCreator
    curDate: null,
    actionCreator: (type, state) => ({
        type: type,
        payload: state
    }),
    // 切换语言
    changeLang: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('CHANGE_LANG', state));
    },
    signOut: (cb) => (dispatch, getState) => {
        fetch(`${__DEV__ ? '/signin' : ''}/uaa/leave`,{
            headers: {
                'Authorization':'Bearer '+localStorage.getItem('token'),
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        })
        .then(
            response => {
                cb(response)
            }
        )
    },
    changeAccount: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/uas/open/personandusers/update',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    // 更改密码
    changePassword: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/uas/open/personandusers/updatePassword',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },

    // 设置orgId、siteId
    setIds: (data) => (dispatch, getState) => {
        if (Array.isArray(data)) {
            dispatch(actions.actionCreator('SITE_ID', data[0].id));
            dispatch(actions.actionCreator('SITE_NAME', data[0].name));
            dispatch(actions.actionCreator('ORG_ID', data[1].id));
            dispatch(actions.actionCreator('ORG_NAME', data[1].name));
        } else {
            dispatch(actions.actionCreator('LOGIN_NAME', data.loginName));
            dispatch(actions.actionCreator('PERSON_ID', data.personId));
            dispatch(actions.actionCreator('PERSON_NAME', data.name));
            dispatch(actions.actionCreator('PERSON_MOBILE', data.mobile));
            dispatch(actions.actionCreator('ORG_ID', data.defaultOrg));
            dispatch(actions.actionCreator('ORG_NAME', data.defaultOrgName));
            dispatch(actions.actionCreator('SITE_ID', data.defaultSite));
            dispatch(actions.actionCreator('SITE_NAME', data.defaultSiteName));
            dispatch(actions.actionCreator('SITE_LIST', data.sites));
            dispatch(actions.actionCreator('ORG_LIST', data.orgs));
            dispatch(actions.actionCreator('PRODUCT_ARRAY', data.products));
            dispatch(actions.actionCreator('PRODUCT_LIST', data.productsList));
            dispatch(actions.actionCreator('USER_ID', data.userId));
            dispatch(actions.actionCreator('EMAIL', data.email));
            dispatch(actions.actionCreator('POSITION', data.position));
        }
    },
    getInfo: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/uas/open/personandusers/getInfo',
            data: param,
            success: json => {
                cb && cb(json);
            }
        });
    },
    // 设为默认站点
    setAsDefaultSite: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/uas/open/personandusers/updateMainOrgAndSite',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json)
            }
        });
    },
    getSelectPublicList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: param.url,
            data: param.data,
            type: param.type,
            success: json => {
                dispatch(actions.actionCreator(param.actionsType, json.data));
                cb && cb();
            }
        });
    },
    // 选择人员
    personGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/uas/open/personandusers/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator('PERSON_GET_LIST', json.data));
                cb && cb();
            }
        });
    },

    // 设备设施体系 树
    classifiGetTree: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("CLASSIFI_GET_TREE", []));
        _fetch({
            url: '/ams/open/classifications/findTree',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("CLASSIFI_GET_TREE", json.data));
                cb && cb();
            }
        });
    },
    //位置 树
    locationsGetTree: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("LOCATIONS_GET_TREE", []));
        _fetch({
            url: '/ams/open/locations/findTree',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("LOCATIONS_GET_TREE", json.data));
                cb && cb();
            }
        });
    },
    /**
     * 位置 树-级联展示查询
     * @param param
     * @param actionsType
     * @param getChildren 获取子类数据，用于从树结构获取分区数据，
     * @param cb
     */
    locationsGetTreeList: (param, actionsType,getChildren, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/locations/findTree',
            data: param,
            type: 'post',
            success: json => {
                let data=json.data;
                if(getChildren){
                    if(data){
                        data=data[0].children;
                    }
                }
                dispatch(actions.actionCreator(actionsType, data));
                cb && cb(json.data);
            }
        });
    },
    //位置 级联展示查询
    locationsGetfindPage: (param, actionsType, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/locations/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator(actionsType, json.data?json.data.list:[]));
                cb && cb(json.data);
            }
        });
    },
    //设备列表
    assetsGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/assets/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("ASSETS_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //位置列表
    locationsGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/locations/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("LOCATIONS_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //分类列表
    classifiGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/ams/open/classifications/findPage',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("CLASSIFI_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    //自动生成编码  参数：modelKey (模块编码)
    codeGenerator:(param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/getCodegenerator',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("CODE_ENTITY", json.data));
                cb && cb(json);
            }
        });
    },
    // 获取域值
    getDomainValue: (param, domainNum, actionsType,cb) => (dispatch, getState) => { //获取域值
        _fetch({
            url: '/ams/open/fields/findDomainValueByDomainNumAndSiteIdAndProId',
            data: {
                ...param,
                domainNum
            },
            type: 'GET',
            success: json => {
                dispatch(actions.actionCreator(actionsType, json.data));
                cb && cb(json);
            }
        });
    },

    // 查询级联域值
    findDomainValueValue: (param, domainNum, actionsType,cb) => (dispatch, getState) => { //获取域值
        _fetch({
            url: '/task/findDomainValueValue',
            data: {
                ...param,
                domainNum
            },
            type: 'GET',
            success: json => {
                dispatch(actions.actionCreator(actionsType, json.data));
                cb && cb(json);
            }
        });
    },


    // 作业标准列表
    jobPlanGetList: (param, cb) => (dispatch, getState) => {
        dispatch(actions.actionCreator("JOB_PLAN_GET_LIST", []));
        _fetch({
            url: '/jobStandard/findPageJobStandardList',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator("JOB_PLAN_GET_LIST", json.data));
                cb && cb();
            }
        });
    },
    // 图片上传
    getOssType: (cb) => (dispatch, getState) => {
        _fetch({
                url: '/dss/upload/type',
                type: 'post',
                success: json => {
                cb && cb(json);
            }
        });
    },
    getOssInfo: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/dss/oss/policy',
            data: param,
            success: json => {
                cb && cb(json);
            }
        });
    },
    getFilesList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/dss/fileinfos/findByQuoteTypeAndQuoteId',
            data: param,
            success: json => {
                cb && cb(json);
            }
        });
    },
    saveFiles: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/dss/fileinfos/save',
            data: param,
            type: 'post',
            success: json => {
                cb && cb(json);
            }
        });
    },
    delFile: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/dss/fileinfos/delete',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                cb && cb(json);
            }
        });
    },


    // 获取流程执行记录
    getProcessExecutionRecord: (param,cb) => (dispatch, getState) => {
        _fetch({
            url: '/workFlow/findRecordByProcessInstanceId',
            type: 'GET',
            data: param,
            success: json => {
                const executionRecord = json.data;
                let data = {};
                data.dateArr = actions._recordDateArr(executionRecord);
                data.executionRecord = executionRecord;
                dispatch(actions.actionCreator("PROCESS_EXECUTION_RECORD", data));
                cb && cb(data);
            }
        });
    },
    updateProcessExecutionRecord: (param,cb) => (dispatch, getState) => {
        if(!param){
            param={}
            param.dateArr = [];
            param.executionRecord = [];
        }
        console.info(param)
        dispatch(actions.actionCreator("PROCESS_EXECUTION_RECORD", param));
    },

    // 处理执行记录日期
    _recordDateArr: (data) => {

        if (!data) data = [];

        const dateArr = data.map(item => {
            let date = item.endTime ? item.endTime.substr(0,10) : '-';

            if (date !== actions.curDate) {
                actions.curDate = date;
                return date;
            } else {
                return false;
            }
        });
        actions.curDate = null;

        return dateArr;
    },

    //自动生成编码  参数：modelKey (模块编码)(可适用于单页面多编码情况)
    codeGenerators:(param, actionsType) => (dispatch, getState) => {
        _fetch({
            url: '/getCodegenerator',
            data: param,
            type: 'get',
            success: json => {
                cb && cb(json);
                dispatch(actions.actionCreator(actionsType, json.data));
            }
        });
    },
    //根据域值value或者域获取人员
    getUserBydomainValue:(param, actionsType,cb) => (dispatch, getState) => {
        _fetch({
            url: '/userGroupDomain/findUserByDomainValueORDomainNum',
            data: param,
            type: 'get',
            success: json => {
                cb && cb(json);
                dispatch(actions.actionCreator("GET_PERSON_BY_DOMAIN", json.data));
            }
        });
    },
}

export default actions;
