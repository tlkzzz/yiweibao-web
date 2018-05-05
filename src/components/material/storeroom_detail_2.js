import React from 'react';
import {bindActionCreators} from 'redux';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import actions from '../../actions/material.js';

import Dropdown from '../../components/common/dropdown.js';

import {Icon, Button, Table, Pagination, Collapse, Form, Input, Row, Col, Select, Radio, Checkbox, Menu} from 'antd';
const Panel = Collapse.Panel;

class ItemDetailComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
            tableLoading: false,
        }


        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

        this.param = {}


        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        //表格字段
        this.columns = [
            {
                title: '物资编码',
                dataIndex: 'itemNum',
                key: 'itemNum',
                sorter: true,
                render: defaultRender
            },
            {
                title: '物资描述',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '当前余量',
                dataIndex: 'currentBalance',
                key: 'currentBalance',
                sorter: true,
                render: defaultRender
            },
            {
                title: '标准成本',
                dataIndex: 'standardCost',
                key: 'standardCost',
                sorter: true,
                render: defaultRender
            },
            {
                title: '平均成本',
                dataIndex: 'averageCost',
                key: 'averageCost',
                sorter: true,
                render: defaultRender
            },
            {
                title: '上次接收成本',
                dataIndex: 'lastReceiveCost',
                key: 'lastReceiveCost',
                sorter: true,
                render: defaultRender
            },
            {
                title: '站点',
                dataIndex: 'siteName',
                key: 'siteName',
                sorter: true,
                render: defaultRender
            },
        ];

    }

    //根据id查询实体
    findInventorysByStoreroomId = () => {
        let id = this.props.location.query.id;
        const {actions,commonState} = this.props;
        const param = {pageNum: 0, pageSize: 10, id: id,siteId:commonState.siteId,orgId:commonState.orgId};
        this.setState({tableLoading: true});
        actions.findInventorysByStoreroomId(param, () => {
            this.setState({tableLoading: false});
        });
    }

    componentWillMount() {
        this.findInventorysByStoreroomId();
    }

    componentDidUpdate() {
        const {state, commonState, actions} = this.props;
        if (state.getFormValues) {
            actions.getFormValues(false);
            const param = {
                pageNum: 1,
                pageSize: 10,
                siteId: commonState.siteId,
                orgId: commonState.orgId,
            }
            actions.storeroomGetList(param, () => {
            });
            browserHistory.push('/material/storeroom');
        }
    }

    render() {

        const { state} = this.props;
        const data = state.inventoryByStoreroomIdListData || [];
        const list = data.list;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1']}>
                        <Panel header={<span className="label">物资明细 <Icon type="caret-down"/></span>} key="1"
                               style={this.customPanelStyle}>
                            <Table
                                loading={this.state.tableLoading}
                                rowKey="id"
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={list} // ***渲染数据
                                columns={this.columns}
                                rowSelection={this.rowSelection}
                                bordered
                                onChange={this.tableChange}
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
        state: state.material,
        commonState:state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(ItemDetailComponent);
