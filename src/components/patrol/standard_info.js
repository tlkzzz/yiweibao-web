import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import actions from '../../actions/patrol.js';
import commonActions from '../../actions/common';
import {filterArrByAttr} from '../../tools/';
import Dropdown from '../../components/common/dropdown.js';
import EamModal from '../../components/common/modal.js';
import BackList from '../common/back_list';
import moment from 'moment';

import {
    Icon,
    Button,
    Upload,
    Modal,
    Table,
    Pagination,
    Collapse,
    Form,
    Input,
    Row,
    Col,
    Select,
    Radio,
    DatePicker,
    Checkbox,
    Menu, message, InputNumber
} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            tableLoading: false,
            treeLoading: false,
        }

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };


        this.param = {
            pageSize: 10,
            pageNum: 0
        }
        //表格字段
        this.columns = [
            {
                title: '分类编码',
                dataIndex: 'code',
                key: 'code',
                render: defaultRender
            },
            {
                title: '分类名称',
                dataIndex: 'name',
                key: 'name',
                render: defaultRender
            },
            {
                title: '分类描述',
                dataIndex: 'description',
                key: 'description',
                render: defaultRender
            },
            {
                title: '是否有子位置',
                dataIndex: 'hasChildren',
                key: 'hasChildren',
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
                            <Button
                                type="primary"

                                onClick={ () => {
                                    this.selectclassific(record.id, record.code, record.description)
                                }}
                            >
                                选择
                            </Button>
                        </div>
                    )
                }
            },

        ];

    }


    componentDidUpdate() {
        const {state, actions, form} = this.props;
        if (!state.getFormValues) {
            actions.getFormValues(form.getFieldsValue());
        }
    }

    // 选择库房
    selectclassific = (id, code, name) => {
        const {form} = this.props;
        form.setFieldsValue({'classstructureId': id, 'classstructureNum': code, 'classstructureDescription': name,});

        this.taskStepsClose();
    }

    getclassifiList = () => {
        const {commonActions} = this.props;
        this.setState({tableLoading: true});
        commonActions.classifiGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    }


    classstructureAdd = () => {
        this.getclassifiList();
        this.classstructureModel.modalShow();
    }

    taskStepsClose = () => {
        this.classstructureModel.modalHide();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {entity} = this.props;
        const {state} = this.props;
        const {code} = this.props;
        const {commonState} = this.props;

        const classdata = commonState.classifiListData;
        const classList = classdata.list;

        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{span: 0}}>
                        <FormItem
                        >
                            {
                                getFieldDecorator('id', {
                                    initialValue: entity ? entity.id : ''
                                })(
                                    <Input type="hidden" disabled/>
                                )
                            }

                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="*标准编码"
                        >
                            {
                                getFieldDecorator('patrolStandNum', {
                                    initialValue: entity ? entity.patrolStandNum : code
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 8}}>
                        <FormItem
                            label="*标准描述"
                        >
                            {
                                getFieldDecorator('description', {
                                    initialValue: entity ? entity.description : ''
                                })(
                                    <Input placeholder="请输入标准描述"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" sm={{span: 6}}>
                        <FormItem
                            label="状态"
                        >
                            {
                                getFieldDecorator('status', {
                                    initialValue: data.status ? data.status : (routeStatusData[0] && routeStatusData[0].value)
                                })(
                                    <Select size="large" style={{width: '100%'}}>
                                        {
                                            routeStatusData.map((item, i) => <Option key={i}
                                                                                     value={item.value}>{item.description}</Option>)
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 4}}>
                        <FormItem
                            label="组织"
                        >
                            {
                                getFieldDecorator('orgName', {
                                    initialValue: entity ? entity.orgName : commonState.orgName
                                })
                                (
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>


                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{span: 0}}>
                        <FormItem
                        >
                            {
                                getFieldDecorator('classstructureId', {
                                    initialValue: entity ? entity.classstructureId : ''
                                })
                                (
                                    <Input type="hidden"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="*设备分类"
                        >
                            {
                                getFieldDecorator('classstructureNum', {
                                    initialValue: entity ? entity.classstructureNum : ''
                                })
                                (
                                    entity ? <Input disabled/> :
                                        <Input placeholder="请设备分类" suffix={<Icon type="plus"
                                                                                 onClick={this.classstructureAdd}/> }
                                               disabled/>
                                )
                            }
                            <EamModal
                                width={800}
                                title={`选择设备分类`}
                                ref={classstructureModel => this.classstructureModel = classstructureModel}
                                onOk={this.taskStepsAddSave}
                                footer={null}
                                afterClose={this.taskStepsAfterClose}
                                className="select-person"
                            >
                                <Row gutter={16}>
                                    <Col className="gutter-row" span={ 24 }>
                                        <Table
                                            rowKey="id"
                                            pagination={false}
                                            dataSource={classList}
                                            columns={this.columns}
                                            rowSelection={this.rowSelection}
                                            bordered
                                            onChange={this.tableChange}
                                        />
                                        <Pagination
                                            total={classdata.total}
                                            className="pull-left title-pagination"
                                            current={this.state.currentPage}
                                            onChange={this.pageChange}
                                        />
                                    </Col>
                                </Row>
                                <div className="modal-footer clearfix">
                                    <Pagination
                                        total={classdata.total}
                                        className="pull-left"
                                        showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                                        current={this.state.currentPage}
                                        onChange={this.pageChange}
                                        style={{padding: 0}}
                                    />
                                    <Button type="primary" size="large" onClick={this.taskStepsClose}>取消</Button>
                                </div>
                            </EamModal>
                        </FormItem>
                    </Col>

                    <Col className="gutter-row" xs={{span: 8}}>
                        <FormItem
                            label="*设备描述"
                        >
                            {
                                getFieldDecorator('classstructureDescription', {
                                    initialValue: entity ? entity.classstructureDescription : ''
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="状态日期"
                        >
                            {
                                getFieldDecorator('statusDate', {
                                    initialValue: moment(entity ? entity.statusDate : new Date(), 'YYYY-MM-DD HH:mm:ss')
                                })
                                (
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder="Select Time"
                                        onChange={(onChange) => {
                                        }}
                                        onOk={(onOk) => {
                                        }}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 4}}>
                        <FormItem
                            label="站点"
                        >
                            {
                                getFieldDecorator('siteName', {
                                    initialValue: entity ? entity.siteName : commonState.siteName
                                })
                                (
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const
    NewFormComponent = Form.create()(FormComponent);


class StandardInfoComponent
    extends React
        .Component {
    constructor(props) {
        super(props);

        this.state = {
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

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        // 巡检标准内容字段
        this.standardContentColumns = [
            {
                title: '检查内容',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        record.description ? <p>{text}</p> : <Input onChange={e => {
                            record.description = e.target.value;

                        }}/>
                    )
                }
            },
            {
                title: '检查标准',
                dataIndex: 'checkStand',
                key: 'checkStand',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        record.checkStand ? <p>{text}</p> : <Input onChange={e => {
                            record.checkStand = e.target.value;

                        }}/>
                    )
                }
            },
            {
                title: '注意事项',
                dataIndex: 'remark',
                key: 'remark',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        record.remark ? <p>{text}</p> : <Input onChange={e => {
                            record.remark = e.target.value;

                        }}/>
                    )
                }
            },
            {
                title: '操作',
                dataIndex: '4',
                key: 'ok',
                width: 120,
                render: (text, record, key) => {
                    return (
                        record.description ? <p>{'-'}</p> : <button onClick={() => {
                            this.updatePatrolStandContent(record)
                        }}>确认</button>
                    )
                }
            },
            {
                title: '操作',
                dataIndex: '4',
                key: '4',
                width: 120,
                render: (text, record, key) => {
                    return (
                        <div className="table-icon-group">
                            <Icon type="delete" onClick={() => {
                                this.showConfirm(record.id, '该条记录吗')
                            }}/>

                        </div>
                    )
                }
            },
        ];

        this.rowReceiveDetailSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({selectedRows: selectedRows});
            },
        };

        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRows :selectedRows });
                this.rowSelectionRows = selectedRows;
            },
        };
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

    del = (id) => {
        console.log(id);
        const {actions} = this.props;
        const param = {ids: id};

        actions.deletePatrolStandContent(param, (json) => {
            if (json.success) {
                message.success(json.msg);
                this.getStandardContentList();
            } else {
                message.error(json.msg);
            }
        });
    }

    //根据id获取接收实体
    getStandardEntity = () => {

        let id = this.props.location.query.id;
        this.param = {id: id};
        const {actions, commonActions} = this.props;

        if (id == '' || id == undefined) {
            actions.findStandardById(this.param, () => {
                this.setState({tableLoading: false});
            });
            this.param = {modelKey: "patrolstand"}
            commonActions.codeGenerator(this.param, () => {
                this.setState({tableLoading: false});
            });

        } else {
            actions.findStandardById(this.param, () => {
                this.setState({tableLoading: false});
            });
        }
    }


    updatePatrolStandContent = (record) => {
        const {actions} = this.props;
        this.param = {
            ...record
        }
        console.info(this.param);
        this.setState({tableLoading: true});
        actions.updatePatrolStandContentDetail(this.param, (json) => {

            // if(json.success){
            //
            // }
            this.setState({tableLoading: false});
        });
    }
    //获取巡检标准内容列表
    getStandardContentList = () => {
        const {actions} = this.props;
        let id = this.props.location.query.id;
        const param = {id: id, pageSize: 10, pageNum: 0};
        this.setState({tableLoading: true});
        actions.findPatrolStandContent(param, () => {
            this.setState({tableLoading: false});
        });
    }



    standardContentAdd = () => {
        const {state, actions} = this.props;
        const entity = state.standardEntity;

        // console.log(entity);
        if (entity == null || entity == undefined) {
            message.error("请先保存基本信息!!");
        } else {
            const param = {patrolStandId: entity.id};
            console.log(param)
            actions.standardContentSave(param, (json) => {
                this.getStandardContentList();
            });
        }
    }

    batchDel = () => {
        const selectedRows = this.state.selectedRows;
        this.del(filterArrByAttr(selectedRows, 'id').join(','));
    }

    getReceiveStatus = () => {
        const {commonActions, commonState} = this.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'receiveStatus', 'RECEIVE_STATUS');
        commonActions.getDomainValue(domainValueParam, 'issuetype', 'RECEIVE_TYPE');
    }

    componentWillMount() {
        this.getStandardEntity();
        this.getStandardContentList();
    }

    render() {

        const {state, commonState, actions, commonActions} = this.props;
        const standard = state.standardEntity;

        const code = commonState.codeEntity;

        const standardContentdata = state.standardContentListData;
        const standardContentlist = standardContentdata.list;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down"/></span>} key="1"
                               style={this.customPanelStyle}>
                            <NewFormComponent state={state} commonActions={commonActions} commonState={commonState}
                                              entity={standard} actions={actions} code={code}/>
                        </Panel>
                        <Panel header={<span className="label">巡检标准内容<Icon type="caret-down"/></span>} key="2"
                               style={this.customPanelStyle}>
                            <Table
                                rowSelection={this.rowSelection}
                                rowKey="id"
                                loading={this.state.tableLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={standardContentlist}
                                columns={this.standardContentColumns}
                                bordered
                            />
                            {/*{ showButton &&*/}
                                <div className="panel-tools-right">
                                <Dropdown
                                overlay={(
                                <Menu onClick={this.batchDel}>
                                    <Menu.Item key="3"><Icon type="delete"/> 批量删除</Menu.Item>
                                    {/*<Menu.Item key="1"><Icon type="setting"/> 导出Excel</Menu.Item>*/}
                                </Menu>
                            )}
                                trigger={['click']}
                                >
                                更多操作
                                </Dropdown>
                                <Button type="primary" size="large" onClick={this.standardContentAdd}>新增</Button>
                                </div>
                            {/*}*/}
                        </Panel>
                    </Collapse>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        state: state.patrol,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(StandardInfoComponent);
