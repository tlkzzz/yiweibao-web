/** 
 * @Description  物资台账
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { filterArrByAttr } from '../../tools';
import actions from '../../actions/patrol.js';

import EamModal from '../../components/common/modal.js';
import Collection from '../../components/common/collection.js';
import Dropdown from '../../components/common/dropdown.js';
import ListTools from '../../components/common/list_tools.js';
import BackList from '../common/back_list';

import moment from 'moment';


import { Icon, Checkbox, Modal, Button, Table, Form, Input, Pagination, Menu, message} from 'antd';
const confirm = Modal.confirm;
// const FormItem = Form.Item;


class StandardComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
            tableLoading: false,
        }
        //表格多选
        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRows :selectedRows });
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log(selected, selectedRows, changeRows);
            },
        };

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };


        //表格字段
        this.columns = [
            {
                title: '巡检标准编码',
                dataIndex: 'patrolStandNum',
                key: 'patrolStandNum',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><Link className="order-number" to={`/patrol/standard/standard_info?id=${record.id}`}>{text ? text : '-'}</Link></p>
                    )
                }
            },
            {
                title: '类型',
                dataIndex: 'typeName',
                key: 'type',
                sorter: true,
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'statusName',
                key: 'status',
                sorter: true,
                render: defaultRender
            },
            {
                title: '状态日期',
                dataIndex: 'statusDate',
                key: 'status_date',
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
                                onClick={() => {
                                    this.showConfirm(record.id, record.patrolStandNum)
                                }}
                            />
                        </div>
                    )
                }
            },
        ];



        //*** 初始化列表参数 需要到处改参数的请求 把参数定义到这里 严禁把参数用state管理 因为参数变化不需要触发render来渲染页面
        this.param = {
            pageNum: 1,
            pageSize: 10,
        }

    }

    // 表格事件
    tableChange = (pagination, filters, sorter) => {
        console.log(sorter)
        const { actions } = this.props;
        // console.log(sorter)
        if (sorter.order) {
            let sorterOrder = sorter.order;
            let endIndex = sorterOrder.indexOf('end');
            sorterOrder = sorterOrder.slice(0, endIndex);
            this.param.sorts = `${sorter.field} ${sorterOrder}`;
        } else {
            this.param.sorts = '';
        }
        actions.standardGetList(this.param) ;
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }
    // 获取列表数据
    getList = () => {
        const { actions } = this.props;
        this.setState({ tableLoading: true });
        actions.standardGetList(this.param, () => {
            this.setState({ tableLoading: false });
        });
    }
    // 删除
    del = (id) => {
        const { actions } = this.props;
        let param = {ids: id};
        actions.deleteStandard(param, (json) => {
            // console.log(json);
            if (json.success) {
                message.success(json.msg);
                this.getList();
            } else {
                message.error(json.msg);
            }
        });
    }

    //批量删除
    batchDel=()=>{
        const { actions } = this.props;
        const selectedRows = this.state.selectedRows;
        this.del(filterArrByAttr(selectedRows,'id').join(','));

    }


    //删除确认框
    showConfirm = (id, text) => {
        confirm({
            title: `删除 ${text}?`,
            okText: '删除',
            onOk: () => {
                this.del(id);
            }
        });
    }
    // 模糊查询
    // fuzzyQuery = (keywords) => {
    //     console.log(keywords) ;
    //     this.param.word = keywords;
    //     this.getList();
    // }
    componentWillMount () {
        this.getList();
    }

    //物资接受保存
    standSave = ()=>{
        const { actions } = this.props;
        actions.getFormValues(false);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            const { state } = this.props;

            console.log(state)
            state.getFormValues.statusDate = moment(state.getFormValues.statusDate).format('YYYY-MM-DD HH:mm:ss');

            const param = {
                ...state.getFormValues,
            }
            console.log(param) ;
            const id = param.id ;
            if(id==undefined || id ==''){

                actions.standardSave(param, (json) => {
                    console.log(json);
                    if (json.success) {
                        console.log(json.data.id)
                        window.location.href='/patrol/standard/standard_info?id='+json.data.id;
                    } else {
                        message.error(json.msg);
                    }
                });
            }else{
                actions.standardUpdate(param, (json) => {
                    if (json.success) {
                        window.location.href='/patrol/standard/standard_info?id='+json.data.id;
                    } else {
                        message.error(json.msg);
                    }
                });
            }
        },0);
    }
    render () {

        const { children , state,commonState } = this.props;
        const data = state.standListData //*** 拿到请求返回的数据
        const list = data.list;

        const entity = state.standardEntity ;
        const code = commonState.codeEntity ;

        // // 高级筛选选项数据
        // const seniorFilterSelectArr = [
        //     [],
        //     [],
        // ];

        return children ?
            (
                <div>
                    <div className="top-bar clearfix">
                        <div className="details-title pull-left">
                            <h3>{entity ? entity.patrolStandNum:code}</h3>
                            <span className="eam-tag">{entity ? entity.status :''}</span>
                            <p>{entity ? entity.description :''}</p>
                        </div>
                        <div className="list-tools-right pull-right">
                            <BackList />
                            <Button type="primary" size="large" onClick={this.standSave}>保存</Button>
                        </div>
                    </div>
                    {children}
                </div>
            ) :
            (
                <div>
                    <div className="top-bar clearfix">
                        <div className="pull-left">
                            <h2>巡检标准</h2>
                        </div>
                        <div className="list-tools-right pull-right">
                            <Pagination
                                total={data.total}
                                className="pull-left"
                                current={this.state.currentPage}
                                onChange={this.pageChange}
                            />
                            <Dropdown
                                overlay={(
                                    <Menu onClick={this.batchDel}>
                                        <Menu.Item key="3" ><Icon type="delete" /> 批量删除</Menu.Item>
                                    </Menu>
                                )}
                                trigger={['click']}
                            >
                                更多操作
                            </Dropdown>
                            <Button type="primary" size="large" ><Link className="order-number" to="/patrol/standard/standard_info">新建</Link></Button>
                        </div>
                    </div>
                    <div className="eam-content">
                        <div className="eam-content-inner">
                            <Table
                                loading={this.state.tableLoading}
                                rowKey="id"
                                pagination={false}
                                dataSource={list} // ***渲染数据
                                columns={this.columns}
                                rowSelection={this.rowSelection}
                                bordered
                                onChange={this.tableChange}
                            />
                            <Pagination
                                total={data.total}
                                showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                                current={this.state.currentPage}
                                showQuickJumper
                                showSizeChanger
                                onChange={this.pageChange}
                            />
                        </div>
                    </div>
                </div>
            )
    }
}


function mapStateToProps (state) {
    return {
        state: state.patrol,
        commonState:state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(StandardComponent);
