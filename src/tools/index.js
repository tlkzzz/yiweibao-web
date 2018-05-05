import { browserHistory } from 'react-router';
import es6Promise from 'es6-promise';
es6Promise.polyfill();
import 'isomorphic-fetch';

import { message,notification } from 'antd';

/**
 * _fetch
 * 封装fetch
 * 
 *
 * @param     {object} 详见defaultOpts;
 */
let path = 'http://localhost:8080';
const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};

export const _fetch = (options) => {

    let defaultOpts = {
        url: '',                                // api地址
        type: 'GET',                            // 请求类型
        data: {},                               // 参数 所有类型统一传对象类型 {a:1, b:2}
        hasToken: true,                         // 请求头带token
        formDataParam: false,                   // 请求参数是否是formData类型
        useThen: false,                         // 是否是用原生then方法 用then方法 下面的回调全部失效
        filter: function (json) {               // 请求成功后 处理数据之前回调函数
            console.log(json);
            // if ((json + '') === 'Error: 401') {
            //     browserHistory.push('/sign_in');
            //     return true
            // }

            // 返回false表示不拦截成功回调
            return false;
        },
        success: function () {},                // 成功回调函数
        error: function (error) {               // 失败回调函数

        }
    };

    let opts = Object.assign({}, defaultOpts, options);
    let paramStr = '';
    let requestJson = {};


    let purl = opts.url;
 
    // if (opts.hasToken) {
    //     if (opts.hasToken === 'Basic') {
    //         requestJson.headers.Authorization = 'Basic ' + btoa('ecclient' + ':' + 'ecclientsecret');
    //     } else {
    //         requestJson.headers.Authorization = 'Bearer ' + (localStorage.getItem('token') || '');
    //     }
    // }




    if (path) opts.url = path + opts.url;
    opts.type = opts.type.toUpperCase();

    for (let key in opts.data) {
        paramStr += key + '=' + opts.data[key] + '&';
    }
    paramStr = paramStr.slice(0,-1);
    requestJson.headers = {};
    requestJson.headers.Accept = 'application/json, text/plain, */*';
       //设置token
    if(purl=='/login/signin'){
         //登陆方法不设置token
         requestJson.headers.Authorization = '';
    }else{
         requestJson.headers.Authorization = localStorage.getItem('token');
    }

   
    console.log(requestJson);
    //get
    if (opts.type === 'GET') {
        opts.url = opts.url + '?' + paramStr;
        requestJson.method = 'GET';
        requestJson.headers["Content-Type"] = 'application/json;charset=UTF-8;';
    }
    else if (opts.type === 'POST' && opts.formDataParam) {
        requestJson.method = 'POST';
        requestJson.headers["Content-Type"] = 'application/x-www-form-urlencoded;';
        requestJson.body = paramStr;
    }
    else if (opts.type === 'POST') {//post
        requestJson.method = 'POST';
        requestJson.headers["Content-Type"] = 'application/x-www-form-urlencoded;';
        // requestJson.headers["Content-Type"] = 'application/json';//application/json;charset=UTF-8
        // requestJson.body = JSON.stringify(opts.data);
          // requestJson.body = paramStr;
          console.log(paramStr);
           opts.url = opts.url + '?' + paramStr;
    }
    else if (opts.type === 'DELETE') {
        requestJson.method = 'DELETE';
        requestJson.headers["Content-Type"] = 'application/json';
        requestJson.body = JSON.stringify(opts.data);
    }
    else {
        throw ('Options type is "POST" or "GET" ?')
    }
    //设置跨域请求
    requestJson.credentials = 'include';
    requestJson.mode = "cors";

    //发送请求
    let __fetch__ = fetch(opts.url, requestJson);

    /*const __fetch__ = (() => {
     const fetchPromise = fetch(opts.url, requestJson);

     const timeoutPromise = new Promise((resolve, reject) => {
     setTimeout(()=>{
     reject(new Error("fetch timeout"))
     }, opts.timeout)
     });

     return fetchPromise
     // retrun Promise.race([fetchPromise, timeoutPromise])
     })();*/

    if (opts.useThen) return __fetch__;

    if (opts.resType === 'file') {//下载文件
        __fetch__.then(res => res.blob().then(blob => {
            let a = document.createElement('a');
            let url = window.URL.createObjectURL(blob);
            let filename = res.headers.get('Content-Disposition').substring(21);
            a.href = url;
            a.download = decodeURIComponent(filename);
            a.click();
            window.URL.revokeObjectURL(url);
        }))
    } else if (opts.resType === 'img') {
        __fetch__.then(res => res.blob().then(blob => {
            var url = window.URL.createObjectURL(blob);
            var img = document.getElementById('qrCode')
            img.src = url;
        }))
    } else {
        __fetch__.then((response) => {
            console.log('result:');
            console.log(response);
            if (response.status >= 200 && response.status < 300) {
                return response;
            }else if (response.status == 401){
                //登陆失效
                 notification.error({
                    message: '登陆失效啦~~',
                    description: '登陆失效,请重新登陆!!!',
                  });
                browserHistory.push('/sign_in');
                return ;

            } else {
                  const errortext = codeMessage[response.status] || response.statusText;
                  notification.error({
                    message: `请求错误 ${response.status}: ${response.url}`,
                    description: errortext,
                  });
                let error = new Error(response.status)
                error.response = response
                throw error
            }
        })
        .then(response => {
            //Promise对象转换为json
            return response.json();
        })
        .then((json) => {
            if (!opts.filter(json)) {
                //返回到上面的filger方法中
                opts.success(json);
                // if (json.code==200) {
                //     opts.success(json);
                // } else {
                //     message.error(json.msg)
                //     opts.error(json);
                // }
            }
        })
        .catch((error) => {
            console.log('error');
            if (!opts.filter(error)) opts.error(error);
        })
    }
};

