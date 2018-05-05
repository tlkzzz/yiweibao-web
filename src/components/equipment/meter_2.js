/** 
 * @Description 仪表台账--部件信息
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
            taskStepsLoading: false,
            materialsLoading: false,
            currentPage: 1,
            taskStepsEditData: '',
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

        // 部件信息表格字段
        this.taskStepsColumns = [
            {
                title: '抄表编码',
                dataIndex: 'code',
                key: 'code',
                sorter: true,
                render: defaultRender
            },
            {
                title: '单位',
                dataIndex: 'name',
                key: 'name',
                render: defaultRender
            },
            {
                title: '上次读数',
                dataIndex: 'locationName',
                key: 'locationName',
                sorter: true,
                render: defaultRender
            },
            {
                title: '上次抄表时间',
                dataIndex: 'duration',
                key: 'duration',
                sorter: true,
                render: defaultRender
            },
            {
                title: '本次读数',
                dataIndex: 'duration',
                key: 'duration',
                sorter: true,
                render: defaultRender
            },
            {
                title: '本次抄表时间',
                dataIndex: 'duration',
                key: 'duration',
                sorter: true,
                render: defaultRender
            },
            {
                title: '能源价格',
                dataIndex: 'duration',
                key: 'duration',
                sorter: true,
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                sorter: true,
                render: defaultRender
            },
        ];

        this.taskParam = {
            id: localStorage.meterId,
            pageNum: 1,
            pageSize: 998,
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
    // 设备设施结构
    taskGetList = () => {
        const { actions } = this.props;
        this.setState({
            taskstepsLoading: true,
            materialsLoading: true
        });
        actions.technologyGetList(this.taskParam, () => {
            this.setState({
                taskstepsLoading: false,
                materialsLoading: false
            });
        });
    }

    componentWillMount () {
        this.taskGetList();
    }
    render () {
        const { state } = this.props;
        const list = state.technologyListData.list;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1']}>
                        <Panel header={<span className="label">抄表信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.taskstepsLoading}
                                pagination={{
                                    //showSizeChanger,
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={list}
                                columns={this.taskStepsColumns}
                                rowSelection={this.rowSelection}
                                bordered
                            />
                            <div className="panel-tools-right">
                                <Button type="primary" size="large">导出</Button>
                            </div>
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
