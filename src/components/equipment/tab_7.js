/** 
 * @Description 维保记录
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
            recordsLoading: false,
            currentPage: 1,
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

        // 维保记录表格字段
        this.recordsColumns = [
            {
                title: '工单编码',
                dataIndex: 'workOrderNum',
                key: 'workOrderNum',
                render: defaultRender
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                render: defaultRender
            },
            {
                title: '创建时间',
                dataIndex: 'reportDate',
                key: 'reportDate',
                render: defaultRender
            },
            {
                title: '完成时间',
                dataIndex: 'actualEndDate',
                key: 'actualEndDate',
                render: defaultRender
            },
            {
                title: '工单类型',
                dataIndex: 'worktype',
                key: 'worktype',
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: defaultRender
            }
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


    getList = () => {
        const { actions } = this.props;
        this.setState({
            recordsLoading: true,
        });
        if (this.taskParam.id) {
            actions.recordsGetList(this.taskParam, () => {
                this.setState({
                    recordsLoading: false,
                });
            });
        } else {
            this.setState({
                recordsLoading: false,
            });
        }
    }

    componentWillMount () {
        this.getList();
    }
    render () {
        const { state, location } = this.props;

        const taskData = state.recordsListData;
        const list = taskData.list;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1']}>
                        <Panel header={<span className="label">维保记录 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.recordsLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={list}
                                columns={this.recordsColumns}
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
