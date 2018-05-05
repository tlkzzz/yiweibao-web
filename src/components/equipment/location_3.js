/** 
 * @Description 位置体系-维保记录
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions/equipment.js';

import Dropdown from '../../components/common/dropdown.js';
import NumInp from '../../components/common/num_inp.js';

import { Icon, Button, Table, Pagination, Collapse, Form, Input, Row, Col, Select, DatePicker, Menu, Timeline } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;

import moment from 'moment';

class WorkOrderTwoComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            locationMaintenanceLoading: false,
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

        // 表格字段
        this.locationMaintenanceColumns = [
            {
                title: '工单编码',
                dataIndex: 'workOrderNum',
                key: 'workOrderNum',
                render: defaultRender
            },
            {
                title: '工单描述',
                dataIndex: 'description',
                key: 'description',
                render: defaultRender
            },
            {
                title: '位置描述',
                dataIndex: 'locationDesc',
                key: 'locationDesc',
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
            },
            {
                title: '状态日期',
                dataIndex: 'reportDate',
                key: 'reportDate',
            }
        ];

        this.taskParam = {
            id: localStorage.locationId,
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
    // 设备设施结构
    locationMaintenanceGetList = () => {
        const { actions,location } = this.props;
        this.setState({
            locationMaintenanceLoading: true,
        });
        const isAdd = location.query.add_location;
        const id = isAdd ? '' : (JSON.parse(localStorage.getItem('locations')).id);

        if (id) {
            const taskParam = {
                id: id,
                pageNum: 1,
                pageSize: 10,
            }
            actions.locationMaintenanceGetList(taskParam, () => {
                this.setState({
                    locationMaintenanceLoading: false,
                });
            });
        } else {
            this.setState({
                locationMaintenanceLoading: false,
            });
        }
    }

    componentWillMount () {
        this.locationMaintenanceGetList();
    }
    render () {
        const { state, location } = this.props;
        const list = state.locationMaintenanceListData ? state.locationMaintenanceListData.list : [];

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1']}>
                        <Panel header={<span className="label">维保信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.locationMaintenanceLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={list}
                                columns={this.locationMaintenanceColumns}
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
