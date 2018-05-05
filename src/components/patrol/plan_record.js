/** 
 * @Description
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import actions from '../../actions/patrol.js';
import {createForm} from 'rc-form';
import Dropdown from '../../components/common/dropdown.js';
import {Icon, Button, Table, Pagination, Collapse, Form, Input, Row, Col, Select, Radio, DatePicker, Menu} from 'antd';
const Panel = Collapse.Panel;

class PlanTwoComponent extends React.Component {
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
        // 工单记录表格字段
        this.recordColumns = [
            {
                title: '工单编码',
                dataIndex: 'patrolOrderNum',
                key: 'patrolOrderNum',
                sorter: false,
                render: defaultRender
            },
            {
                title: '工单描述',
                dataIndex: 'description',
                key: 'description',
                sorter: false,
                render: defaultRender
            },
            {
                title: '执行人',
                dataIndex: 'excutePerson',
                key: 'excutePerson',
                sorter: false,
                render: defaultRender
            },
            {
                title: '情况说明',
                dataIndex: 'remark',
                key: 'remark',
                sorter: false,
                render: defaultRender
            },
            {
                title: '生成日期',
                dataIndex: 'createtime',
                key: 'createtime',
                sorter: false,
                render: defaultRender
            },
            {
                title: '工单状态',
                dataIndex: 'statusDescription',
                key: 'statusDescription',
                sorter: false,
                render: defaultRender
            }
        ];
        const {location} = this.props;

        const isAddPlan = location.query.add_plan;

        this.recordParam = {
            patrolPlanId: JSON.parse(localStorage.getItem('plan')).id,
            pageNum: 1,
            pageSize: 998,
        }
        this.localPlan = JSON.parse(localStorage.getItem('plan'));
    }

    pageChange = () => {

    }
    // 任务分派列表（巡检项、所需物料）
    planOrderGetList = () => {
        const {actions} = this.props;
        this.setState({
            recordLoading: true,
        });
        actions.orderGetList(this.recordParam, () => {
            this.setState({
                recordLoading: false,
            });
        });
    }

    componentWillMount() {
        const {actions, location} = this.props;
        if (this.localPlan) {
            this.planOrderGetList();
            this.setState({editable: false});
        }
    }

    render() {
        const {state, location} = this.props;

        const recordData = state.orderListData;
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
        state: state.patrol
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(PlanTwoComponent);