/** 
 * @Description 总部事务--例行工作
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/headquarters.js';
import { Link, browserHistory } from 'react-router';
import moment from 'moment';
import DetailsPagination from '../../components/common/details_pagination.js';
import MoreOperations from '../../components/common/more_operations.js';
import Dropdown from '../../components/common/dropdown.js';
import BackList from '../../components/common/back_list.js';
import ListTools from '../common/list_tools';
import EAModal from '../../components/common/modal.js';
import commonActions from '../../actions/common.js';

import { Icon, Checkbox, Modal, Button, Table, Pagination, Menu,message,Select } from 'antd';
const confirm = Modal.confirm;
const Option = Select.Option;

class RoutineWorkComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
            rowSelection: null, // 表格多选
            tableLoading: false,
            selectedRowKeys: [],
            moreOperationsKey:""
        }
        

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };
        const {commonState} = this.props;
        //表格字段
        this.columns = [
            {
                title: '计划编号',
                dataIndex: 'planNum',
                key: 'planNum',
                sorter: true,
                render: (text, record, key) => {
                      return (
                        <p><a className="order-number" onClick={() => { this.jumpToTabPage(record) }}>{text ? text : '-'}</a></p>
                      )
                  }
            },
            {
                title: '名称',
                dataIndex: 'planName',
                key: 'planName',
                sorter: (a, b) => {
                    a.creater-b.creater
                },
                render: defaultRender
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
                dataIndex: 'siteName',
                key: 'siteName',
                sorter: true,
                render: defaultRender
            },
            {
                title: '执行频次',
                dataIndex: 'times',
                key: 'times',
                sorter: true,
                render: defaultRender
            },
            {
                title: '执行频率',
                dataIndex: 'frequency',
                key: 'frequency',
                sorter: true,
                render: (text, record, key) => {
                    text=this.gettimeFrequency(text);
                    return (
                        <p>{text ? text : '-'}</p>
                    )
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                sorter: true,
                render: (text, record, key) => {
                    text =   this.getStatus(text);
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

    // 列表删除
    del = (id) => {
        const { actions } = this.props;
        let param = {ids: id};
        actions.deleteDaily(param, (json) => {
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
    //跳转到详情页
    jumpToTabPage = (record) => {
        browserHistory.push(`/headquarters/routine_work/routine_work_form`);
        const { actions,state,location,commonState } = this.props;
        if(record != null){
            state.dailyWorkIsAdd=false
            let json = {};
            json.id = record.id; // *跳转前存相关数据 和列表页跳详情页做同样处理 (这个存储是必要的操作并且必须包含id)
            localStorage.setItem('workId', record.id);
            localStorage.setItem('dailyWork', JSON.stringify(json));
            localStorage.setItem('LIST_PARAM', JSON.stringify(this.param));
        }else{
            state.dailyWorkIsAdd=true;
            localStorage.setItem('workId', "");
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
    getStatus = (text) => {
        const {commonState} = this.props;
        const textName =  commonState.hqPlanType.map((item)=>{
            if(text==item.value){
                return item.description;
            }
        })
        return textName;
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
    gettimeFrequency=(text)=>{
        const {commonState} = this.props;
        const   timeFrequency = commonState.timeFrequency ;
        for (let attr in timeFrequency) {
            if(timeFrequency[attr].value==text){
                return timeFrequency[attr].description;
            }
        }
        return text;
    }

    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }

    // 获取列表数据
    getList = () => {
        const { actions,commonState ,commonActions} = this.props;
        this.setState({ tableLoading: true });
        actions.getDailyPage(this.param, () => {
            this.setState({ tableLoading: false });
        });

        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'workType', 'WORKTYPE');//工作类型
        commonActions.getDomainValue(domainValueParam, 'checkItem', 'CHECKITEM');//检查项
        commonActions.getDomainValue(domainValueParam, 'timeFrequency', 'GET_TIME_FREAUENCY');//频率单位
  
    }
    moreClick = (key, hideCheckBox) => {
        
        //修改状态
        if(key == '0'){
            var id = this.state.selectedRowKeys ? this.state.selectedRowKeys : [];
            if (Array.isArray(id) && !id.length) {
                message.error('请选择要修改状态的数据。')
            } else {
                this.allPropertyAddModal.modalShow();
            }
        }
        if (key === '1') { //批量删除
            this.showConfirm(this.state.selectedRowKeys ? this.state.selectedRowKeys : [])
        }
    }
    //表单数据保存
    handleSubmint = () => {
        const { actions,state,location,commonState } = this.props;
        actions.getFormValues(true);
       //actions.getFormValues(false);
        
       const pathname = location.pathname;
       clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if(pathname=='/headquarters/routine_work/routine_work_form'){
                const { state } = this.props;
                const FormValuesArr  = state.getFormValues;
                if(FormValuesArr!=false){
                    let param = Object.assign(FormValuesArr[0],FormValuesArr[1]) ;
                    param.startDate = (param.startDate || param.startDate != "Invalid date") ? moment(param.startDate).format('YYYY-MM-DD HH:mm:ss') : "";
                    param.validStartDate = (param.validStartDate || param.validStartDate != "Invalid date") ? moment(param.validStartDate).format('YYYY-MM-DD HH:mm:ss'):"";
                    param.validEndDate = (param.validEndDate || param.validEndDate != "Invalid date") ? moment(param.validEndDate).format('YYYY-MM-DD HH:mm:ss'):"";
                    param={
                        ...param,
                        orgId:commonState.orgId,
                        siteId:commonState.siteId

                    }
                    //   ;
                    actions.saveDailyDetail(param, (json) => {
                        if (json.success) {
                            message.success("保存成功");
                            // window.location.href = '/headquarters/routine_work';
                            this.getList();

                            let param = {id:json.data.id};
                            actions.getDailyDetail(param, (json) => {

                            });

                        } else {
                            message.error(json.msg);
                        }
                    });
                }
            }else{
                browserHistory.push('/material/inventory');
            }

        },0);
    }
    // 模糊查询
    fuzzyQuery = (keywords) => {
        this.param.words = keywords;
        this.getList();
    }

    componentWillMount () {
        this.getList();
        this.getHQWorkType();
    }
    //获取选中值
    tableSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }
    getHQWorkType = () => {
        const {commonState,commonActions} = this.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'HQWorkStatus', 'HQ_WORK_TYPE');//状态
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
        actions.upWorkStrtus(param, (json) => {
            if (json.success) {
                message.success(json.msg);
                this.getList();
            } else {
                message.error(json.msg);
            }
        });
        this.allPropertyAddModal.modalHide();
    }
    render () {
        const { children, state,commonState,location } = this.props;
        const  dailyDetail = state.dailyDetail,
         data = state.dailyListData, //*** 拿到请求返回的数据
         list = data.list||[],
         code = commonState.codeEntity ,
        dailyWorkIsAdd=state.dailyWorkIsAdd;

        const rowSelection = this.state.rowSelection ?
            {
                selectedRowKeys: this.state.selectedRowKeys,
                onChange: this.tableSelectChange,
                getCheckboxProps: record => {
                    let disabled = false;
    
                    if (this.state.moreOperationsKey == '1') {//删除
                        disabled = record.status =='activity'||record.status=='inactivity';
                    } 
                    return { disabled }
                }
            } :
            null;
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
                        <h3>{dailyDetail ? dailyDetail.planNum : code}</h3>
                        <span className="eam-tag">{dailyDetail ? dailyDetail.status=="false"?"不活动":"活动" : "草稿"}</span>
                        <p> <span>{dailyDetail ? dailyDetail.planName : ""}</span></p>
                    </div>
                    <div className="list-tools-right pull-right">
                        {
                            !dailyWorkIsAdd? <DetailsPagination
                                    state={state} // 此模块state
                                    listDataName="dailyListData" // 列表数据state名 -> data = state.workOrderListData
                                    localStorageName="dailyWork" // onChang 方法内设置的存储名
                                    onChange={(record)=>{
                                        let json = {};
                                        json.id = record.id; // *跳转前存相关数据 和列表页跳详情页做同样处理 (这个存储是必要的操作并且必须包含id)

                                        browserHistory.push('/headquarters/');
                                        browserHistory.push(`/headquarters/routine_work/routine_work_form`);
                                        localStorage.setItem('workId', record.id);
                                        localStorage.setItem('dailyWork', JSON.stringify(json));
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
                        <BackList location = {location}/>
                        <Button type="primary" size="large" onClick={this.handleSubmint}>保存</Button>
                    </div>
                </div>
                {children}
            </div>
        ) :
        (
            <div>
                <div className="top-bar clearfix">
                    <ListTools
                        title="例行工作"
                        onEnter={(text) => {
                            this.fuzzyQuery(text);
                        }}
                        conditionList={seniorFilterSelectArr}
                    />
                    <div className="list-tools-right pull-right">
                        <Pagination
                            total={50}
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
                                    confirmText: '选择状态'
                                },
                                /*{
                                    icon: 'setting',
                                    text: '批量导入',
                                    confirmText: '批量导入'
                                },*/
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
                    width={300}
                >
                    <Select 
                        onChange={this.statusSelectChange}
                        size="large" style={{ width: '100%' }} >
                        {
                            commonState.hqWorkType ? commonState.hqWorkType.map((item) => <Option value={item.value}>{item.description}</Option>) : []
                        }
                    </Select>
                    <div className="modal-footer clearfix">
                        
                        <Button size="large" onClick={() => { this.allPropertyAddModal.modalHide() }}>取消</Button>
                        <Button type="primary" size="large" onClick={this.allPropertyAddSave}>确定</Button>
                    </div>
                </EAModal>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.headquarters,
        commonState:state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(RoutineWorkComponent);
