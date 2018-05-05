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
import moment from 'moment';
const Panel = Collapse.Panel;

class PointTwoComponent extends React.Component {
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
        // 巡检记录表格字段
        this.recordColumns = [
            {
                title: '巡检日期',
                dataIndex: 'updatetime',
                key: 'updatetime',
                sorter: false,
                render: (text, record, key) => {
                    return (
                        <p>{text ? moment(text).format("YYYY-MM-DD HH:mm:ss") : '-'}</p>
                    )
                }
            },

        ];
        const {location} = this.props;

        const isAddPoint = location.query.add_point;

        this.termParam = {
            id: isAddPoint ? '' : JSON.parse(localStorage.getItem('point')).id,
            pageNum: 1,
            pageSize: 998,
        }
        this.recordParam = {
            patrolPointId: JSON.parse(localStorage.getItem('point')).id,
            pageNum: 1,
            pageSize: 998,
        }
        this.localPoint = JSON.parse(localStorage.getItem('point'));
    }

    pageChange = () => {

    }
    // 任务分派列表（巡检项、所需物料）
    termGetList = () => {
        const {actions} = this.props;
        this.setState({
            recordLoading: true,
        });
        actions.updateList(this.termParam, () => {
            this.setState({
                recordLoading: false,
            });
        });
        actions.updateRecordList(this.recordParam, () => {
            this.setState({
                recordLoading: false,
            });
        });
    }

    //重构标题栏
    resetColumns = (termList) => {
        if (termList && this.recordColumns.length === 1) {
            let defaultRender = (text, record, key) => {
                return (
                    <p>{text === '1' ? '正常' : '异常'}</p>
                )
            };
            for (let data of termList) {
                var termIterm = {
                    title: data.description,
                    dataIndex: 'statusmap.' + data.description,
                    key: data.id,
                    sorter: false,
                    render: defaultRender
                }
                this.recordColumns.push(termIterm)
            }
            let defaultRender2 = (text, record, key) => {
                return (
                    <p>{text ? text : ''}</p>
                )
            };
            this.recordColumns.push({
                    title: '巡检工单',
                    dataIndex: 'orderNum',
                    key: 'orderNum',
                    sorter: false,
                    render: defaultRender2
                },
                {
                    title: '巡检人',
                    dataIndex: 'excutePerson',
                    key: 'excutePerson',
                    sorter: false,
                    render: defaultRender2
                })
        }
    }

    componentWillMount() {
        const {actions, location} = this.props;
        if (this.localPoint) {
            this.termGetList();
            this.setState({editable: false});
        }
    }

    render() {
        const {state, location} = this.props;

        const termData = state.termListData;
        const recordData = state.pointRecordListData;
        // 检查项数据
        const termList = termData.patrolTermVolist;
        const recordList = recordData.list;
        //重构标题栏
        this.resetColumns(termList);

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">巡检记录<Icon type="caret-down"/></span>} key="2"
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

export default connect(mapStateToProps, buildActionDispatcher)(PointTwoComponent);