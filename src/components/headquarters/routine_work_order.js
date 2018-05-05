/** 
 * @Description 事务--工作单
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/headquarters.js';
import { Link, browserHistory } from 'react-router';
import commonActions from '../../actions/common.js';
import Dropdown from '../../components/common/dropdown.js';
import BackList from '../../components/common/back_list.js';
import ListTools from '../common/list_tools';
import SendProcess from '../../components/common/send_process_util.js';
import DetailsPagination from '../../components/common/details_pagination.js';
import MoreOperations from '../../components/common/more_operations.js';
import EAModal from '../../components/common/modal.js';
import StatusChangeForm from '../../components/common/statusChange.js';
import { businessJson } from '../../tools/';
import moment from 'moment';
import { Icon, Checkbox, Modal, Button, Table, Pagination, Menu,message } from 'antd';
const confirm = Modal.confirm;

class RoutineWorkOrderComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            visibleProcess:false,
            rowSelection: null, // 表格多选
            currentPage: 1,
            selectedRowKeys:[],
            moreOperationsKey:""
        }
        // //表格多选
        // this.rowSelection = {
        //     onChange: (selectedRowKeys, selectedRows) => {
        //         console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        //     },
        //     onSelect: (record, selected, selectedRows) => {
        //         console.log(record, selected, selectedRows);
        //     },
        //     onSelectAll: (selected, selectedRows, changeRows) => {
        //         console.log(selected, selectedRows, changeRows);
        //     },
        // };

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };
        //分页参数
        const {actions, commonState} = this.props;
        this.param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            pageNum: 1,
            pageSize: 10,
        };
        //表格字段
        this.columns = [
            {
                title: '任务编号',
                dataIndex: 'taskNum',
                key: 'taskNum',
                sorter: true,
                render: (text, record, key) => {
                      return (
                        <p><a className="order-number" onClick={() => { this.jumpToTabPage(record,"/headquarters/routine_work_order/routine_work_order_form") }}>{text ? text : '-'}</a></p>
                      )
                  }
            },
            {
                title: '任务描述',
                dataIndex: 'description',
                key: 'description',
                // sorter: (a, b) => {
                //     a.creater-b.creater
                // },
                render: defaultRender
            },
            {
                title: '创建时间',
                dataIndex: 'createDate',
                key: 'createDate',
                sorter: true,
                render: defaultRender
            },
            {
                title: '预计完成时间',
                dataIndex: 'estimateDate',
                key: 'estimateDate',
                sorter: true,
                render: defaultRender
            },
            {
                title: '执行单位',
                dataIndex: 'siteName',
                key: 'siteName',
                sorter: true,
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                sorter: true,
                render: (text, record, key) => {
                    text=this.getStatus(text);
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
                            {/*<Collection onChange={(record) => {*/}
                            {/*this.collectOrder()*/}
                            {/*}}/>*/}
                            {
                                record.status=='DTB'?(<Icon type="delete" onClick={() => {
                                        this.showConfirm(record.id, record.taskNum)
                                    }}/>):null

                            }

                        </div>
                    )
                }
            },
        ];
    }
    //跳转
    jumpToTabPage = (record, address) => {
        const { actions,state,location,commonState } = this.props;
        if(address==true){//增加界面
            actions.updateDailyTaskAddState(true);
            state.dailyTaskInfo=null;
            browserHistory.push("/headquarters/routine_work_order/");
            browserHistory.push("/headquarters/routine_work_order/routine_work_order_form");
            localStorage.setItem('dailyTaskId', null);

        }else{
            actions.updateDailyTaskAddState(false);
            let json = {};
            json.id = record.id; // *跳转前存相关数据 和列表页跳详情页做同样处理 (这个存储是必要的操作并且必须包含id)
            localStorage.setItem('dailyTaskId', record.id);
            localStorage.setItem('dailyTaskWork', JSON.stringify(json));
            localStorage.setItem('LIST_PARAM', JSON.stringify(this.param));
            browserHistory.push(address);
        }

    }
    // 表格事件---排序事件
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
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }

    // 获取列表数据
    getList = () => {
        const {actions, commonState} = this.props;
        this.setState({tableLoading: true});
        let param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
           // collect: '0',
        }
        param = {...this.param, ...param}
        actions.findDailyTaskPageList(param, () => {
            this.setState({tableLoading: false});
        });
    }

    // 模糊查询
    fuzzyQuery = (keywords) => {
        this.param.keyword = keywords;
        this.getList();
    }
    //获取选中值
    tableSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }
    // 更多操作
    moreClick = (e) => {
        console.log(e);
        if (e=== '0') { //批量更改状态
            this.statusChangeModal.modalShow();
        }
        if (e=== '1') { //批量删除
            this.showConfirm(this.state.selectedRowKeys)
        }

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
    // 列表删除
    del = (id,type) => {
        const {actions} = this.props;
        let param = {ids: id};
        actions.dailyTaskdelete(param, (json) => {
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
    sendProcessHide = () => {
        this.setState({ visibleProcess: false })
    }

    sendProcess = (data) => {
        const {children, state, commonState,actions} = this.props;
        const  dailyTaskInfo=  state.dailyTaskInfo;
        for (let attr in dailyTaskInfo) {
            if (dailyTaskInfo[attr] === null) {
                delete dailyTaskInfo[attr];
            } else if (dailyTaskInfo[attr] instanceof moment) {
                dailyTaskInfo[attr] = moment(dailyTaskInfo[attr]).format('YYYY-MM-DD HH:mm:ss');
            }
        }
        let  param={
            id:dailyTaskInfo.id,
            processDescription:data.description,
            processStatus:data.flow
        }
        actions.dailyTaskFlowCommit(param,(json)=>{
            if (json.success&&json.data!=undefined && json.data.processInstanceId!=null) {
                this.sendProcessHide();
                if(dailyTaskInfo.status!="DTB"){
                    message.success("流程提交成功")
                }else{
                    message.warn('流程启动成功！');
                }
                param = {id: json.data.id};
                actions.getDailyTaskDetail(param, (json) => {
                    if(json!=null&&json.data.processInstanceId!=null){
                        let  param = { processInstanceId: json.data.processInstanceId}
                        const {commonActions} = this.props;
                        commonActions.getProcessExecutionRecord(param, (json) => {
                        });
                    }
                });

            } else {
                this.sendProcessHide();
                message.error(json.msg);

            }
        })
    };

    //发送流程弹框显示
    sendProcessShow = () => {
        this.setState({ visibleProcess: true });
    }

    //表单数据保存
    handleSubmint = () => {
        const { actions } = this.props;
        actions.getFormValues(true);
    }
    //状态
    getStatusDate = () => {
        const {commonActions,commonState} = this.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'headquartersDaliyTask', 'DAILY_TASK_STATUS');//状态
    }   //变更状态
    statusChange = () => {

        const { actions, location } = this.props
        const values = this.statusChangeForm.props.form.getFieldsValue();
        const pathname = location.pathname;
        const isDetailsPage = pathname.indexOf('work_order_form') !== -1;
        const dailyTaskId = localStorage.getItem('dailyTaskId');
        //
        // if (isDetailsPage) localStorageWorkOrder.status = values.status;
        //
        let ids=isDetailsPage ? [dailyTaskId] : this.state.selectedRowKeys;

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
                actions.getDailyTaskDetail(param, (json) => {
                });
            } else {
                this.setState({ selectedRowKeys: [] });
                this.getList();
            }
            this.statusChangeModal.modalHide();
        });

    }
    // 详情页更多操作
    detailsMoreClick = (key) => {
        if (key === '0') {
            this.statusChangeModal.modalShow();
        }
        if (key === '1') { // 详情页删除
            const {children, state, commonState,commonActions} = this.props;
            const dailyTaskId = localStorage.getItem('dailyTaskId');
            this.showConfirm(dailyTaskId,state.dailyTaskInfo.taskNum)
        }
    }
    getStatus=(text)=>{
        const {actions, commonState,commonActions} = this.props.props;
        let status=commonState.dailyTaskState;

        if(status==null||status==undefined){
            const domainValueParam = {
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                prodId: 'EAM'
            }
            commonActions.getDomainValue(domainValueParam, 'headquartersDaliyTask', 'DAILY_TASK_STATUS');//状态
        }
        for (let attr in status) {
            if(status[attr].value==text){
                return status[attr].description;
            }
        }
    }

    getStatus=(text)=>{
    const {actions, commonState} = this.props;
    let status=commonState.dailyTaskState;
    for (let attr in status) {
        if(status[attr].value==text){
            return status[attr].description;
        }
    }
}
    componentWillMount () {
        this.getList();
        this.getStatusDate()
    }
    render () {
        const { children, state,commonState,location} = this.props;
        const data = state.dailyTaskList;
        const list = data.list;
        const entity = state.dailyTaskInfo;
        const code = commonState.codeEntity,
        dailyTaskIsAdd=state.dailyTaskIsAdd


        const rowSelection = this.state.rowSelection ?
            {
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: this.tableSelectChange,
                getCheckboxProps: record => {
                    let disabled = false;

                    if (this.state.moreOperationsKey == '0') {//更改状态

                    } else if (this.state.moreOperationsKey == '1') { //
                        disabled = record.status != 'DTB';
                    }
                    return { disabled }
                }
            } :
            null;
        const NewStatusChange = (
            <EAModal
                title="变更状态"
                ref={statusChangeModal => this.statusChangeModal = statusChangeModal}
                afterClose={() => {
                    this.statusChangeForm.props.form.resetFields()
                }}
            >
                <StatusChangeForm
                    statusData={commonState.dailyTaskState}
                    wrappedComponentRef={statusChangeForm => this.statusChangeForm = statusChangeForm}
                />
                <div className="modal-footer clearfix">
                    <Button size="large" onClick={() => {this.statusChangeModal.modalHide()}}>取消</Button>
                    <Button type="primary" size="large" onClick={this.statusChange}>确定</Button>
                </div>
            </EAModal>
        )



        let commitButionStatus=false;
        if(entity!=null){
        if(entity.status=="GB"||entity.status=="QX"){
            commitButionStatus=true;
        }
            let status=this.getStatus(entity.status);
            if(status!=undefined&&status!=null){
                entity.statusDescription=status;
            }

        }

        let IsDropdown=!dailyTaskIsAdd&&((entity && entity.status!= 'QX'&&entity.status!= 'GB')||(entity &&entity.status == 'DTB'));




        // 高级筛选选项数据
        const seniorFilterSelectArr = [
            [],
            [],
        ];
        return children ?
        (
            <div>
                <div className="top-bar clearfix">
                    <div className="details-title pull-left">
                        <h3>{entity ? entity.taskNum : code }</h3>
                        <span className="eam-tag">{entity ? entity.statusDescription: '待提报' }</span>
                        <p>{entity ? entity.description : '' }</p>
                    </div>
                    <div className="list-tools-right pull-right">
                        {
                            !dailyTaskIsAdd? <DetailsPagination
                                    state={state} // 此模块state
                                    listDataName="dailyTaskList" // 列表数据state名 -> data = state.workOrderListData
                                    localStorageName="dailyTaskWork" // onChang 方法内设置的存储名
                                    onChange={(record)=>{
                                        let json = {};
                                        json.id = record.id; // *跳转前存相关数据 和列表页跳详情页做同样处理 (这个存储是必要的操作并且必须包含id)
                                        browserHistory.push('/headquarters/');
                                        browserHistory.push(`/headquarters/routine_work_order/routine_work_order_form`);
                                        localStorage.setItem('workTaskId', record.id);
                                        localStorage.setItem('dailyTaskWork', JSON.stringify(json));
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
                            IsDropdown ?
                                <Dropdown
                                    overlay={(
                                        <Menu onClick={(e) => {this.detailsMoreClick(e.key)}}>
                                            {
                                                entity && entity.status!= 'QX'&&entity.status!= 'GB' ?
                                                    <Menu.Item key="0"><Icon type="edit" /> 变更状态</Menu.Item> :
                                                    null
                                            }
                                            {
                                                entity && entity.status === 'DTB' ?
                                                    <Menu.Item key="1"><Icon type="delete" /> 删除</Menu.Item> :
                                                    null
                                            }
                                        </Menu>
                                    )}
                                    trigger={['click']}
                                >
                                    更多操作
                                </Dropdown> :null
                        }
                        {
                            dailyTaskIsAdd ?
                                null :
                                <Button type="primary" size="large" onClick={() => { this.jumpToTabPage('', true) }}>新建</Button>
                        }

                        <BackList onClick={this.getList}  location={location}/>
                        <Button type="primary" size="large"  disabled={commitButionStatus}  onClick={this.sendProcessShow}>发送流程</Button>


                        {NewStatusChange}
                        <SendProcess
                            status={entity?entity.status:false}
                            visible={this.state.visibleProcess}
                            sendProcess={this.sendProcess}
                            processOptionExplain={state.processOptionExplain}
                            sendProcessHide={this.sendProcessHide}
                            processDescription={businessJson?businessJson.dailyTask?businessJson.dailyTask.dailyTaskProcess:null:null}
                            data={businessJson?businessJson.dailyTask?businessJson.dailyTask.dailyTaskStatus:null:null}
                        />
                    </div>
                    <div className="eam-tab-nav">
                        <div className="eam-proess-right">
                            <Button  size="large"   onClick={this.handleSubmint}>保存</Button>
                        </div>
                    </div>

                </div>
                {children}
            </div>
        ) :
        (
            <div>
                <div className="top-bar clearfix">
                    <ListTools
                        title="例行工作单"
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
                        <MoreOperations
                            style={{float: 'left'}}
                            menuData={[
                                {
                                    icon: 'edit',
                                    text: '变更状态',
                                    confirmText: '确认更改'
                                },
                                {
                                    icon: 'delete',
                                    text: '批量删除',
                                    confirmText: '批量删除'
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
                {NewStatusChange}
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        state: state.headquarters,
        commonState: state.common,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}
export default connect(mapStateToProps, buildActionDispatcher)(RoutineWorkOrderComponent);
