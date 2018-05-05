/** 
 * @Description 作业标准
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions/equipment.js';

import Dropdown from '../../components/common/dropdown.js';
import NumInp from '../../components/common/num_inp.js';
import Modal from '../../components/common/modal.js';

import { Icon, Button, Table, Pagination, Collapse, Form, Input, Row, Col, Select, DatePicker, Menu, Timeline } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;

import moment from 'moment';

class WorkOrderTwoComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            worksLoading: false,
            materialsLoading: false,
            currentPage: 1,
            worksEditData: '',
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

        this.recordDate = null;

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        // 作业标准表格字段
        this.worksColumns = [
            {
                title: '编码',
                dataIndex: 'jobStandardNum',
                key: 'jobStandardNum',
                render: (text, record, key) => {
                    return (
                        <p><span className="order-number" onClick={() => { this.jumpToWorkPlan(record) }}>{text ? text : '-'}</span></p>
                    )
                }
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                render: defaultRender
            },
            {
                title: '标准类型',
                dataIndex: 'standardTypeName',
                key: 'standardTypeName',
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: defaultRender
            },
            {
                title: '作业类型',
                dataIndex: 'jobTypeId',
                key: 'jobTypeId',
                render: defaultRender
            },
            {
                title: '站点',
                dataIndex: 'siteName',
                key: 'siteName',
                render: defaultRender
            },
        ];

        const { location } = this.props;

        const isAdd = location.query.add_asset;
        this.asset = localStorage.getItem('asset');

        this.taskParam = {
            id: isAdd ? '' : (this.asset && JSON.parse(this.asset).id),
            pageNum: 1,
            pageSize: 10,
        }
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }
    //表格多选
   rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },
    };

    jumpToWorkPlan = (record) => {
    		

        const { actions } = this.props;

        if (isAdd) {
            localStorage.removeItem('asset');

            //actions.jobPlanDetailsUpdateList('CLEAR_DATA'); //清除工单提报现有数据
            browserHistory.push('/maintenance/');
            browserHistory.push('/maintenance/job_plan/job_plan_details?add_Job_Plan=1');
        } else {
            let json = {};
            json.id = record.id;
            json.status = record.status;
            json.jobStandardNum = record.jobStandardNum;
            json.description = record.description;
            localStorage.setItem('LIST_PARAM', JSON.stringify(this.taskParam));
            localStorage.setItem('jobPlan', JSON.stringify(json));
            browserHistory.push(`/maintenance/job_plan/job_plan_details`);
        }
            browserHistory.push(`/maintenance/job_plan/job_plan_details`);
    		
        //browserHistory.push(`/maintenance/job_plan/job_plan_1`);
    }

    getList = () => {
        const { actions } = this.props;
        this.setState({
            worksLoading: true,
            materialsLoading: true
        });
        if (this.taskParam.id) {
            actions.worksGetList(this.taskParam, () => {
                this.setState({
                    worksLoading: false,
                    materialsLoading: false
                });
           });
       } else {
           this.setState({
               worksLoading: false,
               materialsLoading: false
           });
       }
    }

    componentWillMount () {
        this.getList();
    }
    render () {
        const { state, location } = this.props;

        const list = state.worksListData.list;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1']}>
                        <Panel header={<span className="label">作业标准 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.worksLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={list}
                                columns={this.worksColumns}
                                bordered
                            />
                        </Panel>
                    </Collapse>
                </div>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.equipment
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderTwoComponent);
