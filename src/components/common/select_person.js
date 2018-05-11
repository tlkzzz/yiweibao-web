/**
 * selectPerson
 * 选择人员组件


 *
 * @props  multiple                 true为多选 false 单选
 * @props  visible                  弹窗显示/隐藏
 * @props  selectPersonModalHide    关闭弹窗方法 方法内设置visible->false
 * @props  onOk                     多选人员确认方法 onOk={selectedArr => selectedArr} 参数为选择结果数组
 * @props  setSelected              设置选择结果方法 setSelected={() => [{id:1},{id:2}]} 返回需要设置的数组 数组项必须有id字段
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/common.js';

import { Modal, Button, Row, Col, Table, Pagination, Tag, Icon } from 'antd';
import SearchInp from './search_inp.js';
const confirm = Modal.confirm;
class SelectPerson extends React.Component {
    constructor (props) {
        super(props);

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        //表格字段
        this.columns = [
            {
                title: '人员',
                dataIndex: 'tseName',
                key: 'tseName',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><a href="javascript:;" onClick={() => { this.selectPerson(record) }} className="order-number">{text ? text : '-'}</a></p>
                    )
                }
            },
            {
                title: '电话',
                dataIndex: 'tseMobile',
                key: 'tseMobile',
                sorter: true,
                render: defaultRender
            },

        ];

        const { state } = this.props;

        this.param = {
            pageNum:1,
            pageSize:6,
            // orgIds: [state.orgId],
            // siteIds: [state.siteId],
            productIds: state.productArray,
        };

        this.state = {
            resultArr: [],
            currentPage: 1,
            tableLoading: false,
            list:[],
        }

        this.b = true; // 用于componentDidUpdate函数的开关属性
    }
    selectPerson = (record) => {

        const { resultArr } = this.state;
        const { multiple, onOk, selectPersonModalHide } = this.props;

        if (multiple) {
            let existed = resultArr.findIndex((item, i) => {
                return item.tseId === record.tseId;
            });

            if (existed === -1) this.setState({ resultArr: [...resultArr, record] });
        } else {
            this.setState({ resultArr: [record] }, () => {
                 confirm({
                    title: `是否确认派工 ${this.state.resultArr[0].tseName}?`,
                    okText: '确认',
                    onOk: () => {
                        onOk(this.state.resultArr[0]);
                         selectPersonModalHide();
                    }
                });


               




            });
        }

    }
    deselectPerson = (record) => {
        let { resultArr } = this.state;
        resultArr = resultArr.filter((item, i) => {
            return item.personId !== record.personId;
        });
        this.setState({ resultArr });
    }
    clearSelected = () => {
        this.setState({ resultArr: [] });
    }
    confirm = () => {
        this.props.onOk(this.state.resultArr);
        this.props.selectPersonModalHide();
        // this.clearSelected();
    }

    flashConfirm=()=>{
         const { actions } = this.props;
        this.setState({ tableLoading: true });
        actions.personGetList({pageNum:1,pageSize:6}, (json) => {
            this.setState({ tableLoading: false,list:json.result});
                console.log(json);



        });
    }
    componentDidUpdate () {
        const { visible, setSelected } = this.props;
        if (visible && setSelected && this.b) {
            this.b = false;
            this.setState({
                resultArr: setSelected()
            })
        }
    }
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page;
        this.getList();
    }
    getList = () => {
        const { actions } = this.props;
        this.setState({ tableLoading: true });
        actions.personGetList(this.param, (json) => {
            this.setState({ tableLoading: false,list:json.result});
                console.log(json);



        });
    }
    componentWillMount () {
        this.getList();
    }
    render() {
        const { visible, selectPersonModalHide, state, multiple } = this.props;
        // const data = state.personListData;
       const data = this.state.list 
     //   const list = data ? data.list : [];

        return (
            <Modal
                title={
                    <div className="clearfix">
                        <Pagination
                            total={data ? data.total : null}
                            current={this.state.currentPage}
                            onChange={this.pageChange}
                            className="pull-right"
                        />
                        <span className="pull-left">
                            <span style={{display: 'inline-block'}}>{multiple ? "多选人员" : '单选人员'}</span>
                            <span style={{display: 'inline-block', width: 200, marginLeft: 20}}>
                                <SearchInp onEnter={(text) => {
                                    if (!text) return;

                                    if (/[\u4E00-\u9FA5]+/.test(text)) {
                                        this.param.tseName = text;
                                        this.param.ifLogin = '';
                                        this.param.tseMobile = '';

                                    }
                                    else if (/[A-Za-z]+/.test(text)) {
                                        this.param.tseName = '';
                                        this.param.ifLogin = text;
                                        this.param.tseMobile = '';
                                    }
                                    else if (/[0-9]+/.test(text)) {
                                        this.param.tseName = '';
                                        this.param.ifLogin = '';
                                        this.param.tseMobile = text;
                                    }
                                    else {
                                        this.param.tseName = '';
                                        this.param.ifLogin = '';
                                        this.param.tseMobile = '';
                                    }

                                    this.getList();
                                }} />
                            </span>
                        </span>
                    </div>
                }
                width={800}
                visible={visible}
                footer={null}
                onCancel={selectPersonModalHide}
                afterClose={() => { this.b = true }}
                className="select-person"
            >
                <Row gutter={16}>
                    {
                        multiple ?
                        <Col className="gutter-row" span={6}>
                            <div className="person-selected">
                                <h2>
                                    <span className="pull-right" onClick={this.clearSelected}>清空</span>
                                    已选人员
                                </h2>
                                <div>
                                    {
                                        this.state.resultArr.map((item, i) => {
                                            return <Tag style={{marginBottom: 3}} key={i} id={item.tseId}>{item.tseName} <Icon type="close" onClick={() => { this.deselectPerson(item) }} /></Tag>
                                        })
                                    }
                                </div>
                            </div>
                        </Col>:
                        ''
                    }

                    <Col className="gutter-row" span={multiple ? 18 : 24}>
                        <Table
                            loading={this.state.tableLoading}
                            rowKey="tseId"
                            pagination={false}
                            dataSource={data.rows}
                            columns={this.columns}
                            rowSelection={this.rowSelection}
                            bordered
                            onChange={this.tableChange}
                        />
                    </Col>
                </Row>
                <div className="modal-footer clearfix">
                    <Pagination
                        total={data ? data.total : null}
                        className="pull-left"
                        pageSize={this.param.pageSize}
                        showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                        current={this.state.currentPage}
                        onChange={this.pageChange}
                        style={{padding: 0}}
                    />
                     <Button type="primary" size="large" onClick={this.flashConfirm} >刷新</Button>
                    <Button type="primary" size="large" onClick={this.confirm} style={{visibility: multiple ? 'inherit' : 'hidden'}}>确定</Button>
                </div>
            </Modal>
        );
    }
}

function mapStateToProps (state) {
    return {
        state: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(SelectPerson);
