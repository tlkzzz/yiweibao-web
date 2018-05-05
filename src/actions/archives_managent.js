/** 
 * @Description
 */
import {_fetch} from '../tools/';

let actions = {
    //actionCreator
    actionCreator: (type, state) => ({
        type: type,
        payload: state
    }),
    // *** 请求域管理分页列表 方法内只做数据处理 严禁写任何业务逻辑
    
        getFormValues: (state) => (dispatch, getState) => {
        dispatch(actions.actionCreator('GET_ARCHIVES_FORM_VALUES', state));
    },
    //档案类型 列表
    archivesTypeGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headArchivesType/getArchivesTypeList',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator('ARCHIVESTYPE_GET_LIST', json.data));
                cb && cb();
            }
        });
    },

    // 档案类型 删除
    archivesTypeDel: (param, cb) => (dispatch, getState) => {
        _fetch({
                url: '/headArchivesType/deleteArchivesType',
                data: param,
                type: 'post',
                formDataParam: true,
                success: json => {
                cb && cb(json);
            }
        });
    },

    // 档案类型 新建
    archivesTypeCreate: (param, cb) => (dispatch, getState) => {
        _fetch({
                url: '/headArchivesType/saveArchivesType',
                data: param,
                type: 'post',
                success: json => {
                cb && cb();
            }
        });
    },

    // 档案类型 修改
    archivesTypeUpdate: (param, cb) => (dispatch, getState) => {
        _fetch({
                url: '/headArchivesType/updateArchivesType',
                data: param,
                type: 'post',
                success: json => {
                cb && cb();
            }
        });
    },




    //档案管理 列表
    archivesGetList: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headArchives/getArchivesList',
            data: param,
            type: 'post',
            success: json => {
                dispatch(actions.actionCreator('ARCHIVES_GET_LIST', json.data));
                cb && cb();
            }
        });
    },

    // 档案管理 删除
    archivesDel: (param, cb) => (dispatch, getState) => {
        _fetch({
                url: '/headArchives/deleteArchives',
                data: param,
                type: 'post',
                formDataParam: true,
                success: json => {
                cb && cb(json);
            }
        });
    },

    // 档案管理 新建
    archivesCreate: (param, cb) => (dispatch, getState) => {
        _fetch({
                url: '/headArchives/saveArchives',
                data: param,
                type: 'post',
                success: json => {
                cb && cb(json);
            }
        });
    },

    // 档案管理 修改
    archivesUpdate: (param, cb) => (dispatch, getState) => {
        _fetch({
                url: '/headArchives/updateArchives',
                data: param,
                type: 'post',
                success: json => {
                cb && cb(json);
            }
        });
    },


    //档案日志 列表
    archivesLogList: (param, cb) => (dispatch, getState) => {
        _fetch({
                url: '/headArchivesLog/getArchivesLogList',
                data: param,
                type: 'post',
                success: json => {
                dispatch(actions.actionCreator('ARCHIVESLOG_GET_LIST', json.data));
        cb && cb();
            }
        });
    },


    findArchivesById: (param, cb) => (dispatch, getState) => {
        _fetch({
                url: '/headArchivesLog/headArchivesLog',
                data: param,
                type: 'get',
                formDataParam: true,
                success: json => {
                dispatch(actions.actionCreator("RELEASE_ENTITY", json.data));
        cb && cb();
            }
        });
    },
    findArchivesDetail: (param, cb) => (dispatch, getState) => {
        _fetch({
                url: '/headArchives/findArchivesDetail',
                data: param,
                type: 'get',
                success: json => {
                dispatch(actions.actionCreator("ARCHIVESDETAIL_LIST", json.data));
        cb && cb();
            }
        });
    },
    
    // 头像上传
    getOssType: (cb) => (dispatch, getState) => {
        //fetch(Host+'/api/dss/upload/type',{
        //    method:'GET',
        //    headers:Headers,
        //})
        //.then(response => response.json())
        //.then(json=>{
        //    cb(json) 
        //})
        _fetch({
                url: '/dss/upload/type',
                type: 'post',
                success: json => {
                cb && cb(json);
            }
        });
    },
    getOssInfo: (cb) => (dispatch, getState) => {
        //fetch(Host+'/api/dss/oss/policy?productId=468039bf36f111e7afa90242ac110005',{
        //    method:'GET',
        //    headers:Headers,
        //})
        //.then(response => response.json())
        //.then(json=>{
        //    cb(json)
        //})
        _fetch({
                url: '/dss/oss/policy?productId=468039bf36f111e7afa90242ac110005',
                success: json => {
                cb && cb(json);
            }
        });
    },
    delAvatar: (param, cb) => (dispatch, getState) => {
        //fetch(Host+'/api/dss/fileinfos/delete',{
        //    method:'GET',
        //    headers:Headers,
        //})
        //.then(response => response.json())
        //.then(json=>{
        //    cb(json);
        //})
        _fetch({
                url: '/dss/fileinfos/delete',
                success: json => {
                cb && cb(json);
            }
        });
        
    },

    saveAvatar: (param, cb) => (dispatch, getState) => {
        //fetch(Host+'/api/dss/fileinfos/save',{
    //    method:'POST',
    //    headers:HeadersPost,
    //    body:JSON.stringify(param)
    //})
    //.then(response => response.json())
    //.then(json=>{
    //    cb(json);
    //})
        _fetch({
                url: '/dss/fileinfos/save',
                type: 'post',
                data: param,
                success: json => {
                cb && cb(json);
            }
        });
    },

    setImgPathList:( state) => (dispatch, getState) => {
         dispatch(actions.actionCreator("IMG_PATH_LIST", state));
    },
    // 显示头像
    showAvatar: (param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/dss/fileinfos/findByQuoteTypeAndQuoteId',
            data: param,
            success: json => {
                let imgPaths=[];
                let data = json.data;
                dispatch(actions.actionCreator("IMG_PATH", data));
                cb && cb(data);

            }
        })
    },


    getArchivesTypeTree:(param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headArchivesType/getArchivesTypeTree',
            data: param,
            type: 'get',
            success: json => {
                dispatch(actions.actionCreator("ARCHIVESDETAIL_TREE", json.data));
                cb && cb();
            }
        });
    },
    updateArchivesType:(param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headArchivesType/updateArchivesType',
            data: param,
            type: 'post',
            success: json => {
                // dispatch(actions.actionCreator("ARCHIVESDETAIL_TREE", json.data));
                cb && cb(json);
            }
        });
    },

    addArchivesType:(param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headArchivesType/saveArchivesType',
            data: param,
            type: 'post',
            success: json => {
                // dispatch(actions.actionCreator("ARCHIVESDETAIL_TREE", json.data));
                cb && cb(json);
            }
        });
    },
    deleteArchivesType:(param, cb) => (dispatch, getState) => {
        _fetch({
            url: '/headArchivesType/deleteArchivesType',
            data: param,
            type: 'post',
            formDataParam: true,
            success: json => {
                // dispatch(actions.actionCreator("ARCHIVESDETAIL_TREE", json.data));
                cb && cb(json);
            }
        });
    },
}

export default actions;