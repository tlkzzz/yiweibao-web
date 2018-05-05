/**
 * 维保保养-维保工单-工单提报 
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link, browserHistory} from 'react-router';
import actions from '../../actions/daily.js';
import commActions from '../../actions/common.js';
import EamModal from '../../components/common/modal.js';
import {filterArrByAttr} from '../../tools/';

import Dropdown from '../../components/common/dropdown.js';
import moment from 'moment';

import {
    Icon,
    Button,
    Table,
    Pagination,
    Collapse,
    Form,
    Input,
    Modal,
    Menu,
    Row,
    Col,
    Select,
    Radio,
    Checkbox,
    InputNumber,
    DatePicker,
    message
} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
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
        this.columns = [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                render: defaultRender
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                render: defaultRender
            },
            {
                title: '编码',
                dataIndex: 'code',
                key: 'code',
                sorter: true,
                render: defaultRender
            },
            {
                title: '操作',
                dataIndex: '4',
                key: '41',
                width: 120,
                render: (text, record, key) => {
                    return (
                        <div className="table-icon-group">
                            <Button
                                type="primary"

                                onClick={() => {
                                    this.unitSelect(record.id, record.description);
                                }}
                            >
                                选择
                            </Button>
                        </div>
                    )
                }
            },
        ];

        this.ordercolumns = [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                render: defaultRender
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                render: defaultRender
            },
            {
                title: '编码',
                dataIndex: 'code',
                key: 'code',
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
                            <Button
                                type="primary"

                                onClick={() => {
                                    this.orderunitSelect(record.id, record.description);
                                }}
                            >
                                选择
                            </Button>
                        </div>
                    )
                }
            },
        ];
        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.rowSelectionRows = selectedRows;
            },
        };
    }

    // orderunitSelect = (id, name) => {
    //     const {form} = this.props;
    //     form.setFieldsValue({"orderUnit": id, "orderUnitName": name});
    //     this.taskStepsClose();
    // }
    // unitSelect = (id, name) => {
    //     const {form} = this.props;
    //     form.setFieldsValue({"issueUnit": id, "issueUnitName": name});
    //     this.taskStepsClose();
    // }

    componentDidUpdate() {
        const {state, actions} = this.props;
        if (state.getFormValues) {
            actions.getFormValues(false);
            this.copymeterAdd();
        }
    }

    copymeterAdd = () => {
        const {state, actions, commState} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                for (let attr in values) {
                    if (values[attr] === null || values[attr] == "") delete values[attr];
                }

                values.copyMeterType = values.copyMeterType.toString();
                values.copyMeterDate = moment(values.copyMeterDate).format('YYYY-MM-DD HH:mm:ss');
                values.createDate = moment(values.createDate).format('YYYY-MM-DD HH:mm:ss');
                const copymeterDetailListData = state.copymeterDetailListData || [];
                const newcopymeterDetailList = copymeterDetailListData.newcopymeterDetailList || [];

                const copyMeterDetailVos = JSON.parse(JSON.stringify(newcopymeterDetailList));
                copyMeterDetailVos.forEach(item => {
                    item.meterId = item.id;
                    delete item.id;
                });
                const param = {
                    ...values,
                    orgId: commState.orgId,
                    siteId: commState.siteId,
                    copyMeterDetailVos: copyMeterDetailVos,
                }
                const listParam = {
                    pageNum: 1,
                    pageSize: 10,
                    siteId: commState.siteId,
                    orgId: commState.orgId,
                }
                console.log(param)
                const id = param.id;
                if (id == undefined || id == '') {
                    actions.copyMeterSave(param, (json) => {
                        if (json.success) {
                            actions.copyMeterGetList(listParam, () => {
                            });
                            browserHistory.push('/daily/copymeter');
                        } else {
                            message.error(json.msg);
                        }
                    });
                } else {
                    actions.copyMeterUpdate(param, (json) => {
                        if (json.success) {
                            actions.copyMeterGetList(listParam, () => {
                            });
                            browserHistory.push('/daily/copymeter');
                        } else {
                            message.error(json.msg);
                        }
                    });
                }
            }
        });
    }


    componentWillMount() {
    }

    render() {
        const {entity, code, state, commState} = this.props;
        const {getFieldDecorator} = this.props.form;

        const copymetertypes = entity ? entity.copyMeterType ? entity.copyMeterType.split(",") : [] : [];
        const meterType = commState.meterType;


        return (
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col xs={{span: 0}}>
                        <FormItem
                        >
                            {
                                getFieldDecorator('id', {initialValue: entity ? entity.id : ""})(
                                    entity ? <Input type="hidden" disabled/> : <Input placeholder="placeholder"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 3}}>


                        <FormItem
                            label="抄表编码"
                        >
                            {
                                getFieldDecorator('copyMeterNum', {
                                    rules: [{required: true, message: '请输入编号!'}],
                                    initialValue: entity ? entity.copyMeterNum : code
                                })(
                                    <Input placeholder="请输入编号" disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 9}}>
                        <FormItem
                            label="抄表描述"
                        >
                            {
                                getFieldDecorator('description', {
                                    rules: [{required: true, message: '请输入抄表描述!'}],
                                    initialValue: entity ? entity.description : ''
                                })(
                                    entity ? <Input placeholder="请输入抄表描述" disabled/> : <Input placeholder="请输入抄表描述"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="抄表人"
                        >
                            {
                                getFieldDecorator('copyMeterPerson', {
                                    initialValue: entity ? entity.copyMeterPerson : ''
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="创建人"
                        >
                            {
                                getFieldDecorator('createUser', {
                                    initialValue: entity ? entity.createUser : commState.loginName
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>

                    <Col className="gutter-row" xs={{span: 6}}>

                        <FormItem
                            label="仪表类型"
                        >
                            {
                                getFieldDecorator('copyMeterType', {
                                    rules: [{required: true, message: '请选择类型!'}],
                                    initialValue: copymetertypes
                                })(
                                    <Select mode="multiple" size="large"
                                            style={{width: '100%'}}
                                    >
                                        {
                                            meterType.map((item, i) => <Option key={i}
                                                                               value={item.value}>{item.description}</Option>)
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>

                        <FormItem
                            label="状态"
                        >
                            {
                                getFieldDecorator('status', {
                                    rules: [{required: true, message: '请选择状态!'}],
                                    initialValue: entity ? entity.status ? "true" : "false" : ''
                                })(
                                    <Select size="large" style={{width: '100%'}}>
                                        <Option value="true">活动</Option>
                                        <Option value="false">不活动</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>

                        <FormItem
                            label="抄表时间"
                        >
                            {
                                getFieldDecorator('copyMeterDate', {
                                    initialValue: entity ? moment(entity.copyMeterDate, 'YYYY-MM-DD HH:mm:ss') : moment(new Date(), 'YYYY-MM-DD HH:mm:ss')
                                })(
                                    <DatePicker
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder="Select Time"
                                        showTime
                                        onChange={(onChange) => {
                                        }}
                                        onOk={(onOk) => {
                                        }}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>

                        <FormItem
                            label="创建时间"
                        >
                            {
                                getFieldDecorator('createDate', {
                                    initialValue: entity ? moment(entity.createDate, 'YYYY-MM-DD HH:mm:ss') : moment(new Date(), 'YYYY-MM-DD HH:mm:ss')
                                })(
                                    <DatePicker
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder="Select Time"
                                        disabled
                                        showTime
                                        onChange={(onChange) => {
                                        }}
                                        onOk={(onOk) => {
                                        }}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const NewFormComponent = Form.create()(FormComponent)

class ItemDetailComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tableLoading: false,
            modalShow: false,
            currentPage: 1,
        }


        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };
        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

        this.copymeterDetailColumns = [
            {
                title: '仪表编号',
                dataIndex: 'code',
                key: 'code',
                render: defaultRender
            },
            {
                title: '仪表种类',
                dataIndex: 'classificationCode',
                key: 'classificationCode',
                render: defaultRender
            }, {
                title: '位置编号',
                dataIndex: 'locationCode',
                key: 'locationCode',
                render: defaultRender
            },
            {
                title: '位置描述',
                dataIndex: 'locationName',
                key: 'locationName',
                render: defaultRender
            },
            {
                title: '仪表层级',
                dataIndex: 'meterLevel',
                key: 'meterLevel',
                render: defaultRender
            },
            {
                title: '能耗分类',
                dataIndex: 'consumeEnergyType',
                key: 'consumeEnergyType',
                render: defaultRender
            },
            {
                title: '用能种类',
                dataIndex: 'fillFormId',
                key: 'fillFormId',
                render: defaultRender
            },
            {
                title: '单位',
                dataIndex: 'priceUnit',
                key: 'priceUnit',
                render: defaultRender
            },
            {
                title: '日常价格',
                dataIndex: 'price',
                key: 'price',
                render: defaultRender
            },
            {
                title: '上次读数',
                dataIndex: 'lastNum',
                key: 'lastNum',
                render: defaultRender
            },
            {
                title: '上次抄表日期',
                dataIndex: 'lastDate',
                key: 'lastDate',
                render: defaultRender
            },
            {
                title: '本次读数',
                dataIndex: 'thisNum',
                key: 'thisNum',
                render: (text, record, key) => {
                    return (
                        record.thisNum ? <p>{text}</p> : <InputNumber min={0} onChange={e => {
                            record.thisNum = e;

                        }}/>
                    )
                }
            },
            {
                title: '本次抄表日期',
                dataIndex: 'thisDate',
                key: 'thisDate',
                render: (text, record, key) => {
                    return (
                        record.thisDate ?
                            <p>{text}</p> : record.thisDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
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
                        record.thisNum ? <p>{'-'}</p> :
                            <button onClick={() => {
                                this.updatecopymeterDetail(record)
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
                                this.showConfirm(record)
                            }}/>

                        </div>
                    )
                }
            },
        ];

        this.metercolumns = [
            {
                title: '仪表编号',
                dataIndex: 'code',
                key: 'code',
                render: defaultRender
            },
            {
                title: '仪表种类',
                dataIndex: 'classificationCode',
                key: 'classificationCode',
                render: defaultRender
            }, {
                title: '位置编号',
                dataIndex: 'locationCode',
                key: 'locationCode',
                render: defaultRender
            },
            {
                title: '位置描述',
                dataIndex: 'locationName',
                key: 'locationName',
                render: defaultRender
            },
            {
                title: '仪表层级',
                dataIndex: 'meterLevel',
                key: 'meterLevel',
                render: defaultRender
            },
            {
                title: '能耗分类',
                dataIndex: 'consumeEnergyType',
                key: 'consumeEnergyType',
                render: defaultRender
            },
            {
                title: '用能种类',
                dataIndex: 'classificationName',
                key: 'classificationName',
                render: defaultRender
            },
            {
                title: '单位',
                dataIndex: 'spaceName',
                key: 'spaceName',
                render: defaultRender
            },
            {
                title: '日常价格',
                dataIndex: 'refType',
                key: 'refType',
                render: defaultRender
            }
        ];

        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({selectedRows: selectedRows});
            },
        };

        this.copymeterModalRowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.rowSelectionRows = selectedRows;
            },
        }

    }

    //根据id查询实体
    getCopyMeterEntity = () => {
        const {commActions, actions, commState} = this.props;
        let id = this.props.location.query.id;

        if (id == '' || id == undefined) {
            const param = {modelKey: "daily", siteId: commState.siteId, orgId: commState.orgId};

            commActions.codeGenerator(param, () => {
            });

            const copyMeterparam = {id: id, siteId: commState.siteId, orgId: commState.orgId};
            actions.findCopyMeterById(copyMeterparam, () => {
            });

        } else {
            const copyMeterparam = {id: id, siteId: commState.siteId, orgId: commState.orgId};
            actions.findCopyMeterById(copyMeterparam, () => {
            });
        }
    }
    getCopyMeterDetailList = () => {
        const {actions, commState} = this.props;
        let id = this.props.location.query.id;
        const copyMeterparam = {id: id, siteId: commState.siteId, orgId: commState.orgId};

        this.setState({tableLoading: true});
        actions.findCopyMeterDetails(copyMeterparam, () => {
            this.setState({tableLoading: false});
        });
    }

    copymeterDetailAdd = () => {
        // 发起请求调用台帐显示台帐列表
        const {actions, commstate, state} = this.props;

        const exitIds = state.copymeterDetailListData ? filterArrByAttr(state.copymeterDetailListData.list || [], 'meterId') : [];
        const nowIds = state.copymeterDetailListData ? filterArrByAttr(state.copymeterDetailListData.newcopymeterDetailList || [], 'id') : [];

        const assetIgnoreIds = nowIds.concat(exitIds);
        const classificationValues = this.meterForm.props.form.getFieldValue('copyMeterType')
        console.log(classificationValues);

        if (classificationValues == '' || classificationValues == undefined) {
            message.error("请选择仪表类型");
            return;
        }

        const param = {
            assetIgnoreIds: assetIgnoreIds,
            classificationIds: this.getclassificationIdsByValues(classificationValues),
            orgId: "e0bc74c4f58611e58c2d507b9d28ddca",
            pageNum: 1,
            pageSize: 10,
            productArray: ["e4eca0c036f111e7afa90242ac110005"],
            siteId: "8aaf4fb85474172c01547990053f00be"
        }

        actions.findMeters(param, () => {
        });

        this.copymeterModal.modalShow();
    }

    getclassificationIdsByValues = (classificationValues) => {
        const classificationIds = [];
        const classificationIdsAndValues = {
            'watermeter': '1360cd2492c711e78d22f01faf517e53',
            'electricitymeter': '1a7b84cb92c711e78d22f01faf517e53',
            'gasmeter': '1e554c0592c711e78d22f01faf517e53'
        };

        classificationValues.map((item, i) => {
            classificationIds.push(classificationIdsAndValues[item]);
        })

        return classificationIds;
    }

    updatecopymeterDetail = (record) => {
        const {actions} = this.props;
        actions.copyMeterDetailOperation(['COPYMETER_UPDATE', record]);
    }

    getMeterType = () => {
        const {commActions, commState} = this.props;
        const domainValueParam = {
            orgId: commState.orgId,
            siteId: commState.siteId,
            prodId: 'EAM'
        }
        commActions.getDomainValue(domainValueParam, 'meterAsstType', 'METER_TYPE');
    }
    copymeterdetailSave = () => {
        const {actions} = this.props;
        const selectionrows = this.rowSelectionRows;

        actions.copyMeterDetailOperation(['COPYMETER_SAVE', selectionrows]);
        this.copymeterModal.modalHide();
    }

    //删除确认框
    showConfirm = (record) => {
        confirm({
            title: `删除 ${record.code}?`,
            okText: '删除',
            onOk: () => {
                this.del(record.id);
            }
        });
    }

    del = (id) => {

        const {state, actions} = this.props;
        const param = {ids: id};
        const entity = state.copymeterEntity;
        const arr = state.copymeterDetailListData ? filterArrByAttr(state.copymeterDetailListData.newcopymeterDetailList || [], 'id') : [];
        if (entity == null || arr.indexOf(id) > -1) {
            actions.copyMeterDetailOperation(['COPYMETER_DEL', {id: id}]);
        } else {
            actions.deleteCopyMeterDetail(param, (json) => {
                if (json.success) {
                    this.getCopyMeterDetailList();
                } else {
                    message.error(json.msg);
                }
            });
        }
    }

    componentWillMount() {
        this.getCopyMeterEntity();
        this.getCopyMeterDetailList();
        this.getMeterType();
    }

    render() {

        const {commState, state, actions} = this.props;

        const copymeter = state.copymeterEntity;
        const code = commState.codeEntity;

        const copyMeterDetails = state.copymeterDetailListData || [];
        const copyMeterDetaillist = copyMeterDetails.list;

        const meters = state.meterListData || [];
        const metersList = meters.list;


        return (
            <div className="eam-tab-page">
                <div className="eam-content">

                    <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                        <Panel header={<span className="label">基本信息<Icon type="caret-down"/></span>} key="1"
                               style={this.customPanelStyle}>
                            <NewFormComponent entity={copymeter} commActions={commActions} commState={commState}
                                              actions={actions} state={state}
                                              code={code}
                                              wrappedComponentRef={meterForm => this.meterForm = meterForm}/>
                        </Panel>
                        <Panel header={<span className="label">抄表信息<Icon type="caret-down"/></span>} key="2"
                               style={this.customPanelStyle}>
                            <Table
                                rowSelection={this.rowSelection}
                                rowKey="id"
                                loading={this.state.taskstepsLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={copyMeterDetaillist}
                                columns={this.copymeterDetailColumns}
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
                                <Button type="primary" size="large" onClick={this.copymeterDetailAdd}>新增</Button>

                                </div>
                            {/*}*/}
                        </Panel>
                    </Collapse>
                </div>
                <EamModal
                    title={`选择仪表信息`}
                    ref={copymeterModal => this.copymeterModal = copymeterModal}
                    width={1200}
                >
                    <Table
                        rowSelection={this.copymeterModalRowSelection}
                        rowKey="id"
                        dataSource={metersList}
                        columns={this.metercolumns}
                        bordered
                    />
                    <div className="modal-footer clearfix">
                        <Button size="large" onClick={() => {
                            this.copymeterModal.modalHide()
                        }}>取消</Button>
                        <Button type="primary" size="large" onClick={this.copymeterdetailSave}>确定</Button>
                    </div>
                </EamModal>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        state: state.daily,
        commState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commActions: bindActionCreators(commActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(ItemDetailComponent);
