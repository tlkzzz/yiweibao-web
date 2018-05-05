/**
 * @Description 位置体系--关联设备设施到设备表
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions/equipment.js';
import commonActions from '../../actions/common';

import Dropdown from '../../components/common/dropdown.js';
import NumInp from '../../components/common/num_inp.js';

import { Icon, Button, Table, Pagination, Collapse, Form, Input, Row, Col, Select,  DatePicker, Menu, Timeline } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;

import moment from 'moment';

class WorkOrderTwoComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            assetLoading: false,
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
        this.assetColumns = [
            {
                title: '设备设施编码',
                dataIndex: 'code',
                key: 'code',
                render: defaultRender
            },
            {
                title: '设备设施名称',
                dataIndex: 'name',
                key: 'name',
                render: defaultRender
            },
            {
                title: '位置',
                dataIndex: 'locationName',
                key: 'locationName',
                render: defaultRender
            },
            {
                title: '所属部门',
                dataIndex: 'department',
                key: 'department',
                render: defaultRender
            },
            {
                title: '分类',
                dataIndex: 'classificationName',
                key: 'classificationName',
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: defaultRender
            },
            {
                title: '使用日期',
                dataIndex: 'useDate',
                key: 'useDate',
                sorter: true,
                render: defaultRender
            },
        ];

      const { commonState, location } = this.props;
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }
    // 关联
    assetGetList = () => {
        const { actions, location, commonState } = this.props;
        const isAdd = location.query.add_location;
        const id = isAdd ? '' : (JSON.parse(localStorage.getItem('locations')).id);
        this.setState({
            assetLoading: true,
        });
        if (id) {
            const taskParam = {
                locationId: id,
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                productArray: commonState.productArray,
                pageNum: 1,
                pageSize: 10,
            }
            actions.assetGetList(taskParam, () => {
                this.setState({
                    assetLoading: false,
                });
            });
        } else {
            this.setState({
                assetLoading: false,
            });
        }
    }

    componentWillMount () {
        this.assetGetList();
    }

    render () {
        const { state , commonState, location } = this.props;
        const assetList = state.assetListData;
        const list = assetList ? assetList.list : [];

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1']}>
                        <Panel header={<span className="label">设备设施信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.assetLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={list}
                                columns={this.assetColumns}
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
        state: state.equipment,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch)
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderTwoComponent);
