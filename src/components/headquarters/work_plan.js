/** 
 * @Description 总部事务-工作计划
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/headquarters.js';
import planActions from '../../actions/maintenance.js';
import { Link, browserHistory } from 'react-router';
import Dropdown from '../../components/common/dropdown.js';
import BackList from '../../components/common/back_list.js';
import ListTools from '../common/list_tools';
import EAModal from '../../components/common/modal.js';
import commonActions from '../../actions/common.js';
import MoreOperations from '../../components/common/more_operations.js';
import PubSub  from 'pubsub-js';
import { pubTopic } from '../../tools/constant';
import moment from 'moment';
import preventModal from './prevention_plan'
import DetailsPagination from '../../components/common/details_pagination.js';
import { runActionsMethod, filterArrByAttr } from '../../tools/';

import { Icon, Checkbox, Modal,DatePicker, Button,Input ,Table, Form,Pagination, Menu,message,Select,notification,Upload} from 'antd';
const confirm = Modal.confirm;
const Option = Select.Option;
const FormItem = Form.Item;

class WorkPlanComponent extends React.Component {
    constructor(props) {
        super(props);

        PubSub.subscribe(pubTopic.headquartersPlan.DISPATCHORDER, this.getDispatch );
        PubSub.subscribe(pubTopic.headquartersPlan.ROUTINE_WORK, this.getRoutine );
        this.state = {
            modalShow: false,
            rowSelection: null, // 表格多选
            currentPage: 1,
            tableLoading: false,
            selectedRowKeys:[]
        }
       
        const {commonState} = this.props;

        //表格字段
        this.columns = [
            {
                title: '计划编码',
                dataIndex: 'planNum',
                key: 'planNum',
                sorter: (a, b) => {
                    if (a.planNum > b.planNum) {
                        return 1
                    }
                    else if (a.planNum < b.planNum) {
                        return -1
                    }
                },
                render: (text, record, key) => {
                      return (
                        <p><a className="order-number" onClick={() => { this.jumpToTabPage(record) }}>{text ? text : '-'}</a></p>
                      )
                  }
            },
            {
                title: '计划名称',
                dataIndex: 'planName',
                key: 'planName',
                sorter: (a, b) => {
                    a.checkItem-b.checkItem
                },
                render: (text, record, key) => {
                    return (
                        <p>{text ? text : '-'}</p>
                    )
                }
            },
            {
                title: '检查项',
                dataIndex: 'checkItem',
                key: 'checkItem',
                sorter: true,
                render: (text, record, key) => {
                    text=this.getSelect(text);
                    return (
                        <p>{text ? text : '-'}</p>
                    )
                }
            },
            {
                title: '应用范围',
                dataIndex: 'planSite',
                key: 'planSite',
                sorter: true,
                render: (text, record, key) => {
                    text = this.getPlanSiteName(text);
                    return (
                        <p>{text ? text : '-'}</p>
                    )
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'ceate',
                sorter: true,
                render: (text, record, key) => {

                    text =  this.getStatus(text);
                    return (
                        
                        <p>{text ? text : '-'}</p>
                    )
                }
            },
            {
                title: '操作',
                dataIndex: '4',
                key: '4',
                width: 120,
                render: (text, record, key) => {
                    return (
                        <div className="table-icon-group">
                            {/*<Collection*/}
                                {/*onChange={arg => {*/}
                                     {/*if (__DEV__) console.log(arg)*/}
                                {/*}}*/}
                            {/*/>*/}
                            {
                                record.status =='activity'||record.status=='inactivity' ? null :
                                <Icon
                                    type="delete"
                                    onClick={() => {
                                        this.showConfirm(record.id)
                                    }}
                                />
                            }
                        </div>
                    )
                }
            },
        ];
        //*** 初始化列表参数 需要到处改参数的请求 把参数定义到这里 严禁把参数用state管理 因为参数变化不需要触发render来渲染页面
        this.param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            pageNum: 1,
            pageSize: 10,
        };
    }

    getStatus = (text) => {
        const {commonState} = this.props;
        const textName =  commonState.hqPlanType.map((item)=>{
            if(text==item.value){
                return item.description;
            }
        })
        return textName;
    }
    getPlanSiteName = (text) => {
        const {commonState} = this.props;
        let list = new Array();
        const siteList = commonState.siteList ? commonState.siteList : []
        text.map((item) => {
            for(let i=0; i<siteList.length; i++){
                if(item == siteList[i].id){
                    list.push(siteList[i].name);
                }
            }
        })
        console.log("site",commonState.siteList);
        return list.join(",");
    }
    getSelect=(text)=>{

        const {commonState} = this.props;
        const   departmentList = commonState.checkItem ;
        for (let attr in departmentList) {
            if(departmentList[attr].value==text){
                return departmentList[attr].description;
            }
        }
        return text;
    }
    // 列表删除
    del = (id) => {
        const { actions } = this.props;
        let param = {ids: id};
        actions.deletePlan(param, (json) => {
            if (json.success) {
                message.success(json.msg);
                this.getList();
                this.state.selectedRowKeys=[];
            } else {
                message.error(json.msg);
            }
        });
    }
    // 删除确认
    showConfirm = (id) => {
        if (Array.isArray(id) && !id.length) {
            message.error('请选择要删除的数据。')
        } else {
            confirm({
                title: `删除 ${(id.length + '条数据')}?`,
                okText: '删除',
                onOk: () => {
                    if (Array.isArray(id)) id = id.join(',')
                    this.del(id);
                }
            });
        }
        
    }
    jumpToMpTable = (isTable) => {
        const {state} = this.props
        var workPlanData = new Array();
        if(isTable){
            workPlanData = this.state.selectedRows ? this.state.selectedRows : [];
        }else{
            workPlanData.push(JSON.parse(localStorage.getItem("planDetail")));
            this.setState({selectedRows:[]});
            this.setState({selectedRows:workPlanData});
        }
        console.log("为跳转前",workPlanData);
        if(workPlanData != null && workPlanData.length > 0){
            browserHistory.push(`/headquarters/work_plan/prevention_plan_1?add_maintenance_Plan=1`);
            localStorage.setItem('workPlanData', workPlanData);
            console.log("location",location);
            console.log("列表workPlanData",workPlanData);
        }else{
            message.error("请勾选总部计划数据！")
        }
    }
    jumpToTabPage = (record) => {
        const { actions,state,location,commonState } = this.props;
        
        if(record != null){
            state.routineIsAdd=false
            let json = {};
            json.id = record.id; // *跳转前存相关数据 和列表页跳详情页做同样处理 (这个存储是必要的操作并且必须包含id)
            localStorage.setItem('workId', record.id);
            localStorage.setItem('headquartersPlan', JSON.stringify(json));
            localStorage.setItem('LIST_PARAM', JSON.stringify(this.param));
            browserHistory.push(`/headquarters/work_plan/work_1`);
        }else{
            state.routineIsAdd=true
            localStorage.setItem('workId', "");
            browserHistory.push('/headquarters/');
            browserHistory.push(`/headquarters/work_plan/work_1`);
        }
    }
    // 表格事件
    tableChange = (pagination, filters, sorter) => {
         if (__DEV__) console.log(sorter)
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }
    componentWillMount () {
        this.getList();
        this.getHQPlanType();
    }
    getHQPlanType = () => {
        const {commonState,commonActions} = this.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'HQPlanStatus', 'HQ_PLAN_TYPE');//状态
    }
    // 获取列表数据
    getList = () => {
        //重置选中行
        const { actions,commonActions,commonState } = this.props;
        // console.log("commonState.siteList",commonState.siteList);
        this.setState({ tableLoading: true });
        actions.inventoryGetList(this.param, () => {
            this.setState({ tableLoading: false });
        });
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'checkItem', 'CHECKITEM');//检查项
    }
    // 模糊查询
    fuzzyQuery = (keywords) => {
        this.param.word = keywords;
        this.getList();
    }
    //表单数据保存
    handleSubmint = () => {
        const { commonActions,actions,location,planActions,planState,state } = this.props;
        const isAddMaintenancePlan = location.query.add_maintenance_Plan;
        if(typeof isAddMaintenancePlan == "undefined"){
            actions.getFormValues(true);
        }else{
            console.log("预防计划保存")
            planActions.getFormValues(false);
            // clearTimeout(this.timer);
            // this.timer = setTimeout(() => {
                const { planState,commonState } = this.props;
                const data = planState.maintenanceDetailListData;
    
                const ids = {
                    orgId: commonState.orgId,
                    siteId: commonState.siteId,
                    id: '',
                }
    
                if (planState.getFormValues === true || !planState.getFormValues[0] || !planState.getFormValues[1] || !planState.getFormValues[2]) return;
    
                const addAssetList = data.newAssetList || [],
                      deleteAssetList = data.delOriginalDataId,
                      maintenancePlanActiveTimeVoList = data.maintenancePlanActiveTimeVoList,
                      deleteMaintenancePlanActiveTimeVoList = data.termDateDelOriginalDataId;
    
                addAssetList.forEach((item) => {
                    item.assetId = item.id;
                })
    
                if (planState.getFormValues[2]) {
                    planState.getFormValues[2].extDate = moment(planState.getFormValues[2].extDate).format('YYYY-MM-DD');
                    planState.getFormValues[2].nextDate = moment(planState.getFormValues[2].nextDate).format('YYYY-MM-DD');
                }
                
                
                
                var workPlanData = this.state.selectedRows;
                var sucMsg = [];
                var errMsg = [];
                let codeParam = {
                    modelKey: "pm",
                    orgId: commonState.orgId,
                    siteId: commonState.siteId
                };
                for(let i=0; i<workPlanData.length; i++){
                    const param = {
                        ...ids,
                        ...planState.getFormValues[0],
                        ...planState.getFormValues[1],
                        ...planState.getFormValues[2],
                        ...planState.getFormValues[3],
                        addAssetList,
                        deleteAssetList,
                        maintenancePlanActiveTimeVoList,
                        deleteMaintenancePlanActiveTimeVoList,
                        description : workPlanData[i].description ? workPlanData[i].description : ""
                    }
                    commonActions.codeGenerator(codeParam, (code) => {
                        if(code.success){
                            param.maintenancePlanNum = code.data;
                            console.log("下标2",i);
                    
                            // runActionsMethod(planActions, 'mpSave', param, (json) => {
                            planActions.mpSave(param, (json) => {
                                
                                const data = json.data;
                
                                const obj = {};
                                obj.id = data.id;
                                obj.status = data.status
                                obj.maintenancePlanNum = data.maintenancePlanNum;
                                obj.description = data.description;
                
                                if(json.success){
                                    sucMsg.push(<p>{"维护计划编号："+data.maintenancePlanNum+" 生成成功！"}</p>);
                                }else{
                                    errMsg.push(<p>{"维护计划编号："+data.maintenancePlanNum+" 生成失败！"}</p>);
                                }
                                if((sucMsg.length+errMsg.length) == workPlanData.length){
                                    if(sucMsg.length > 0){
                                        notification.success({
                                            message:"生成预防维护计划成功消息！",
                                            description : sucMsg,
                                            duration : 0
                                        });
                                    }
                                    if(errMsg.length > 0){
                                        notification.error({
                                            message:"生成预防维护计划失败消息！",
                                            description : errMsg,
                                            duration : 0
                                        });
                                    }
                                    this.getList();
                                }
                                // localStorage.setItem('maintenancePlan', JSON.stringify(obj));
                
                                
                                // setTimeout(() => {
                                //     browserHistory.push('/headquarters/work_plan/');
                                //     browserHistory.push('/headquarters/work_plan/prevention_plan_1');
                                // }, 500);
                                
                            });
                        }
                    })
                        
                }
            // },0);
        }
    }
    moreClick = (key,hideCheckBox,isTable) => {
        console.log("key",key)
        //修改状态
        if(key === '0'){
            var id = this.state.selectedRowKeys ? this.state.selectedRowKeys : [];
            if (Array.isArray(id) && !id.length) {
                message.error('请选择要修改状态的数据。')
            } else {
                this.allPropertyAddModal.modalShow();
            }
        }
        //批量下达
        if(key === '1'){
            var id = this.state.selectedRowKeys ? this.state.selectedRowKeys : [];
            if (Array.isArray(id) && !id.length) {
                message.error('请选择要下达的数据！')
            } else {
                confirm({
                    title: `下达 ${(id.length + '条数据')}?`,
                    okText: '批量下达',
                    onOk: () => {
                        if (Array.isArray(id)) id = id.join(',')
                        this.batchRelease(id);
                    }
                });
            }
        }
        //批量派工单
        if(key === '2'){
            const { state } = this.props;
            var selectedRows = new Array();
            if(isTable){
                selectedRows = this.state.selectedRows ? this.state.selectedRows : [];
            }else{
                selectedRows.push(JSON.parse(localStorage.getItem("planDetail")));
            }
            console.log("selectRows",selectedRows);
            if (Array.isArray(selectedRows) && !selectedRows.length) {//没有选择数据
                // confirm({
                //     title: `是否全部生成派工单`,
                //     okText: '批量生成派工单',
                //     onOk: () => {
                //         state.workPlan="";
                //         this.dispatchModal.modalShow();
                //     }
                // });
                message.error("请勾选要生成派工单的数据！");
            } else {
                confirm({
                    title: `是否把选中数据生成派工单`,
                    okText: '批量生成派工单',
                    onOk: () => {
                        // if (Array.isArray(id)) id = id.join(',')
                        state.workPlanData = selectedRows;
                        this.dispatchModal.modalShow();
                    }
                });
            }

        }
        //批量例行工作
        if(key === '3'){
            const { state } = this.props;
            let id = new Array();
            if(isTable){
                id = this.state.selectedRowKeys ? this.state.selectedRowKeys : [];
            }else{
                id.push(localStorage.getItem("workId"));
            }
            if (Array.isArray(id) && !id.length) {//没有选择数据
                confirm({
                    title: `是否全部生成例行工作`,
                    okText: '批量生成例行工作',
                    onOk: () => {
                        state.workPlan="";
                        this.routineModal.modalShow();
                    }
                });
            } else {
                confirm({
                    title: `是否把选中数据生成例行工作`,
                    okText: '批量生成例行工作',
                    onOk: () => {
                        if (Array.isArray(id)) id = id.join(',')
                        state.workPlan=id;
                        this.routineModal.modalShow();
                    }
                });
            }
        }
        //生成预防性计划
        if(key === '4'){
            this.jumpToMpTable(isTable);
        }

        if (key === '5') { //批量删除
            let id = new Array();
            if(isTable){
                id = this.state.selectedRowKeys ? this.state.selectedRowKeys : [];
            }else{
                id.push(localStorage.getItem("workId"));
                console.log("id",id)
                console.log("workId",localStorage.getItem("workId"))
                
            }
            this.showConfirm(id)
        }
        if(key === '6'){
            window.location.href ="http://panyun.oss-cn-beijing.aliyuncs.com/zcsxls/%E5%B7%A5%E7%A8%8B%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F-%E8%AE%A1%E5%88%92%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF_2.0.xlsx"
        }
        if(key === '7'){
            this.upPlanModal.modalShow();
        }
    }
    //批量下达
    batchRelease = (id) => {
        const { actions } = this.props;
        let param = {ids: id};
        actions.batchRelease(param, (json) => {
            if (json.success) {
                message.success(json.msg);
                this.getList();
            } else {
                message.error(json.msg);
            }
        });
    }
    statusSelectChange = (value) =>{
        this.selectStatus = value;
    }
    // 批量修改状态确定
    allPropertyAddSave = () => {
        const { actions,commonState } = this.props;
        var id = this.state.selectedRowKeys ? this.state.selectedRowKeys : [];
            // id = id.join(',')
        var param = {};
        param.ids = id;
        param.status = this.selectStatus ? this.selectStatus : "false" ;
        param.siteId = commonState.siteId;
        actions.upStrtus(param, (json) => {
            if (json.success) {
                message.success(json.msg);
                this.getList();
            } else {
                message.error(json.msg);
            }
        });
        this.allPropertyAddModal.modalHide();
    }



    getDispatch=(msg, data)=>{
        if(data=="CLOSE"){
            this.dispatchModal.modalHide()
        }
    }
    getRoutine=(msg, data)=>{
        if(data=="CLOSE"){
            this.routineModal.modalHide();
        }

    }
    //获取选中值
    tableSelectChange = (selectedRowKeys,selectedRows) => {
        this.setState({selectedRowKeys,selectedRows});
    }

    saveDispatch=()=>{
        PubSub.publish(pubTopic.headquartersPlan.DISPATCHORDER, 'SAVE' );
    }
    saveRoutine=()=>{
        PubSub.publish(pubTopic.headquartersPlan.ROUTINE_WORK, 'SAVE' );
    }

    closeUpModal = () => {
        this.upPlanModal.modalHide();
        this.getList();
    }


    render () {
        const { children, state,commonState,location } = this.props;
        const  planDetail = state.planDetail;
        const data = state.planListData; //*** 拿到请求返回的数据
        const list = data.list||[];
        const code = commonState.codeEntity,
                routineIsAdd=state.routineIsAdd
        // const list =  [];
        // 高级筛选选项数据
        const seniorFilterSelectArr = [
            [],
            [],
        ];
        //表格多选
        const rowSelection = this.state.rowSelection ?
        {
            selectedRows: this.state.selectedRows,
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.tableSelectChange,
            getCheckboxProps: record => {
                let disabled = false;

                if (this.state.moreOperationsKey == '5') {//删除
                    disabled = record.status =='activity'||record.status=='inactivity';
                } else if (this.state.moreOperationsKey == '1') { //
                    disabled = record.status=='draft';
                }else if (this.state.moreOperationsKey == '2') { //
                    disabled = record.status=='draft';
                }else if (this.state.moreOperationsKey == '3') { //
                    disabled = record.status=='draft';
                }else if (this.state.moreOperationsKey == '4') { //
                    disabled = record.status=='draft';
                }
                return { disabled }
            }
        } :
        null;
        
        const workModal =   <EAModal
                                title="例行工作"
                                ref={routineModal => this.routineModal = routineModal}
                                afterClose={() => { this.routineModal.modalHide() }}
                            >
                                < RoutineStepsForm  props={this.props} />
                                <div className="modal-footer clearfix">
                                    <Button size="large" onClick={() => { this.routineModal.modalHide() }}>取消</Button>
                                    <Button type="primary" size="large" onClick={this.saveRoutine}>确定</Button>
                                </div>
                            </EAModal>;
        const dispatchingModal =   <EAModal
                                    title="派工单"
                                    ref={dispatchModal => this.dispatchModal = dispatchModal}
                                    afterClose={() => { this.dispatchModal.modalHide() }}
                                >
                                    < DispatchStepsForm  props={this.props} />
                                    <div className="modal-footer clearfix">
                                        <Button size="large" onClick={() => { this.dispatchModal.modalHide() }}>取消</Button>
                                        <Button type="primary" size="large" onClick={this.saveDispatch}>确定</Button>
                                    </div>
                                </EAModal>

        const planSiteObj = () =>{
            var obj = {};
            commonState.siteList ? commonState.siteList.map((item) => {
                obj[item.code] = item.id
            }) : []
            return JSON.stringify(obj);
        }
        const upProps = {
            name: 'file',
            action: '//localhost:9092/api/eam/open/headquartersPlan/upload',
            headers: {
                authorization: 'Bearer '.concat(localStorage.getItem('token') || ''),
            },
            data: {
                "siteId":commonState.siteId,
                "orgId":commonState.orgId,
                "proId":'EAM',
                "siteList":planSiteObj()
            },
            onChange(info) {
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (info.file.status === 'done') {
                message.success(`${info.file.name} 上传成功！`);
              } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败！`);
              }
            },
        };
        
        return children ?
        (
            <div>
                <div className="top-bar clearfix">
                    {
                        (location.pathname.indexOf("work_plan/prevention_plan_1")>-1 || location.pathname.indexOf("work_plan/prevention_plan_2")>-1 )? "" :
                        <div className="details-title pull-left">
                            <h3>{planDetail ? planDetail.planNum : code}</h3>
                            <span className="eam-tag">{planDetail ? planDetail.status=="false"?"不活动":"活动" : "草稿"}</span>
                            <p>{planDetail ? planDetail.description : ""}</p>
                        </div>
                    }
                    <div className="list-tools-right pull-right">
                        <BackList location={location} onClick={this.getList} />
                        {
                            !routineIsAdd && ((location.pathname.indexOf("work_plan/prevention_plan_1")<0 || location.pathname.indexOf("work_plan/prevention_plan_2")<0 )) ? <DetailsPagination
                                    state={state} // 此模块state
                                    listDataName="planListData" // 列表数据state名 -> data = state.workOrderListData
                                    localStorageName="headquartersPlan" // onChang 方法内设置的存储名
                                    onChange={(record)=>{
                                        let json = {};
                                        json.id = record.id; // *跳转前存相关数据 和列表页跳详情页做同样处理 (这个存储是必要的操作并且必须包含id)
                                        localStorage.setItem('workId', record.id);
                                        localStorage.setItem('headquartersPlan', JSON.stringify(json));
                                        browserHistory.push(`/headquarters/`);
                                        browserHistory.push(`/headquarters/work_plan/work_1`);
                                    }}
                                    getList={(pageNum, cb) => {
                                        // *分页是根据列表页数据切换数据 本业列表数据用完 这里请求上|下一页数据
                                        // *列表页跳详情页必须本地存储列表页请求数据参数 全局统一用LIST_PARAM 防止详情页刷新请求的数据与列表跳详情的数据不一致
                                        this.param = JSON.parse(localStorage.getItem('LIST_PARAM'));
                                        if (pageNum) this.param.pageNum = pageNum;
                                        this.getList(cb);
                                    }}
                                />:null
                        }
                        {
                        (location.pathname.indexOf("work_plan/prevention_plan_1")>-1 || location.pathname.indexOf("work_plan/prevention_plan_2")>-1 )? "" :
                            <Dropdown
                                overlay={(
                                    <Menu onClick={(e)=>{this.moreClick(e.key,null,false)}}>
                                        {/* <Menu.Item key="0"><Icon type="edit"  /> 变更状态</Menu.Item> */}
                                        <Menu.Item key="1"><Icon type="setting" /> 批量下达</Menu.Item>
                                        <Menu.Item key="2"><Icon type="setting" /> 批量派工单</Menu.Item>
                                        <Menu.Item key="3"><Icon type="setting" /> 生成例行工作</Menu.Item>
                                        <Menu.Item key="4"><Icon type="setting" /> 生成预防性计划</Menu.Item>
                                        <Menu.Divider />
                                        <Menu.Item key="5"><Icon type="delete" /> 批量删除</Menu.Item>
                                    </Menu>
                                )}
                                trigger={['click']}
                            >
                                更多操作
                            </Dropdown>
                        }
                        <Button type="primary" size="large" onClick={() => { this.jumpToTabPage(null) }}>新建</Button>
                        <Button type="primary" size="large"  onClick={this.handleSubmint}>保存</Button>
                    </div>
                </div>
                {children}
                {/* 派工单modal */}
                {dispatchingModal}
                {/* 例行工作modal */}
                {workModal}
            </div>
        ) :
        (
            <div>
                <div className="top-bar clearfix">
                    <ListTools
                        title="工作计划"
                        onEnter={(text) => {
                                this.fuzzyQuery(text);
                            }}
                        conditionList={seniorFilterSelectArr}
                    />
                    <div className="list-tools-right pull-right">
                        <Pagination
                            total={data.total}
                            className="pull-left"
                            current={this.state.currentPage}
                            onChange={this.pageChange}
                        />
                        {/* <Dropdown
                            overlay={(
                                 <Menu onClick={this.moreClick}>
                                 <Menu.Item key="0"><Icon type="edit" /> 变更状态</Menu.Item>
                                 <Menu.Item key="1"><Icon type="setting" /> 批量下达</Menu.Item>
                                 <Menu.Item key="2"><Icon type="setting" /> 批量派工单</Menu.Item>
                                 <Menu.Item key="3"><Icon type="setting" /> 生成例行工作</Menu.Item>
                                 <Menu.Item key="4"><Icon type="setting" /> 生成预防性计划</Menu.Item>
                                 <Menu.Divider />
                                 <Menu.Item key="6"><Icon type="cloud-download-o" />下载总部计划模板</Menu.Item>
                                 <Menu.Item key="7"><Icon type="cloud-upload-o" />上传总部计划数据</Menu.Item>
                                 <Menu.Divider />
                                 <Menu.Item key="5"><Icon type="delete" /> 批量删除</Menu.Item>
                                </Menu>
                            )}
                            trigger={['click']}
                        >
                            更多操作
                        </Dropdown> */}
                        <MoreOperations
                            style={{float: 'left'}}
                            menuData={[
                                {
                                    icon: 'edit',
                                    text: '变更状态',
                                    confirmText: '选择状态'
                                },
                                {
                                    icon: 'setting',
                                    text: '批量下达',
                                    confirmText: '填写下达数据'
                                },
                                {
                                    icon: 'setting',
                                    text: '批量派工单',
                                    confirmText: '填写派工单'
                                },
                                {
                                    icon: 'setting',
                                    text: '生成例行工作',
                                    confirmText: '填写例行工作'
                                },
                                {
                                    icon: 'setting',
                                    text: '生成预防性计划',
                                    confirmText: '填写预防性计划'
                                },
                                {
                                    icon: 'delete',
                                    text: '批量删除',
                                    confirmText: '批量删除'
                                },
                                {
                                    icon: 'cloud-download-o',
                                    text: '下载总部计划模板',
                                    confirmText: '下载总部计划模板'
                                },
                                {
                                    icon: 'cloud-upload-o',
                                    text: '上传总部计划数据',
                                    confirmText: '上传总部计划数据'
                                },
                            ]}
                            onChange={(key, showCheckbox) => {
                                let rowSelection;

                                if (showCheckbox) {
                                    this.setState({ selectedRows: [] }); // 清空选择
                                    this.setState({ selectedRowKeys: [] }); // 清空选择
                                    rowSelection = true
                                } else {
                                    rowSelection = false;
                                }

                                this.setState({
                                    rowSelection,
                                }, () => {
                                    this.setState({
                                        moreOperationsKey: key,
                                    })
                                })
                            }}
                            onOk={(key, hideCheckBox) => {
                                this.moreClick(key, hideCheckBox,true);
                            }}
                        />
                        <Button type="primary" size="large" onClick={() => { this.jumpToTabPage(null) }}>新建</Button>
                    </div>
                </div>
                <div className="eam-content">
                    <Table
                        loading={this.state.tableLoading}
                        rowKey="id"
                        pagination={false}
                        dataSource={list}
                        columns={ this.columns }
                        rowSelection={rowSelection}
                        bordered
                        onChange={this.tableChange}
                    />
                    <Pagination
                        total={data.total}
                        showSizeChanger
                        showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                        current={this.state.currentPage}
                        showQuickJumper
                        onChange={this.pageChange}
                    />
                </div>
                <EAModal
                    title={
                        <div>
                            <span>{`批量变更状态`}</span>
                        </div>
                    }
                    ref={allPropertyAddModal => this.allPropertyAddModal = allPropertyAddModal}
                >
                    <Select
                        onChange={this.statusSelectChange}
                        size="large" style={{ width: '100%' }}  >
                        {
                            commonState.hqPlanType ? commonState.hqPlanType.map((item) => <Option value={item.value}>{item.description}</Option>) : []
                        }
                    </Select>
                    <preventModal/>
                    <div className="modal-footer clearfix">

                        <Button size="large" onClick={() => { this.allPropertyAddModal.modalHide() }}>取消</Button>
                        <Button type="primary" size="large" onClick={this.allPropertyAddSave}>确定</Button>
                    </div>
                </EAModal>
                {/* 派工单modal */}
                {dispatchingModal}
                {/* 例行工作modal */}
                {workModal}
                <EAModal
                    title="上传总部计划数据"
                    ref={upPlanModal => this.upPlanModal = upPlanModal}
                    afterClose={() => { this.upPlanModal.modalHide() }}
                >
                    <Upload {... upProps} >
                        <Icon type="upload" />上传总部计划数据
                    </Upload>
                    <div className="modal-footer clearfix">
                        <Button size="large" onClick={this.closeUpModal }>关闭</Button>
                    </div>
                </EAModal>
            </div>
        )
    }
}


// 派工单
class dispatchFormComponent extends React.Component {
    constructor(props) {
        super(props);

        //订阅父页面的消息
        PubSub.subscribe(pubTopic.headquartersPlan.DISPATCHORDER, this.saveDispatch1 );
        this.formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
    }
    //获取部门
    getdept = () => {

        const {commonActions,commonState} = this.props.props;

        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'department', 'DEPARTMENT_GET_LIST');//状态

    }


    saveDispatch1=(msg, data)=>{
   
        const {commonActions,commonState,State,actions} = this.props.props;

        if(data=="SAVE"){
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    var sucMsg = [];
                    var errMsg = [];
                    var workPlanArr = values.workPlanData;

                    let codeParam = {
                        modelKey: "dispatch",
                        orgId: commonState.orgId,
                        siteId: commonState.siteId
                    };
                    for(let i=0; i<workPlanArr.length; i++){
                        var workPlanObj = workPlanArr[i];
                        commonActions.codeGenerator(codeParam, (code) => {
                            if(code.success){
                                const param = {
                                    siteId : commonState.siteId,
                                    orgId : commonState.orgId,
                                    prodId : "EAM",
                                    reportPersonId : commonState.personId,
                                    reportPersonName : commonState.personName,
                                    reportPersonTel : commonState.personMobile,
                                    workOrderNum : code.data,
                                    reportDate : moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                                    description : workPlanObj.description,
                                    demandDept : values.demandDept,
                                    demandPerson : values.demandPerson,
                                    demandPersonTel : values.demandPersonTel,
                                    processStatus : "PASS",
                                }
                                actions.dispatchWorkOrderSave(param,(json) => {
                                    if(json.success){
                                        sucMsg.push(<p>{"工单编号："+json.data.workOrderNum+" 生成成功！"}</p>);
                                    }else{
                                        errMsg.push(<p>{"工单编号："+json.data.workOrderNum+" 生成失败！"}</p>);
                                    }
                                    if((sucMsg.length+errMsg.length) == workPlanArr.length){
                                        if(sucMsg.length > 0){
                                            notification.success({
                                                message:"批量派工成功消息！",
                                                description : sucMsg,
                                                duration : 0
                                            });
                                        }
                                        if(errMsg.length > 0){
                                            notification.error({
                                                message:"批量派工失败消息！",
                                                description : errMsg,
                                                duration : 0
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }


                    // console.log("workPlanData",values.ids)
                    // delete values.workPlanData;
                    // values.siteId = commonState.siteId;
                    // values.orgId = commonState.orgId;
                    // values.prodId = "EAM"
                    // values.reportPersonId = commonState.personId;
                    // values.reportPersonName = commonState.personName;
                    // values.reportPersonTel = commonState.personMobile;
                    
                    // actions.batchDispatchOrder(values, (json) => {
                    //     if (json.success) {
                    //         message.success(json.msg);
                    //     } else {
                    //         message.error(json.msg);
                    //     }
                    // });
                    PubSub.publish(pubTopic.headquartersPlan.DISPATCHORDER, 'CLOSE' );

                }
            });
        }

    }


    componentWillMount() {
        this.getdept();
    }



    render () {
        const { getFieldDecorator } = this.props.form;
        const { data,commonState,state } = this.props.props;
        const departmentList = commonState.departmentList ;
        const workPlanData= state.workPlanData ? state.workPlanData : [];
        return (
            <Form>
                {
                    getFieldDecorator('workPlanData', {
                        initialValue: workPlanData
                    })(
                       <Input type="hidden" />
                    )
                }
                <FormItem
                    {...this.formItemLayout}
                    label="需求部门"
                >
                    {
                        getFieldDecorator('demandDept', {
                            initialValue: data ? data.demandDept : '',
                            rules: [{ required: true, message: '需求部门不能为空' }],
                        })(
                            <Select  size="large" style={{width: '100%'}}  >
                                {
                                    departmentList.map((item, i) => <Option key={i}
                                   value={item.value}>{item.description}</Option>)
                                }
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="需求人"
                >
                    {
                        getFieldDecorator('demandPerson', {
                            initialValue: data ? data.demandPerson : '',
                            rules: [{ required: true, message: '需求人不能为空' }],
                        })(
                            <Input style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="联系电话"
                >
                    {
                        getFieldDecorator('demandPersonTel', {
                            initialValue: data ? data.taskDuration : '',
                            rules: [{ required: true, message: '联系电话不能为空' }],
                        })(
                            <Input style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
const DispatchStepsForm = Form.create()(dispatchFormComponent);

// 例行工作
class  routineFormComponent extends React.Component {
    constructor(props) {
        super(props);

        //订阅父页面的消息
        PubSub.subscribe(pubTopic.headquartersPlan.ROUTINE_WORK, this.saveRoutine );
        this.formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
    }

    //频率单位,获取工作类型
    getSelect = () => {
        const {commonActions,commonState} = this.props.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'timeFrequency', 'GET_TIME_FREAUENCY');//状态
        commonActions.getDomainValue(domainValueParam, 'workType', 'WORKTYPE');//工作类型

    }
    saveRoutine=(msg, data)=>{
        console.info(msg);
        console.info(data);
        console.info("接收数据");
        const {commonActions,commonState,State,actions} = this.props.props;

        if(data=="SAVE"){
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    
                    values.startDate = moment(values.startDate).format('YYYY-MM-DD HH:mm:ss')
                    values.ids = values.workPlanId;
                    
                    delete values.workPlanId;
                    actions.batchBuildWork(values, (json) => {
                        if (json.success) {
                            message.success(json.msg);
                        } else {
                            message.error(json.msg);
                        }
                    });
                    PubSub.publish(pubTopic.headquartersPlan.ROUTINE_WORK, 'CLOSE' );
                }
            });
        }

    }


    componentWillMount() {
        this.getSelect();
    }



    render () {
        const { getFieldDecorator } = this.props.form;
        const { data,commonState,state } = this.props.props;
        const timeFrequency = commonState.timeFrequency ;
        const workTypes=commonState.workType;
        const workPlan= state.workPlan ? state.workPlan.split(",") : [];

        return (
            <Form>
                {
                    getFieldDecorator('workPlanId', {
                        initialValue: workPlan
                    })(
                         <Input type="hidden" />
                    )
                }
                <FormItem
                    {...this.formItemLayout}
                    label="工作类型"
                >
                    {
                        getFieldDecorator('workType',{
                            rules: [{ required: true, message: '工作类型不能为空' }],
                            initialValue: data ? data.workType  : '',
                        })(
                            <Select  size="large" style={{width: '100%'}}  >
                                {
                                    workTypes.map((item, i) => <Option key={i}  value={item.value}>{item.description}</Option>)
                                }
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="完成期限"
                >
                    {
                        getFieldDecorator('deadline',{
                            initialValue: data ? data.deadline  : '',
                            rules: [
                                { required: true, message: '完成期限不能为空' },
                                { max: 3, message: '完成期限长度不能超过2个字符长度' },
                                { pattern: /^\+?[1-9][0-9]*$/, message: '请输入合法的数字' },
                            ],
                        })(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="下一生成日期"
                >
                    {
                        getFieldDecorator('startDate',{
                            initialValue: data ? moment(data.startDate,"YYYY-MM-DD HH:mm:ss") : null,
                            rules: [{ required: true, message: '下一生成日期不能为空' }],
                        })(
                            <DatePicker  style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" showTime placeholder="Select Time"/>
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="频率"
                >
                    {
                        getFieldDecorator('times',{
                            initialValue: data ? data.times : '',
                            rules: [
                                { required: true, message: '频率不能为空' },
                                { max: 3, message: '频率长度不能超过2个字符长度' },
                                { pattern: /^\+?[1-9][0-9]*$/, message: '请输入合法的数字' },
                            ],
                        })
                        (
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="频率单位"
                >
                    {
                        getFieldDecorator('frequency', {
                            initialValue: data ? data.frequency : '',
                            rules: [{ required: true, message: '频率单位不能为空' }],
                        })(
                            <Select size="large" style={{ width: '100%' }}>
                                {
                           timeFrequency.map((item, i) => <Option key={i}  value={item.value}>{item.description}</Option>)
                                }
                            </Select>
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
const RoutineStepsForm = Form.create()(routineFormComponent);

function mapStateToProps (state) {
    return {
        planState: state.maintenance,
        state: state.headquarters,
        commonState:state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        planActions : bindActionCreators(planActions, dispatch),
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}



export default connect(mapStateToProps, buildActionDispatcher)(WorkPlanComponent);
