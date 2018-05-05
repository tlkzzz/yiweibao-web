/** 
 * @Description 施工进度
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {browserHistory } from 'react-router';
import {connect} from 'react-redux';
import actions from '../../actions/contract.js';
import {createForm} from 'rc-form';
import commonActions from '../../actions/common.js';

import {correspondenceJson} from '../../tools/';

import {Icon, Button, Table, Pagination, Collapse, Form, Input, Row, Col, Select, Radio, DatePicker, Menu} from 'antd';
const Panel = Collapse.Panel;

class ManageFourComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
            recordLoading: false,
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
        const { commonState } = this.props;

        // 工单记录表格字段
        this.recordColumns = [
            {
                title: '工单编号',
                dataIndex: 'workOrderNum',
                key: 'workOrderNum',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><a className="order-number" onClick={() => { this.jumpToMaintenance(record) }}>{text ? text : '-'}</a></p>
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
                title: '超时',
                dataIndex: 'udisww',
                key: 'udisww',
                sorter: true,
                render: (text, record, key) => {
                    let txt;
                    if (text === true) {
                        txt = '是'
                    }
                    else if (text === false) {
                        txt = '否'
                    }
                    else {
                        txt = '-'
                    }

                    return (
                        <p>{txt}</p>
                    )
                }
            },
            {
                title: '外委',
                dataIndex: 'executeWhetherTimeout',
                key: 'executeWhetherTimeout',
                sorter: true,
                render: (text, record, key) => {
                    let txt;
                    if (text === true) {
                        txt = '外委'
                    }
                    else if (text === false) {
                        txt = '非外委'
                    }
                    else {
                        txt = '-'
                    }

                    return (
                        <p>{txt}</p>
                    )
                }
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
                title: '提报时间',
                dataIndex: 'reportDate',
                key: 'reportDate',
                sorter: true,
                render: defaultRender
            },
        ];


        this.recordParam = {
            contractId: JSON.parse(localStorage.getItem('manage')).id,
            pageNum: 1,
            pageSize: 998,
            workType:['PM']
        }

        this.orderParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            pageNum: 1,
            pageSize: 10,
        };

        // 后端返回英文显示中文的对应数据
        this.workOrderCorrJson  = correspondenceJson.workOrder;
        this.localManage = JSON.parse(localStorage.getItem('manage'));

    }

    pageChange = () => {

    }
    // 任务分派列表（巡检项、所需物料）
    ManageMaintenanceOrderGetList = () => {
        const {actions} = this.props;
        this.setState({
            recordLoading: true,
        });
        actions.maintenanceOrderGetList(this.recordParam, () => {
            this.setState({
                recordLoading: false,
            });
        });
    }

    //跳转到维保工单详情页
    jumpToMaintenance = (record, isAdd) => {
        let status = record.status;
        status = this.workOrderCorrJson[status];

        let json = {};
        json.id = record.id;
        json.process = status.process;
        json.status = record.status;
        json.workOrderNum = record.workOrderNum;
        json.description = record.description;

        localStorage.setItem('workOrder', JSON.stringify(json));
        localStorage.setItem('LIST_PARAM', JSON.stringify(this.orderParam)); // localStorage 全大写加下划线命名 作为通用存储名
        browserHistory.push(`/maintenance/work_order/${status.path}`);
    }
    componentWillMount() {
        const {commonActions,commonState} = this.props;
        if (this.localManage) {
            this.ManageMaintenanceOrderGetList();
            this.setState({editable: false});
        }
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'woProjectType', 'WORK_PROJECT_TYPE');

    }

    render() {
        const {state, location} = this.props;

        const recordData = state.maintenanceOrderListData;
        const recordList = recordData.list;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">工单记录<Icon type="caret-down"/></span>} key="2"
                               style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.recordLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={recordList}
                                columns={this.recordColumns}
                                bordered
                            />
                        </Panel>
                    </Collapse>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        state: state.contract,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(ManageFourComponent);