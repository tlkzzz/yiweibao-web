/**
 * 维保保养-维保工单 
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {Link, browserHistory} from 'react-router';
import {connect} from 'react-redux';
import actions from '../../actions/matter_repair.js';
import PubSub  from 'pubsub-js';
import moment from 'moment';
import {pubTopic} from '../../tools/constant';
import Collection from '../../components/common/collection.js';
import Dropdown from '../../components/common/dropdown.js';
import BackList from '../../components/common/back_list.js';
import ListTools from '../../components/common/list_tools.js';
import commonActions from '../../actions/common.js';
import EAModal from '../../components/common/modal.js';
import StatusChangeForm from '../../components/common/statusChange.js';
import SendProcess from '../../components/common/send_process_util.js';
import MoreOperations from '../../components/common/more_operations.js';
import DetailsPagination from '../../components/common/details_pagination.js';
import {correspondenceJson,businessJson,filterArrByAttr,runActionsMethod } from '../../tools/';
import {Icon, Button,Form,Table, Pagination,Select, Menu,Input, Modal, DatePicker,message} from 'antd';
const confirm = Modal.confirm;
const Option = Select.Option;
const FormItem = Form.Item;

class DispatchComponent extends React.Component {
    constructor(props) {
        super(props);
        PubSub.subscribe(pubTopic.dispatchorder.BISPATCH_DISPATCH, this.getDispatch );
        this.state = {
            tableLoading: false,
            visibleProcess:false,
            currentPage: 1,
            selectedRowKeys: [],
            rowSelection: null, // 表格多选
            moreOperationsKey: '',
            operationAuthority:null,//权限
             list:{},
        }
        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        // 后端返回英文显示中文的对应数据
        this.dispatchOrderConfigJson  = correspondenceJson.dispatchOrder;
        //表格字段
        this.columns =[
            {
                title: '工单编号',
                dataIndex: 'tsoNumber',
                key: 'tsoNumber',
                render: (text, record, key) => {
                    return (
                        <p><a className="order-number" onClick={() => { this.jumpToDetail(record) }}>{text ? text : '-'}</a></p>
                    )
                }
            },
            {
                title: '商品/设备名称',
                dataIndex: 'tpName',
                key: 'tpName',
                sorter: true,
            },
            {
                title: '型号',
                dataIndex: 'specJsonValue',
                key: 'specJsonValue',
            },
            {
                title: '报修人',
                dataIndex: 'tmName',
                key: 'tmName',
            },{
                title: '联系电话',
                dataIndex: 'tcMobile',
                key: 'tcMobile',
                sorter: true,
            },
            {
                title: '联系地址',
                dataIndex: 'tcAddress',
                key: 'tcAddress',
            },
            {
                title: '提报时间',
                dataIndex: 'tsoAddDate',
                key: 'tsoAddDate',
                sorter: true,
            },
            {
                title: '状态',
                dataIndex: 'tsoStatus',
                key: 'tsoStatus',
                sorter: true,
                render: val => <span>{this.workOrder_state(val)}</span>
            },
            {
                title: '操作',
                dataIndex: '4',
                key: '4',
                width: 120,
                render: (text, record, key) => {
                    return (
                        <div className="table-icon-group">
                          {/**  <Collection
                                isCollect={record.collect}
                                onChange={checked => {
                                    this.collect(checked, record.tsoId);
                                }}
                            /> */}
                            {
                                record.tsoStatus == 1 ?
                                <Icon
                                    type="user-add"
                                    onClick={() => {
                                        this.showConfirm(record.tsoId, record.tsoNumber)
                                    }}
                                /> :
                                <Icon
                                    type="copy"
                                    onClick={() => {
                                        this.showConfirm(record.tsoId, record.tsoNumber)
                                    }}
                                /> 
                            }
                            
                        </div>
                    )
                }
            },
        ];
        //分页参数
        this.param = {
            pageNum: 1,
            pageSize: 10,
             tsoType : 1,//1:普通报修 2:售后报修
             tsoStatus : 1,//待派工
             keywords:'',
        };
    }

  workOrder_state=(e)=>{
          if(e==1){
            return '待派工'
        }else if(e==2){
            return '待确认'
        }else if(e==3){
            return '待维修'
        }else if(e==4){
            return '维修中'
        }else if(e==5){
            return '已维修'
        }else if(e==6){
            return '已支付'
        }else if(e==7){
            return '已完成'
        }

    }




    //详情页面跳转
    jumpToDetail = (record)=>{
        console.log(record)
         const {actions,state, commonState,location} = this.props;
         // this.listMoreOperations.cancel();
         //     localStorage.removeItem('dispatch');
         // browserHistory.push(`/matter_repair/dispatch/dispatch_tab`);
          browserHistory.push('/maintenance/work_order/dispatch_details');
          
    }






    //跳转
    jumpToTabPage = (record, address) => {
        const {actions,state, commonState} = this.props;
        localStorage.setItem('dispatchWorkOrder_edit', null);
        if(address==true){//增加界面

            localStorage.setItem('LIST_PARAM', JSON.stringify(this.param));
            browserHistory.push("/matter_repair/dispatch/");
            browserHistory.push("/matter_repair/dispatch/dispatch_tab1");
            localStorage.setItem('workOrderId', null);
            state.dispatchIsAdd=true;
            actions.updateDispatchWorkOrder(null);
          //  state.dispatchOrderInfo=null;
        }else{

            console.log(record);
            // state.dispatchIsAdd=false;
            // let json={};
            // json.id = record.workOrderId
            // let status = this.dispatchOrderConfigJson[record.workOrderStatus];
            // localStorage.setItem('workOrderId', record.workOrderId);
            // localStorage.setItem('dispatchWorkOrder', JSON.stringify(json));
            // localStorage.setItem('LIST_PARAM', JSON.stringify(this.param));
            // browserHistory.push("/matter_repair/dispatch/");
            // browserHistory.push(`/matter_repair/dispatch/dispatch_${status.path}`);
        }

    }
    // 表格事件-排序
    tableChange = (pagination, filters, sorter) => {
        if (sorter.order) {
            let sorterOrder = sorter.order;
            let endIndex = sorterOrder.indexOf('end');
            sorterOrder = sorterOrder.slice(0, endIndex);
            this.param.sorts = `${sorter.field} ${sorterOrder}`;
        } else {
            this.param.sorts = '';
        }

        this.getList();
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({currentPage: page});
        this.param.pageNum = page;
        this.getList();
    }
    // 获取列表数据
    getList = () => {
        const {actions, commonState} = this.props;
        // for (let attr in this.param) {
        //     if (this.param[attr] === null) {
        //         delete this.param[attr];
        //     }
        // }
        this.setState({tableLoading: true});
        // let param = {
        //     orgId: commonState.orgId,
        //     siteId: commonState.siteId,
        // }
        // param = {...this.param, ...param}
        // actions.dispatchWorkOrderGetList(param, () => {
        //     this.setState({tableLoading: false});
        // });
         actions.getWorkOrderList(this.param, (json) => {
         
            this.setState({ tableLoading: false,list:json.result });


            console.log(json);
        });
    }
    getDispatch=(msg, data)=>{
        if(data=="CLOSE"){
            this.dispatchModal.modalHide()
        }
    }
    //获取选中值
    tableSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }
    // 更多操作
    moreClick = (e) => {
        const {state} = this.props;
        let rows=this.state.selectedRowKeys;
        if (e=== '0') { //变更状态

            this.statusChangeModal.modalShow();
        }
        if (e=== '1') { //批量删除
            this.showConfirm(rows);
        }
        if (e === '2') {
            if (Array.isArray(rows) && !rows.length) {
                message.error('请选择要派工的数据。')
            } else {
                confirm({
                    title: `是否将选中的 ${(rows.length + '条数据进行派工处理')}?`,
                    okText: '批量派工',
                    onOk: () => {
                        if (Array.isArray(rows)) rows = rows.join(',')
                        state.dispatchId=rows;
                        this.dispatchModal.modalShow();
                    }
                });
            }
        }
    }
    //部门转换
    getdeptSelect=(text)=>{
        const {commonState} = this.props;
        const   departmentList = commonState.departmentList ;
        for (let attr in departmentList) {
            if(departmentList[attr].value==text){
                return departmentList[attr].description;
            }
        }
    }
    //状态转换
    getdeptStatusSelect=(text)=>{
        const {commonState} = this.props;
        const   departmentList = commonState.dispatchOrderState;
        for (let attr in departmentList) {
            if(departmentList[attr].value==text){
                return departmentList[attr].description;
            }
        }
      //  return text;
    }
    //需求部门
    getoptions=()=>{
        const {commonActions, commonState} = this.props;
        const   departmentList = commonState.departmentList ;

        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        if(departmentList.length==0){
            commonActions.getDomainValue(domainValueParam, 'department','DEPARTMENT_GET_LIST');
        }
    }
    //状态
    getStatusData=()=>{
        const {commonActions, commonState} = this.props;
        const   departmentList = commonState.dispatchOrderState ;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        if(departmentList.length==0){
            commonActions.getDomainValue(domainValueParam, 'dispatchOrder','DISPATCH_ORDER');
        }
    }
    // 列表删除
    del = (id,type) => {
        const {actions} = this.props;
        let param = {ids: id};
        actions.dispatchWorkOrderDel(param, (json) => {
            if (json.success) {
                this.state.selectedRowKeys = [];
                message.success(json.msg);
                this.getList()

                if(type){
                    this.jumpToTabPage("",true);//详细页删，重新跳转为新建数据
                }
            } else {
                message.error(json.msg);
            }
        });
    }
    // 删除确认
    showConfirm = (id, text,type) => {
        if (Array.isArray(id) && !id.length) {
            message.error('请选择要删除的数据。')
        } else {
            confirm({
                title: `删除 ${text ? text : (id.length + '条数据')}?`,
                okText: '删除',
                onOk: () => {
                    if (Array.isArray(id)) {
                        id = id.join(',')
                    }
                    this.del(id,type);

                }
            });
        }
    }
    //收藏
    collectOrder = (key, data) => {
        const { actions } = this.props;
        let param = {
            ids: [data.workOrderId]
        };
        if (key) {
            runActionsMethod(actions, 'dispatchWorkOrderCollect', param);
        } else {
            runActionsMethod(actions, 'dispatchWorkOrderCollectCancel', param);
        }
    };
    //发送流程弹框显示
    sendProcessShow = () => {
        const {commonState} = this.props;
        let IsOperationAuthority=false

        if(this.state.operationAuthority!=null){
            let p= this.state.operationAuthority.split(",");
            for(let att in p){
                if(p[att]==commonState.personId) {
                    this.setState({ visibleProcess: true });
                    IsOperationAuthority=true;
                    break;
                }
            }
        }

          if(!IsOperationAuthority){
              message.warning('无权限操作此工单流程节点');
          }




    }
    sendProcessHide = () => {
        this.setState({ visibleProcess: false });
    };
    //获取执行记录
    getExecutionRecord=(processInstanceId)=>{
        let  param = { processInstanceId: processInstanceId}
        const {actions,commonActions} = this.props;
        commonActions.getProcessExecutionRecord(param, (json) => {
        });

    }
    sendProcess = (data) => {
        const {children, state, commonState,actions} = this.props;
        const  dispatchOrderInfo=  state.dispatchOrderInfo;
        for (let attr in dispatchOrderInfo) {
                if (dispatchOrderInfo[attr] === null) {
                    delete dispatchOrderInfo[attr];
                } else if (dispatchOrderInfo[attr] instanceof moment) {
                    dispatchOrderInfo[attr] = moment(dispatchOrderInfo[attr]).format('YYYY-MM-DD HH:mm:ss');
                }
            }
            let  param={
                ...dispatchOrderInfo,
                processDescription:data.description,
                processStatus:data.flow
            }

           // actions.getFormValues(true);

        actions.dispatchWorkOrderCommit(param,(json)=>{

            this.sendProcessHide()
            if(json.success){
                if ( json.data && json.data.processInstanceId) {
                    let status = this.dispatchOrderConfigJson[dispatchOrderInfo.workOrderStatus];
                    if(dispatchOrderInfo.workOrderStatus!="DTB"){
                        if(dispatchOrderInfo.workOrderStatus=="DYS"){
                            message.success("验收完成，任务关闭!")
                        }else{
                            message.success(status.msg+"成功")
                        }
                    }else{
                        message.warn('流程启动成功！');
                    }
                    param = {id: dispatchOrderInfo.workOrderId};
                    actions.dispatchOrderInfo(param, (json) => {
                        localStorage.setItem('dispatchWorkOrder_edit', JSON.stringify(json));
                        localStorage.setItem('dispatchWorkOrder_edit_flag', false);
                        if(json!=null&&json.processInstanceId!=null){
                            this.getExecutionRecord(json.processInstanceId);
                        }
                        if(json!=null){
                             status = this.dispatchOrderConfigJson[json.workOrderStatus];
                            browserHistory.push(`/matter_repair/dispatch/dispatch_${status.path}`);
                        }
                    });
                }
            }else{

                message.error(msg.msg);
            }
            // if ( json.data && json.data.processInstanceId) {
            //
            //
            //
            //     if(dispatchOrderInfo.workOrderStatus!="DTB"){
            //         message.success("流程提交成功")
            //     }else{
            //         message.warn('流程启动成功！');
            //     }
            //     param = {id: dispatchOrderInfo.workOrderId};
            //     actions.dispatchOrderInfo(param, (json) => {
            //         if(json!=null&&json.processInstanceId!=null){
            //             this.getExecutionRecord(json.processInstanceId);
            //         }
            //           //  processInstanceId
            //     });
            //
            //     } else {
            //         message.error(msg.msg);
            //     this.sendProcessHide()
            //     }
        })
    };
    //表单数据保存
    handleSubmint = () => {
         const { actions } = this.props;
        actions.getFormValues(true);
    }

    //变更状态
    statusChange = () => {

         const { actions, location } = this.props
         const values = this.statusChangeForm.props.form.getFieldsValue();
         const pathname = location.pathname;
         const isDetailsPage = pathname.indexOf('tab') !== -1;
        const workOrderId = localStorage.getItem('workOrderId');
        //
        // if (isDetailsPage) localStorageWorkOrder.status = values.status;
        //
        let ids=isDetailsPage ? [workOrderId] : this.state.selectedRowKeys;

        let param = {
            ids: ids,
            status: values.status,
            description: values.description,
        }
        actions.statusChange(param, (json) => {
            if (json.success) {
                message.success( json.msg);
            } else {
                message.error( json.msg);
            }
            if (isDetailsPage) {
                param = {id: ids};
                actions.dispatchOrderInfo(param, (json) => {
                });
            } else {
                this.setState({ selectedRowKeys: [] });
                this.getList();
            }
            this.statusChangeModal.modalHide();
        });

    }
    // 模糊查询
    fuzzyQuery = (keywords) => {
        this.param.keywords = keywords;
        this.getList();
    }
    saveDispatch=()=>{
        PubSub.publish(pubTopic.dispatchorder.BISPATCH_DISPATCH, 'SAVE' );
    }
    //显示收藏和显示全部
    toFirstPage = () => {
        this.setState({ currentPage: 1 });
        this.param.pageNum = 1;
    };
    // 详情页更多操作
    detailsMoreClick = (key) => {
        if (key === '0') {
            this.statusChangeModal.modalShow();
        }
        if (key === '1') { // 详情页删除
            const {children, state, commonState,commonActions} = this.props;
            const workOrderId = localStorage.getItem('workOrderId');
            this.showConfirm(workOrderId,state.dispatchOrderInfo.workOrderNum,true)
        }
    }


    componentWillMount() {
        this.getList();
        //this.getoptions()
       // this.getStatusData();
    }

    render() {
        const {children, state, commonState,commonActions,location} = this.props;
       // const data = state.dispatchWorkOrderListData;
        // const list = data.list;
       const list = this.state.list;

        const  dispatchWorkOrderInfo= state.dispatchOrderInfo

        const statusData = state.workOrderStatusData,
            typeData = state.workOrderTypeData,
           dispatchIsAdd=state.dispatchIsAdd;
        //
        const workOrderStatus = statusData==null?[]:statusData.list,
            workOrderType = typeData==null?[]:typeData.list;

        // 高级筛选选项数据
        const seniorFilterSelectArr = [
            workOrderStatus,
            workOrderType,
        ];
        const rowSelection = this.state.rowSelection ?
            {
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: this.tableSelectChange,
                getCheckboxProps: record => {

                    let disabled = false;
                    if (this.state.moreOperationsKey === '0') {//更改状态
                        disabled = record.workOrderStatus == 'QX'||record.workOrderStatus == 'GB';
                    }
                    else if (this.state.moreOperationsKey == '2') { //
                        disabled = record.workOrderStatus != 'DTB';
                    }
                    return { disabled }
                }
            } :
            null;
        const entity = state.dispatchOrderInfo;
        const code = commonState.codeEntity;
        let  edit=false;
      let workOrderIdSign=localStorage.getItem('workOrderIdSign');
        if(entity==null){
            edit=true;
        }else{
            if(entity.workOrderStatus!=workOrderIdSign){
                edit=true;
            }
            if(entity.workOrderStatus=="GB"||entity.workOrderStatus=="QX"){
                edit=true;
            }
        }
        if(entity){
            entity.workOrderStatusDescription=this.getdeptStatusSelect(entity.workOrderStatus);
        }
        let processDatOption=state.processDatOption;//流程选项说明数据
        let IsDropdown=!dispatchIsAdd&&((entity && entity.workOrderStatus!= 'QX'&&entity.workOrderStatus!= 'GB' )||(entity && entity.workOrderStatus === 'DTB' ));
        const NewStatusChange = (
            <EAModal
                title="变更状态"
                ref={statusChangeModal => this.statusChangeModal = statusChangeModal}
                afterClose={() => {
                    this.statusChangeForm.props.form.resetFields()
                }}
            >
                <StatusChangeForm
                    statusData={commonState.dispatchOrderState}
                    wrappedComponentRef={statusChangeForm => this.statusChangeForm = statusChangeForm}
                />
                <div className="modal-footer clearfix">
                    <Button size="large" onClick={() => {this.statusChangeModal.modalHide()}}>取消</Button>
                    <Button type="primary" size="large" onClick={this.statusChange}>确定</Button>
                </div>
            </EAModal>
        )

      

        return  (
                <div>
                    <div className="top-bar clearfix">
                        <ListTools
                            title="派工工单"
                            commonState={commonState}
                            commonActions={commonActions}
                            collection
                            seniorFilter = {{
                                data: [
                                    {
                                        type: 'DOMAIN_VALUE',
                                        key: 'dispatchOrderState',
                                        label: '工单状态',
                                        actionsType: 'DISPATCH_ORDER',
                                        actionsParam: 'dispatchOrder',
                                    },
                                    {
                                        type: 'DOMAIN_VALUE',
                                        key: 'departmentList',
                                        label: '需求部门',
                                        actionsType: 'DEPARTMENT_GET_LIST',
                                        actionsParam: 'department',

                                    },
                                    {
                                        type: 'SELECT_PERSON',
                                        key: 'reportPersonId',
                                        label: '提报人',
                                    },
                                    {
                                        type: 'SELECT_PERSON',
                                        key: 'actualExecutionPersonId',
                                        label: '实际执行人',
                                    },
                                    {
                                        type: 'SELECT_PERSON',
                                        key: 'acceptPersonId',
                                        label: '验收人',
                                    },
                                    {
                                        type: 'SELECT_TIME',
                                        key: 'acceptTime',
                                        label: '验收时间',
                                    },{
                                        type: 'SELECT_TIME',
                                        key: 'reportDate',
                                        label: '提报时间',
                                    }
                                ],
                                onOk: result => {



                                    this.param.workOrderStatus  = filterArrByAttr(result[0] && result[0].data || [], 'value');

                                    this.param.demandDept = filterArrByAttr(result[1] && result[1].data || [], 'value');

                                    this.param.reportPersonId = filterArrByAttr(result[2] && result[2].data || [], 'id');

                                    this.param.actualExecutionPersonId = filterArrByAttr(result[3] && result[3].data || [], 'id');

                                    this.param.acceptPersonId = filterArrByAttr(result[4] && result[4].data || [], 'id');



                                    this.param.acceptTimeBegin = result[5] && result[5].data[0] || null;

                                    this.param.acceptTimeEnd = result[5] && result[5].data[1] || null;


                                    this.param.reportDateBegin = result[6] && result[6].data[0] || null;

                                    this.param.reportDateEnd = result[6] && result[6].data[1] || null;

                                    this.getList();
                                }
                            }}
                            onEnter={(text) => {
                                this.fuzzyQuery(text);
                            }}
                            collectionChange={(checked) => {
                                this.toFirstPage();
                                this.param.collect = checked;
                                this.getList();
                            }}
                            conditionList={seniorFilterSelectArr}
                        />
                        <div className="list-tools-right pull-right">
                            <Pagination
                                total={list.pageCount}
                                className="pull-left"
                                defaultPageSize={this.param.pageSize}
                                current={this.state.currentPage}
                                onChange={this.pageChange}
                            />
                            <MoreOperations
                                style={{float: 'left'}}
                                menuData={[
                                    {
                                     icon: 'edit',
                                     text: '变更状态',
                                     confirmText: '确认变更'
                                     },

                                    {
                                        divider: 'divider'
                                    },
                                    {
                                        icon: 'delete',
                                        text: '批量删除',
                                        confirmText: '确认删除'
                                    }
                                ]}
                                onChange={(key, showCheckbox) => {
                                    let rowSelection;

                                    if (showCheckbox) {
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
                                    this.moreClick(key, hideCheckBox);
                                }}
                            />
                            <Button type="primary" size="large" onClick={() => { this.jumpToTabPage('', true) }}>新建</Button>
                            {/*<Button type="primary" size="large"><Link to="/matter_repair/dispatch/dispatch_tab1">新建</Link></Button>*/}
                        </div>
                    </div>
                    <div className="eam-content">
                        <div className="eam-content-inner">
                            <Table
                                rowKey="tsoId"
                                loading={this.state.tableLoading}
                                pagination={false}
                                dataSource={list.rows}
                                columns={this.columns}
                                rowSelection={rowSelection}
                                bordered
                                onChange={this.tableChange}
                            />
                            <Pagination
                                total={list.pageCount}
                                showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                                current={this.state.currentPage}
                                showQuickJumper
                                onChange={this.pageChange}
                            />
                        </div>
                    </div>
                    <EAModal
                        title={'派工单'}
                        ref={dispatchModal => this.dispatchModal = dispatchModal}
                        afterClose={() => { this.dispatchModal.modalHide() }}
                    >
                        < DispatchStepsForm  props={this.props} />
                        <div className="modal-footer clearfix">
                            <Button size="large" onClick={() => { this.dispatchModal.modalHide() }}>取消</Button>
                            <Button type="primary" size="large" onClick={this.saveDispatch}>确定</Button>
                        </div>
                    </EAModal>
                    {NewStatusChange}
                </div>
            )
    }
}

// 派工单
class dispatchFormComponent extends React.Component {
    constructor(props) {
        super(props);

        //订阅父页面的消息
        PubSub.subscribe(pubTopic.dispatchorder.BISPATCH_DISPATCH, this.saveDispatch1 );
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
        console.info(msg);
        console.info(data);
        console.info("接收数据");
        const {commonActions,commonState,State} = this.props.props;
        // this.dispatchModal.modalHide()

        if(data=="SAVE"){
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    PubSub.publish(pubTopic.dispatchorder.BISPATCH_DISPATCH, 'CLOSE' );
                    message.success("后端接口开发中。。。。");
                    console.info(values);
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
        const dispatchId= state.dispatchId;

        return (
            <Form>
                /**
                 * 隐藏值
                 */
                {
                    getFieldDecorator('dispatchId', {
                        initialValue: dispatchId
                    })(
                        // <Input type="hidden" />
                        <Input  />
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
                        getFieldDecorator('taskDuration', {
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

function mapStateToProps(state) {
    return {
        state: state.matter_repair,
        commonState: state.common,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(DispatchComponent);