/** 
 * @Description 施工进度
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux';
import actions from '../../actions/contract.js';
import commonActions from '../../actions/common.js';

import {createForm} from 'rc-form';
import {Icon, Button, Table, Pagination, Collapse, Form, Input, Row, Col, Select, Radio, DatePicker, Menu} from 'antd';
const Panel = Collapse.Panel;

class ManageThreeComponent extends React.Component {
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

        // 保养计划信息表格字段
        this.recordColumns = [
            {
                title: '编号',
                dataIndex: 'maintenancePlanNum',
                key: 'maintenancePlanNum',
                sorter: false,
                render: (text, record, key) => {
                    return (
                        <p><a className="order-number" onClick={() => {
                            this.jumpToMaintenance(record)
                        }}>{text ? text : '-'}</a></p>
                    )
                }
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                sorter: false,
                render: defaultRender
            },
            {
                title: '作业标准描述',
                dataIndex: 'jobStandardDesc',
                key: 'jobStandardDesc',
                render: defaultRender
            },
            {
                title: '工程类型',
                dataIndex: 'projectType',
                key: 'projectType',
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
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, record, key) => {
                    const arr = commonState.pmStatusData.filter((item, i) => {
                        return item.value == text;
                    });

                    return (
                        <p>{arr.length ? arr[0].description : '-'}</p>
                    )
                }
            },
            {
                title: '站点',
                dataIndex: 'siteName',
                key: 'siteName',
                render: defaultRender
            },
        ];
        const {location} = this.props;


        this.recordParam = {
            contractId: JSON.parse(localStorage.getItem('manage')).id,
            pageNum: 1,
            pageSize: 998,
        }
        this.localManage = JSON.parse(localStorage.getItem('manage'));
    }

    pageChange = () => {

    }

    //跳转到维保计划详情页
    jumpToMaintenance = (record, isAdd) => {
        let json = {};
        json.id = record.id;
        json.status = record.status;
        json.maintenancePlan = record.maintenancePlanNum;
        json.description = record.description;

        localStorage.setItem('maintenancePlan', JSON.stringify(json));
        browserHistory.push(`/maintenance/maintenance_plan/mp_tab_1`);
    }
    // 任务分派列表（巡检项、所需物料）
    manageMaintenancePlanGetList = () => {
        const {actions} = this.props;
        this.setState({
            recordLoading: true,
        });
        actions.maintenancePlanGetList(this.recordParam, () => {
            this.setState({
                recordLoading: false,
            });
        });
    }

    componentWillMount() {
        const {commonActions,commonState} = this.props;
        if (this.localManage) {
            this.manageMaintenancePlanGetList();
            this.setState({editable: false});
        }
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'pmStatus', 'PM_STATUS');
        commonActions.getDomainValue(domainValueParam, 'woProjectType', 'WORK_PROJECT_TYPE');
    }

    render() {
        const {state, location} = this.props;

        const recordData = state.maintenancePlanListData;
        const recordList = recordData.list;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">保养计划信息<Icon type="caret-down"/></span>} key="2"
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

export default connect(mapStateToProps, buildActionDispatcher)(ManageThreeComponent);