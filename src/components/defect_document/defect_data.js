/** 
 * @Description: 缺陷单列表
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import Dropdown from '../../components/common/dropdown.js';
import actions from '../../actions/defect_document.js';
import commonActions from '../../actions/common.js';

import Collection from '../../components/common/collection.js';
import MoreOperations from '../../components/common/more_operations.js';
import BackList from '../../components/common/back_list.js';
import ListTools from '../../components/common/list_tools.js';
import DetailsPagination from '../../components/common/details_pagination.js';
import { runActionsMethod, correspondenceJson,businessJson, filterArrByAttr } from '../../tools/';
import SendProcess from '../../components/common/send_process_util.js';
import EAModal from '../../components/common/modal.js';
import StatusChangeForm from '../../components/common/statusChange.js';
import moment from 'moment';
import { Icon, Button, Table, Pagination, Modal, Radio, Input, message,Menu } from 'antd';
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const { TextArea } = Input;



class WorkOrderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableLoading: false,
            currentPage: 1,
            visibleProcess:false,
            selectedRowKeys: [],
            rowSelection: null, // 表格多选
            moreOperationsKey: '',
            operationAuthority:null,//权限
        }
        const { commonState } = this.props;
        this.param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            pageNum: 1,
            pageSize: 10,
        };
        // // 后端返回英文显示中文的对应数据
        this.defectOrderJson  = correspondenceJson.defectOrder;
    }


    jumpToDetail = (record, isAdd) => {
        const { actions,state } = this.props;
        actions.updateDefectWorkOrder(null);
        if (isAdd) {
            localStorage.setItem('defectId', null);
            state.defectInfo=null;//清空数据
            actions.getAddState(true);
          //  state.defectIsAdd=true;
            state.defectIsEdit=true;
            browserHistory.push('/defect_document/defect_data/');
            localStorage.setItem('LIST_PARAM', JSON.stringify(this.param)); // localStorage 全大写加下划线命名 作为通用存储名
           browserHistory.push('/defect_document/defect_data/defect_from_tab1');
        } else {
             let json = {};
             json.id = record.id;
            actions.getAddState(false);
          //  state.getDefectIsAdd=false;
            localStorage.setItem('defectId', record.id);
             localStorage.setItem('defectInfo', JSON.stringify(json));
             localStorage.setItem('LIST_PARAM', JSON.stringify(this.param)); // localStorage 全大写加下划线命名 作为通用存储名
             browserHistory.push('/defect_document/defect_data/');
             browserHistory.push(`/defect_document/defect_data/defect_from_tab1`);
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
        this.setState({ currentPage: page });
        this.param.pageNum = page;
        this.getList();
    }

    // 获取列表数据
    getList = () => {
        const { actions } = this.props;
        this.setState({ tableLoading: true });
        actions.getdefectPageList(this.param, (json) => {
            this.setState({ tableLoading: false });
        });
    }
    // 列表删除
    del = (id,type) => {
        const { actions } = this.props;
        let param = {ids: id};
        runActionsMethod(actions, 'deleteDedect', param, () => {
            this.getList();
            if(type){
                this.jumpToTabPage("",true);//详细页删，重新跳转为新建数据
            }
        });
    }
    // 删除确认
    showConfirm = (id, arg,type) => {
        if (Array.isArray(id) && !id.length) {
            message.error('请选择要删除的数据。')
        } else {
            confirm({
                title: `删除 ${typeof arg !== 'function' ? arg : (id.length + '条数据')}?`,
                okText: '删除',
                onOk: () => {
                    if (Array.isArray(id)) id = id.join(',')
                    this.del(id,type);
                   // arg(); // 隐藏复选框
                }
            });
        }

    }

    // 模糊查询
    fuzzyQuery = (keywords) => {
        this.param.words = keywords;
        this.getList();
    }
    //表格选中
    tableSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    // 更多操作
    moreClick = (key, hideCheckBox) => {
        console.info(key);
        if (key === '0') { //更改状态
            this.statusChangeModal.modalShow();
        }
        if (key === '2') { //批量删除
            this.showConfirm(this.state.selectedRowKeys, hideCheckBox)
        }
    }
    // 保存工单
    defectSave = () => {
        const { actions } = this.props;
        actions.getFormValues(true);

    }
    // 数据是否加载完成 未完成不能点保存
    loadIsComplete = (curProcess, isAddWorkOrder) => {
        const { state, commonState } = this.props;
        let complete = false
        switch (curProcess) {
            case '1':
                break;
        }
        complete=true;

        return complete;
    }
    //显示收藏和显示全部
    toFirstPage = () => {
        this.setState({ currentPage: 1 });
        this.param.pageNum = 1;
    };
    //收藏
    collect = (key, data) => {
        const { actions } = this.props;
        let param = {
            ids: [data]
        };
        if (key) {
            runActionsMethod(actions, 'defectCollection', param);
        } else {
            runActionsMethod(actions, 'defectCancelCollection', param);
        }
    };
    //获取各种域值
    getDomain=()=>{
        const {actions, commonActions, state, commonState} =  this.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        const responsibility = commonState.responsibility//责任属性
        const importance = commonState.importance //重要程度
        const workProjectTypeData = commonState.workProjectTypeData//工程类型
        const defectDocumentStatus = commonState.defectDocumentStatus//缺陷单状态

        if (responsibility == null || !responsibility.length) {
            commonActions.getDomainValue(domainValueParam, 'responsibility', 'RESPONSIBILITY');//责任属性
        }
        if (importance == null || !importance.length) {
            commonActions.getDomainValue(domainValueParam, 'importance', 'IMPORTANCE');//重要程度
        }
        if (workProjectTypeData == null || !workProjectTypeData.length) {
            commonActions.getDomainValue(domainValueParam, 'woProjectType', 'WORK_PROJECT_TYPE');//工程类型
        }
        if (defectDocumentStatus == null || !defectDocumentStatus.length) {
            commonActions.getDomainValue(domainValueParam, 'defectDocumentStatus', 'DEFECT_DOCUMENT_STATUS');//状态
        }

    }
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
    getExecutionRecord = (processInstanceId) => {
        let param = {processInstanceId: processInstanceId}
        const {actions, commonActions} = this.props;
        commonActions.getProcessExecutionRecord(param, (json) => {

        });
    }
    sendProcess = (data) => {
        const {children, state, commonState,actions} = this.props;
        const  defectOrderInfo=  state.defectInfo;

        let  param={
            id:defectOrderInfo.id,
            description:data.description,
            processStatus:data.flow
        }
        actions.defectOrderCommit(param,(json)=>{

            let status = this.defectOrderJson[defectOrderInfo.status];
            if(json.success){
                this.sendProcessHide();
                if(json.data!="DDTB"){
                    if(defectOrderInfo.status=="DTQR"){
                        message.success("已确认流程提交成功，任务关闭!")
                    }else{
                        message.success(status.msg+"流程提交成功")
                    }

                }else{
                    message.warn('流程启动成功！');
                }
                param={
                    id:defectOrderInfo.id,
                }

                actions.getdefectInfoById(param, (json) => {
                    if(json){
                        localStorage.setItem('defectOrder_edit', JSON.stringify(json));
                        this.getExecutionRecord(json.processInstanceId)
                    }

                })

            }else{
                message.error(msg.msg);
                this.sendProcessHide()
            }
        })
    };
    // 详情页更多操作
    detailsMoreClick = (key) => {
        if (key === '0') {
            this.statusChangeModal.modalShow();
        }
        if (key === '1') { // 详情页删除
            const { children, state, commonState, commonActions,actions } = this.props;
            const defectId = JSON.parse(localStorage.getItem('defectId'));
            this.showConfirm(defectId,state.defectInfo.defectDocumentNum,null,true)
        }
    }
    //变更状态
    statusChange = () => {

        const { actions, location } = this.props
        const values = this.statusChangeForm.props.form.getFieldsValue();
        const pathname = location.pathname;
        const isDetailsPage = pathname.indexOf('tab') !== -1;
        const defectId = localStorage.getItem('defectId');
        let ids=isDetailsPage ? [defectId] : this.state.selectedRowKeys;
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
                this.jumpToDetail(null,true)
            } else {
                this.setState({ selectedRowKeys: [] });
                this.getList();
            }
            this.statusChangeModal.modalHide();
        });
    }

    componentWillMount () {
        this.getDomain();
        this.getList();
    }
    render () {

        const { children, state, commonState, commonActions,actions,location } = this.props;
        const defectPageList=state.defectPageList;
        const list=defectPageList.list;

        const code = commonState.codeEntity;
        const  defectInfo=state.defectInfo
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
            fontSize: 14
        };

        const rowSelection = this.state.rowSelection ?
            {
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: this.tableSelectChange,
                getCheckboxProps: record => {
                    let disabled = false;
                    // if (this.state.moreOperationsKey == '0') {//更改状态
                    //     disabled = false;
                    // }
                     if (this.state.moreOperationsKey == '2') { //
                        disabled = record.status != 'DDTB';
                    }
                    return { disabled }
                }
            } :
            null;
        const defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };
        if(defectInfo){
            let att =this.defectOrderJson[defectInfo.status];
            if(att){
                state.defectStatusDescription =att.text
            }
        }else{
            state.defectProcessButton=true;
            state.defectStatusDescription="待提报";
        }
        const defectStatusDescription= state.defectStatusDescription;
        const NewStatusChange = (
            <EAModal
                title="变更状态"
                ref={statusChangeModal => this.statusChangeModal = statusChangeModal}
                afterClose={() => {
                    this.statusChangeForm.props.form.resetFields()
                }}
            >
                <StatusChangeForm
                    statusData={commonState.defectDocumentStatus}
                    wrappedComponentRef={statusChangeForm => this.statusChangeForm = statusChangeForm}
                />
                <div className="modal-footer clearfix">
                    <Button size="large" onClick={() => {this.statusChangeModal.modalHide()}}>取消</Button>
                    <Button type="primary" size="large" onClick={this.statusChange}>确定</Button>
                </div>
            </EAModal>
        )
        //表格字段
        const columns = [
            {
                title: '工单编号',
                dataIndex: 'defectDocumentNum',
                key: 'defectDocumentNum ',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><a className="order-number" onClick={() => { this.jumpToDetail(record) }}>{text ? text : '-'}</a></p>
                    )
                }
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description ',
                sorter: true,
                render: defaultRender
            },
            {
                title: '工程类型',
                dataIndex: 'projectType',
                key: 'projectType',
                sorter: true,
                render: (text, record, key) => {
                    const arr = commonState.workProjectTypeData.filter((item, i) => {
                        return item.value == text;
                    });
                    return (
                        <p>{arr.length ? arr[0].description : '-'}</p>
                    )
                }
            },
            {
                title: '重要程度',
                dataIndex: 'importance',
                key: 'importance',
                sorter: true,
                render: (text, record, key) => {
                    const arr = commonState.importance.filter((item, i) => {
                        return item.value == text;
                    });
                    return (
                        <p>{arr.length ? arr[0].description : '-'}</p>
                    )
                }
            },
            {
                title: '责任属性',
                dataIndex: 'responsibility',
                key: 'responsibility',
                sorter: true,
                render: (text, record, key) => {
                    const arr = commonState.responsibility.filter((item, i) => {
                        return item.value == text;
                    });
                    return (
                        <p>{arr.length ? arr[0].description : '-'}</p>
                    )
                }
            },
            {
                title: '发现时间',
                dataIndex: 'findDate',
                key: 'findDate',
                sorter: true,
                defaultRender
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                sorter: true,
                render: (text, record, key) => {
                  const  arr = this.defectOrderJson[text];
                    return (
                        <p>{arr ? arr.text : '-'}</p>
                    )
                }
            },
            {
                title: '整改完成度',
                dataIndex: 'completeness',
                key: 'completeness',
                sorter: true,
                render: defaultRender
            },
            {
                title: '操作',
                dataIndex: '4',
                key: '4',
                width: 120,
                render: (text, record, key) => {
                    return (
                        <div className="table-icon-group">
                            <Collection
                                isCollect={record.collect}
                                onChange={checked => {
                                    this.collect(checked, record.id);
                                }}
                            />
                            {
                                record.status=="DDTB"?( <Icon
                                        type="delete"
                                        onClick={() => {
                                            this.showConfirm(record.id, record.defectDocumentNum)
                                        }}
                                    />):null
                            }

                        </div>
                    )
                }
            },
        ];
        const  defectIsAdd=state.defectIsAdd;//是否是新增
        let  edit=true;//可以见到发送流程
        if(!defectInfo||(defectInfo?defectInfo.status=="DTQR":null)){
            edit=false;
        }
        this.state.operationAuthority=null;//清空历史值

        let processOptionExplain=[];
        if(defectInfo!=null&&defectInfo.status=="DDTB"){
         processOptionExplain[0]=filterArrByAttr(commonState.getPersonByDomain, 'name').join(',');
            this.state.operationAuthority=defectInfo.createUser
        }else if(defectInfo!=null&&defectInfo.status=="DDQR"){
            processOptionExplain[0]=data.reportName;
            this.state.operationAuthority=filterArrByAttr(commonState.getPersonByDomain, 'name').join(',')
        }else if(defectInfo!=null&&defectInfo.status=="DTQR"){
          //  this.state.operationAuthority=defectInfo.

        }
        state.processOptionExplain=processOptionExplain;









        return children ?

            (
                <div>
                    <div className="top-bar clearfix">
                        <div className="details-title pull-left">
                           <h3>{defectInfo? defectInfo.defectDocumentNum:code}</h3>
                            <span className="eam-tag">{defectStatusDescription}</span>
                            <p>{defectInfo?defectInfo.description:""} </p>
                           </div>
                            {/*<h3>{this.loadIsComplete(curProcess, isAddWorkOrder) ? workOrderCode : <span><Icon type="loading" /> 数据加载中...</span>}</h3>*/}
                            {/*<span className="eam-tag">{this.loadIsComplete(curProcess, isAddWorkOrder) ? (localStorageWorkOrder && correspondenceJson.workOrder[localStorageWorkOrder.status].text) : null}</span>*/}
                            {/*<p>{this.loadIsComplete(curProcess, isAddWorkOrder) ? (localStorageWorkOrder && localStorageWorkOrder.description) : ''}</p>*/}
                        {/*</div>*/}
                            <div className="list-tools-right pull-right">
                                {
                                    defectIsAdd? null: <DetailsPagination
                                            state={state} // 此模块state
                                            listDataName="defectPageList" // 列表数据state名 -> data = state.workOrderListData
                                            localStorageName="defectInfo" // onChang 方法内设置的存储名
                                            onChange={(record)=>{
                                                let json = {};
                                                json.id = record.id;
                                                // *跳转前存相关数据 和列表页跳详情页做同样处理 (这个存储是必要的操作并且必须包含id)
                                                localStorage.setItem('defectId', record.id);
                                                localStorage.setItem('defectInfo', JSON.stringify(json));
                                                // *根据自己的模块做跳转/
                                                browserHistory.push('/defect_document/');
                                                browserHistory.push(`/defect_document/defect_data/defect_from_tab1`);
                                            }}
                                            getList={(pageNum, cb) => {
                                                // *分页是根据列表页数据切换数据 本业列表数据用完 这里请求上|下一页数据
                                                // *列表页跳详情页必须本地存储列表页请求数据参数 全局统一用LIST_PARAM 防止详情页刷新请求的数据与列表跳详情的数据不一致
                                                this.param = JSON.parse(localStorage.getItem('LIST_PARAM'));
                                                if (pageNum) this.param.pageNum = pageNum;
                                                this.getList(cb);
                                            }}
                                        />
                                }
                                {
                                    defectIsAdd ?
                                        null :
                                     <Dropdown
                                            overlay={(
                                                <Menu onClick={(e) => {this.detailsMoreClick(e.key)}}>

                                                            <Menu.Item key="0"><Icon type="edit" /> 变更状态</Menu.Item> :
                                                    {
                                                        defectInfo && defectInfo.status === 'DDTB' ?
                                                            <Menu.Item key="1"><Icon type="delete" /> 删除</Menu.Item> :
                                                            null
                                                    }
                                                </Menu>
                                            )}
                                            trigger={['click']}
                                        >
                                            更多操作
                                        </Dropdown>
                                }
                                {
                                  defectIsAdd ?
                                        null :
                                  <Button type="primary" size="large" onClick={() => { this.jumpToDetail('', true) }}>新建</Button>
                                }
                                <BackList  location={location} onClick={this.getList}/>
                                {
                                    (edit)?
                                        <Button className="pull-right" type="primary" size="large"   onClick={this.sendProcessShow}>发送流程</Button>
                                        :null
                                }

                            </div>
                        {NewStatusChange}
                        <div className="eam-tab-nav">
                            <Link activeClassName="active" to='/defect_document/defect_data/defect_from_tab1'><Icon type="check-circle-o" />缺陷明细</Link>
                            <Link activeClassName="active" to='/defect_document/defect_data/defect_from_tab2'><Icon type="check-circle-o" /> 整改关联</Link>
                            <div className="eam-proess-right">
                                <Button size="large"
                                    //  disabled={this.loadIsComplete(curProcess, isAddWorkOrder) ? false : true}
                                        onClick={this.defectSave}>保存</Button>
                                  </div>
                            {/*{*/}
                                {/*( defectIsAdd) ?*/}

                                    {/*<div className="eam-proess-right">*/}
                                        {/*<Button size="large"*/}
                                            {/*//  disabled={this.loadIsComplete(curProcess, isAddWorkOrder) ? false : true}*/}
                                                {/*onClick={this.defectSave}>保存</Button>*/}
                                    {/*</div>*/}
                                     {/*:*/}
                                    {/*null*/}
                            {/*}*/}
                            <SendProcess
                                status={defectInfo?defectInfo.status:false}
                                visible={this.state.visibleProcess}
                                sendProcess={this.sendProcess}
                                sendProcessHide={this.sendProcessHide}
                                processOptionExplain={state.processOptionExplain}
                                //processDescription={businessJson?businessJson.defect?businessJson.defect.d:null:null}
                                data={businessJson?businessJson.defect?businessJson.defect.defectStatus:null:null}
                            />
                        </div>
                    </div>
                    {children}
                </div>
            ) :
            (
                <div>
                    <div className="top-bar clearfix">
                        <ListTools
                            title="缺陷单"
                            commonState={commonState}
                            commonActions={commonActions}
                            listToolsComponentWillMount={this.listToolsComponentWillMount}
                            collectionChange={(checked) => {
                                this.toFirstPage();
                                this.param.collect = checked;
                                this.getList();
                            }}
                            seniorFilter = {{
                                data: [
                                    {
                                        type: 'DOMAIN_VALUE',
                                        key: 'defectDocumentStatus',
                                        label: '工单状态',
                                        actionsType: 'DEFECT_DOCUMENT_STATUS',
                                        actionsParam: 'defectDocumentStatus',
                                    },
                                    /*{
                                        type: 'DOMAIN_VALUE',
                                        key: 'woProjectType',
                                        label: '工程类型',
                                        actionsType: 'WORK_PROJECT_TYPE',
                                        actionsParam: 'woProjectType',
                                    },*/
                                    {
                                        type: 'DOMAIN_VALUE',
                                        key: 'importance',
                                        label: '重要程度',
                                        actionsType: 'IMPORTANCE',
                                        actionsParam: 'importance',

                                    },
                                    {
                                        type: 'DOMAIN_VALUE',
                                        key: 'responsibility',
                                        label: '责任属性',
                                        actionsType: 'RESPONSIBILITY',
                                        actionsParam: 'responsibility',

                                    },
                                    {
                                        type: 'SELECT_TIME',
                                        key: 'findDate',
                                        label: '发现时间',
                                    }
                                ],
                                onOk: result => {
                                    this.param.status   = filterArrByAttr(result[0] && result[0].data || [], 'value');
                                    this.param.projectType  = filterArrByAttr(result[1] && result[1].data || [], 'value');
                                    this.param.importance  = filterArrByAttr(result[2] && result[2].data || [], 'value');
                                    this.param.responsibility  = filterArrByAttr(result[3] && result[3].data || [], 'value');
                                    this.param.findStartDate = result[4] && result[4].data[0] || null;
                                    this.param.findEndDate  = result[5] && result[5].data[1] || null;
                                    this.getList();
                                }
                            }}
                            onEnter={(text) => {
                                this.fuzzyQuery(text);
                            }}
                        />
                        <div className="list-tools-right pull-right">
                            <Pagination
                                total={defectPageList.total}
                                className="pull-left"
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
                            <Button type="primary" size="large"><a onClick={() => { this.jumpToDetail('', true) }}>新建</a></Button>
                        </div>
                    </div>
                    <div className="eam-content">
                        <div className="eam-content-inner">
                            <Table
                                rowKey="id"
                                loading={this.state.tableLoading}
                                pagination={false}
                                dataSource={list}
                                columns={columns}
                                rowSelection={rowSelection}
                                bordered
                                onChange={this.tableChange}
                            />
                            <Pagination
                                total={defectPageList.total}
                                showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                                current={this.state.currentPage}
                                showQuickJumper
                                onChange={this.pageChange}
                            />
                            {NewStatusChange}
                        </div>
                    </div>
                </div>
            )
    }
}
function mapStateToProps (state) {
    return {
        state: state.defect_document,
        commonState: state.common,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderComponent);