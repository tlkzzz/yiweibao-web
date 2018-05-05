import React from 'react';
import {bindActionCreators} from 'redux';
import {Link, browserHistory} from 'react-router';
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
                dataIndex: 'itemName',
                key: 'itemName',
                sorter: true,
                render: defaultRender
            },
            {
                title: '库房',
                dataIndex: 'storeroomName',
                key: 'storeroomName',
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
                title: '是否周转',
                dataIndex: 'isTurnOver',
                key: 'isTurnOver',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><Checkbox checked={text} disabled/></p>
                    )
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                sorter: true,
                render: defaultRender
            },
            {
                title: '站点',
                dataIndex: 'sitId',
                key: 'sitId',
                sorter: true,
                render: defaultRender
            },
            {
                title: '操作',
                dataIndex: '4',
                key: '4',
                width: 120,
                render: (text, record, key) => {
                    return (
                        <div className="table-icon-group">
                            <Icon
                                type="delete"
                            />
                        </div>
                    )
                }
            }
        ];

    }

    //根据id查询实体


    getITemEntity = () => {
        let id = this.props.location.query.id;
        this.param = {pageNum: 0, pageSize: 10, id: id};
        const {actions} = this.props;
        actions.findInventorysByItemId(this.param, () => {
            this.setState({tableLoading: false});
        });

        this.props.location.query.id

    }

    componentWillMount() {
        this.getITemEntity();
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
            actions.itemGetList(param, () => {
            });
            browserHistory.push('/material/item');
        }
    }

    render() {

        const {state} = this.props;
        const data = state.inventoryByItemIdListData ||[];
        const list = data.list;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1']}>
                        <Panel header={<span className="label">库存信息 <Icon type="caret-down"/></span>} key="1"
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
                            {/*<div className="panel-tools-right">*/}
                            {/*<Dropdown*/}
                            {/*overlay={(*/}
                            {/*<Menu >*/}
                            {/*<Menu.Item key="3" ><Icon type="delete" /> 批量删除</Menu.Item>*/}
                            {/*<Menu.Item key="1"><Icon type="setting" /> 导出Excel</Menu.Item>*/}
                            {/*</Menu>*/}
                            {/*)}*/}
                            {/*trigger={['click']}*/}
                            {/*>*/}
                            {/*更多操作*/}
                            {/*</Dropdown>*/}
                            {/*<Button type="primary" size="large" >新增</Button>*/}
                            {/*</div>*/}
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
        commonState: state.common,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(ItemDetailComponent);
