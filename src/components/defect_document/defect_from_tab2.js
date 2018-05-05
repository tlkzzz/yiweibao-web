/**  
 * @Description:
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions/defect_document.js';
import { correspondenceJson } from '../../tools/';

import { Icon, Button, Table, Pagination, message, Collapse, Form, Input, Row, Col, Select, DatePicker, Menu, Checkbox } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;

import moment from 'moment';

class defectRectificationComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            taskStepsLoading: false,
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
        const { commonState } = this.props;
        this.param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            pageNum: 1,
            pageSize: 10,
            defectDocumentId: this.localMaintenancePlan && JSON.parse(this.localMaintenancePlan).id,
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
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }
    // 整改关联列表
    getList = () => {
        const { actions } = this.props;
        this.setState({
            tableLoading: true,
        });

        actions.findPageDefectOrderByDefectDocumentId(this.param, () => {
            this.setState({
                tableLoading: false,
            });
        });
    }
    componentWillMount () {
        let id = localStorage.getItem('defectId');
        if (id != null&&id!="null") {
            this.param.defectDocumentId=id;
            this.getList();
        }

    }
    render () {
        const { state, commonState } = this.props;
        const data = state.workOrderByMPlanNumListData?state.workOrderByMPlanNumListData:[];
        const list = data.list?data.list:[];

        const defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        // 表格字段
        const columns = [
            {
                title: '工单编号',
                dataIndex: 'workOrderNum',
                key: 'workOrderNum',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><span className="order-number" >{text ? text : '-'}</span></p>
                    )
                }
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '缺陷单编号',
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
                title: '超时',
                dataIndex: '工程类型',
                key: 'udisww',
                sorter: true,
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p>{text ? correspondenceJson.workOrder[text].text : '-'}</p>
                    )
                }
            },
            {
                title: '状态',
                dataIndex: 'executeWhetherTimeout',
                key: 'executeWhetherTimeout',
                sorter: true,
                render: defaultRender
            },
            {
                title: '提交人',
                dataIndex: 'executeWhetherTimeout1',
                key: 'executeWhetherTimeout1',
                sorter: true,
                render: defaultRender
            },
            {
                title: '提报时间',
                dataIndex: 'reportDate',
                key: 'reportDate',
                sorter: true,
                render: defaultRender
            }
        ];

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1']}>
                        <Panel header={<span className="label">工单记录 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.tableLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={list}
                                columns={columns}
                                onChange={this.tableChange}
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
        state: state.defect_document,
        commonState: state.common,
    }
}
function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}
export default connect(mapStateToProps, buildActionDispatcher)(defectRectificationComponent);