/**
 * offset
 * 类似jq的offset方法 获得当前元素的偏移量
 * 
 *
 * @param     {domElement}
 * @return    {object} {left, top}
 */
export const offset = (domNode) => {
    let left = 0;
    let top = 0;

    while (domNode) {
        left += domNode.offsetLeft;
        top += domNode.offsetTop;
        domNode = domNode.offsetParent;
    }

    return {
        left,
        top
    }
}
/**
 * getCss 获取dom样式的值
 *
 *
 * @param     {domElement}
 * @return    {object} {left, top}
 */
export const getCss = (obj, attr) => {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj, false)[attr];
    }
}

/**
 * randomString
 * 随机字符串
 * 
 * @param     {number} 随机字符串长度 可选
 * @return    {string} 随机字符串
 */
export const randomString = (len) => {
    len = len || 32;
    let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    let maxPos = chars.length;
    let str = '';
    for (let i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return str;
}

/**
 * getSuffix
 * 获取文件后缀名
 * 
 *
 * @param     {string} 文件路径
 * @return    {string} 后缀名 .xxx
 */
export const getSuffix = (filename) => {
    let pos = filename.lastIndexOf('.')
    let suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}

export const getClass = (oParent, sClass) => {
    let aResult = [];
    let aEle = oParent.getElementsByTagName('*');

    for(let i = 0; i < aEle.length; i++){
        if(aEle[i].className){
            let arrClass = aEle[i].className.split(' ');
            for(let j = 0; j < arrClass.length; j++){
                if(arrClass[j] == sClass){
                    aResult.push(aEle[i]);
                    break;
                }
            }
        }
    }
    return aResult;
}

/**
 * filterArrByAttr
 * 从数组中过滤出参数字段并返回新数组
 * 
 *
 * @param     {array}  数组
 * @return    {string} 字段名
 */
export const filterArrByAttr = (arr, attr) => {
    return arr.map(item => item[attr]);
}

/**
 * getLevel 
 * 获取当前页面显示级别 ORG_LEVEL | SITE_LEVEL
 * 
 */
export const getLevel = () => (sessionStorage.getItem('LEVEL') || localStorage.getItem('LEVEL'))

/**
 * msFormat
 * 毫秒转时分秒
 * 
 *
 */
export const msFormat = (ms, string) => {
    let time;
    ms = Number(ms);

    switch (string) {
        case 'd':
            time = ms / (1000 * 60 * 60 * 24);
            break;
        case 'h':
            time = (ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            break;
        case 'm':
            time = (ms % (1000 * 60 * 60)) / (1000 * 60);
            break;
        case 's':
            time = (ms % (1000 * 60)) / 1000;
            break;
    }

    return Math.floor(time);
}

/**
 * runActionsMethod
 * 通用执行actions方法函数 避免重复写message的返回信息
 *
 * @param     {object}  actions
 * @param     {string}  方法名
 * @param     {object}  参数
 */
export const runActionsMethod = (actions, method, param, cb) => {
    actions[method](param, (json) => {
        if (json.success) {
            message.success(json.detailMsg || json.msg);
        } else {
            message.error(json.detailMsg || json.msg);
        }
        cb && cb(json);
    });
}

/**
 * add|edit|del data
 * 前端操作增删改
 *
 *
 *
 */
export const addData = (data, newData, newList, viewList, isPush) => { // arguments: 接口返回数据data、新增发送过来的数据、记录新增的数据、页面显示的数据

    if (data.length === 0) {
        data = {}
        data[viewList] = [];
    }

    newData.forEach(item => {
        item.frontendCreate = true
    })

    if (!data[viewList]) data[viewList] = [];

    data[viewList] = isPush ? [...data[viewList], ...newData] : [...newData, ...data[viewList]];

    // 记录新增的数据
    data[newList] = data[newList] ? [...data[newList], ...newData] : [...newData];

    return data
};
export const editData = (data, newData, newList, viewList) => { // arguments: 接口返回数据data、编辑发送过来的数据、记录新增的数据、页面显示的数据
    data[newList] = data[newList] ? data[newList] : [];

    let editIndex = data[viewList].findIndex((item, i) => {
        return item.id === newData.id;
    });

    data[viewList][editIndex] = Object.assign({}, data[viewList][editIndex], newData);

    let newTaskStepsIndex = data[newList].findIndex((item, i) => {
        return item.id === data[viewList][editIndex].id;
    });

    if (newTaskStepsIndex === -1) {
        data[newList].push(data[viewList][editIndex]);
    } else {
        data[newList][newTaskStepsIndex] = data[viewList][editIndex];
    }

    return data;
};

export const delData = (data, newData, newList, viewList, originalDataId) => { // arguments: 接口返回数据data、删除发送过来的数据、删除记录里新增的数据、页面显示的数据、记录删除的原数据

    data[newList] = data[newList] ? data[newList] : [];

    // 记录里有新增的数据 删掉
    data[newList] = data[newList].filter((item, i) => {
        return item.id !== newData.id;
    });

    if (!newData.frontendCreate) {
        // 走这里代表删的是后端过来的数据 记录删除的原数据id
        data[originalDataId] = data[originalDataId] ? [`${data[originalDataId]},${newData.id}`] : [newData.id];
    }

    data[viewList] = data[viewList].filter((item, i) => {
        return item.id !== newData.id;
    });

    return data;
}

export const correspondenceJson = {
    //维修保养
    workOrder: {
        DTB: {
            text: '待提报',
            process: 1,
            path: 'tab_1',
        },
        DFP: {
            text: '待分派',
            process: 2,
            path: 'tab_2',
        },
        QX: {
            text: '取消',
            process: 1,
            path: 'tab_1',
        },
        DJD: {
            text: '待接单',
            process: 3,
            path: 'tab_3',
        },
        DHB: {
            text: '待汇报',
            process: 3,
            path: 'tab_3',
        },
        SQGQ: {
            text: '申请挂起',
            process: 3,
            path: 'tab_3',
        },
        GQ: {
            text: '挂起',
            process: 3,
            path: 'tab_3',
        },
        DYS: {
            text: '待验收',
            process: 4,
            path: 'tab_4',
        },
        GB: {
            text: '关闭',
            process: 4,
            path: 'tab_4',
        },
    },
    //派工单
    dispatchOrder: {
        DTB: {
            text: '待提报',
            process: 1,
            msg:'提报',
            path: 'tab1',
        },
        DFP: {
            text: '待分派',
            process: 2,
            msg:'分派',
            path: 'tab2',
        },
        QX: {
            text: '取消',
            process: 1,
            msg:'取消',
            path: 'tab1',
        },
        DJD: {
            text: '待接单',
            process: 3,
            msg:'接单',
            path: 'tab3',
        },
        DHB: {
            text: '待汇报',
            process: 3,
            msg:'汇报',
            path: 'tab3',
        },
        DYS: {
            text: '待验收',
            process: 4,
            msg:'验收',
            path: 'tab4',
        },
        GB: {
            text: '关闭',
            process: 4,
            msg:'关闭',
            path: 'tab4',
        },
    },
    repairOrder: {
        DTB: {
            code: 'DTB',
            text: '待提报',
            process: true,
            edit: true,
            path: 'repair_tab1',
        },
        DFP: {
            code: 'DFP',
            text: '待分派',
            process: true,
            edit: true,
            path: 'repair_tab2',
        },
        QX: {
            code: 'QX',
            text: '取消',
            process: false,
            edit: false,
            path: 'repair_tab1',
        },
        DJD: {
            code: 'DJD',
            text: '待接单',
            process: true,
            edit: false,
            path: 'repair_tab3',
        },
        DHB: {
            code: 'DHB',
            text: '待汇报',
            process: true,
            edit: true,
            path: 'repair_tab3',
        },
        SQGQ: {
            code: 'SQGQ',
            text: '申请挂起',
            process: true,
            edit: false,
            path: 'repair_tab3',
        },
        GQ: {
            code: 'GQ',
            text: '挂起',
            process: true,
            edit: false,
            path: 'repair_tab3',
        },
        DYS: {
            code: 'DYS',
            text: '待验收',
            process: true,
            edit: true,
            path: 'repair_tab4',
        },
        YSDQR: {
            code: 'YSDQR',
            text: '验收待确认',
            process: true,
            edit: false,
            path: 'repair_tab4',
        },
        GB: {
            code: 'GB',
            text: '关闭',
            process: false,
            edit: false,
            path: 'repair_tab1',
        },
        statusCodeToText: (code) => {
            let status = correspondenceJson.repairOrder[code];
            return status ? status.text : '';
        }
    },
    assetStatus: {
        null: {
            text: '闲置'
        },
        enable: {
            text: '使用中'
        },
        free : {
            text: '闲置'
        },
        disable: {
            text: '废弃'
        }
    },
    //二维码
    code: {
        'true': {
            text: '活动',
        },
        'false': {
            text: '不活动',
        },
    },
    //巡检工单
    patrolOrder: {
        DTB: {
            text: '待提报',
            process: 'order_commit',
            path: 'order_commit',
        },
        DFP: {
            text: '待分派',
            process: 'order_assign',
            path: 'order_assign',
        },
        DJD: {
            text: '待汇报',
            process: 'order_excute',
            path: 'order_excute',
        },
        DHB: {
            text: '待汇报',
            process: 'order_excute',
            path: 'order_excute',
        },
        GB: {
            text: '关闭',
            process: 'order_excute',
            path: 'order_excute',
        },
    },
//缺陷单
    defectOrder:{
        DDTB: {
            text: '待提报',
            msg:'提报',
            process: true,
            edit: true,
        },
        DDQR: {
            text: '待确认',
            msg:'确认',
            process: true,
            edit: false,
        },
        DTQR: {
            text: '已确认',
            msg:'已确认',
            process: false,//是否显示流程按钮
            edit: false,//是否编辑
        },
    }
}

//业务json
export const businessJson = {
    //派工单需要的json数据
    dispatchOrder: {
        dispatchOrderStatus: [//派工单状态
            {
                "statusName": "DTB",
                "isFirstNode":true,//ture为首个状态，
                "isLastNode":false,//ture为首个状态，
                "operation": [
                    {"description": "确认",
                        "value": "PASS",
                        "type":"",//说明类型。用户组OR某个人，如果是用户组配置为用户组，如果是某个人则为null或者不配置
                        "processType":"PASS",//流程类型，CANCEL：取消，REJECT：驳回 PASS：确认
                    },
                ]
            },
            {
                "statusName": "DFP",
                "operation": [
                    {"description": "确认",
                        "processType":"PASS",//流程类型，CANCEL：取消，REJECT：驳回 PASS：确认
                        "value": "PASS"},
                ]
            },
            {
                "statusName": "DHB",
                "operation": [
                    {"description": "确认",
                        "processType":"PASS",//流程类型，CANCEL：取消，REJECT：驳回 PASS：确认
                        "value": "PASS"},
                ]
            },
            {
                "statusName": "DYS",
                "isLastNode":true,//ture为最后一个状态
                "operation": [
                    {"description": "确认",
                      "processType":"PASS",
                      "value": "PASS"},
                    {"description": "驳回",
                        "value": "REJECT",
                        "processType":"REJECT"
                    }
                ]
            },
        ],
        dispatchOrderProcess: true//假如为true,选择驳回，需要输入驳回理由
    },
    //例行工作单
    dailyTask: {
        dailyTaskStatus: [//例行工作单状态
            {
                "statusName": "DTB",
                 "isFirstNode":true,
                "isLastNode":false,//ture为首个状态，
                "operation": [
                    {"description": "确认",
                        "processType":"PASS",//流程类型，CANCEL：取消，REJECT：驳回 PASS：确认
                        "value": "PASS"},
                ]
            },
            {
                "statusName": "DFP",
                "operation": [
                    {"description": "确认",
                        "processType":"PASS",//流程类型，CANCEL：取消，REJECT：驳回 PASS：确认
                        "value": "PASS"},
                    {"description": "驳回",
                        "processType":"REJECT",
                        "value": "REJECT"},
                    // {"description": "取消", "value": "CANCEL"}
                ]
            },
            {
                "statusName": "DJD",
                "operation": [
                    {"description": "确认",
                        "processType":"PASS",//流程类型，CANCEL：取消，REJECT：驳回 PASS：确认
                        "value": "PASS"},
                    {"description": "驳回",
                        "processType":"REJECT",
                        "value": "REJECT"},
                    // {"description": "取消", "value": "CANCEL"}
                ]
            },
            {
                "statusName": "DHB",
                "operation": [
                    {"description": "确认",
                        "processType":"PASS",//流程类型，CANCEL：取消，REJECT：驳回 PASS：确认
                        "value": "PASS"},
                    {"description": "驳回",
                        "processType":"REJECT",
                        "value": "REJECT"},
                    // {"description": "取消", "value": "CANCEL"}
                ]
            },
            {
                "statusName": "DYS",
                "isLastNode":true,//ture为最后一个状态
                "operation": [
                    {"description": "确认",
                        "processType":"PASS",//流程类型，CANCEL：取消，REJECT：驳回 PASS：确认
                        "value": "PASS"},
                    {"description": "驳回",
                        "processType":"REJECT",
                        "value": "REJECT"},
                    // {"description": "取消", "value": "CANCEL"}
                ]
            },
        ],
        dailyTaskProcess: true//假如为true,选择驳回，需要输入驳回理由
    },//缺陷单
    defect: {
        defectStatus: [//缺陷单状态
            {
                "statusName": "DDTB",
                "isFirstNode":true,//ture为首个状态，
                "isLastNode":false,//ture为首个状态，
                "operation": [
                    {"description": "确认",
                        "processType":"PASS",//流程类型，CANCEL：取消，REJECT：驳回 PASS：确认
                        "value": "agree"},
                ]
            },
            {
                "statusName": "DDQR",
                "operation": [
                    {"description": "确认",
                        "processType":"PASS",//流程类型，CANCEL：取消，REJECT：驳回 PASS：确认
                        "value": "agree"},
                ]
            },
            {
                "statusName": "DTQR",
                "isLastNode":true,//ture为首个状态，
                "operation": [
                    {"description": "确认",
                        "processType":"PASS",//流程类型，CANCEL：取消，REJECT：驳回 PASS：确认
                        "value": "agree"},
                ]
            },
        ],
    }


}
