/**
 * 维保保养-维保工单-工单提报 
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import actions from '../../actions/material.js';
import commonActions from '../../actions/common.js';

import Dropdown from '../../components/common/dropdown.js';
import EamModal from '../../components/common/modal.js';
import BackList from '../common/back_list';
import AsideTree from '../common/aside_tree.js';

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
    Checkbox
} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
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

        const {commonState} = this.props;
        this.param = {
            // orgId: commonState.orgId,
            pageNum: 1,
            pageSize: 10,
            // productArray: commonState.productArray,
        }

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        //人员
        this.userColumns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                render: (text, record, key) => {
                    return (
                        <p><a href="javascript:;" onClick={() => {
                            this.onUserAdd(record.personId, record.name)
                        }} className="order-number">{text ? text : '-'}</a></p>

                    )
                }
            },
            {
                title: '职务',
                dataIndex: 'position',
                key: 'position',
                render: defaultRender
            },
            {
                title: '部门',
                dataIndex: 'department',
                key: 'department',
                render: defaultRender
            },
            {
                title: '电话',
                dataIndex: 'mobile',
                key: 'mobile',
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: defaultRender
            }
        ];
    }

    componentDidUpdate() {
        const {state, actions, form} = this.props;
        if (state.getFormValues) {
            actions.getFormValues(false);
            this.stroeroomSave();
        }
    }


    stroeroomSave = () => {

        const {actions, commonState} = this.props;

        this.props.form.validateFields((err, values) => {
            if (!err) {
                for (let attr in values) {
                    if (values[attr] === null || values[attr] == "") delete values[attr];
                }

                const param = {
                    ...values,
                    orgId: commonState.orgId,
                    siteId: commonState.siteId,
                }
                const listParam = {
                    pageNum: 1,
                    pageSize: 10,
                    siteId: commonState.siteId,
                    orgId: commonState.orgId,
                }

                console.log(param)
                const id = param.id;
                if (id == undefined || id == '') {
                    actions.storeroomSave(param, (json) => {
                        if (json.success) {
                            actions.storeroomGetList(listParam, () => {
                            });
                            browserHistory.push('/material/storeroom');
                        } else {
                            message.error(json.msg);
                        }
                    });
                } else {
                    actions.storeroomUpdate(param, (json) => {
                        if (json.success) {
                            actions.storeroomGetList(listParam, () => {
                            });
                            browserHistory.push('/material/storeroom');
                        } else {
                            message.error(json.msg);
                        }
                    });
                }
            }
        });
    }


    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({currentPage: page});
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }


    getList = () => {
        const {commonActions} = this.props;
        this.setState({tableLoading: true});

        commonActions.classifiGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    }

    componentDidMount() {
        // console.log(localStorage) ;
        // this.getList();
    }


    userpageChange = (page, pageSize) => {
        this.setState({currentPage: page});
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getUserList();
    }
    onUserAdd = (id, name) => {
        const {form} = this.props;
        form.setFieldsValue({"personId": id, "personName": name});
        this.taskStepsClose();
    }

    getUserList = () => {
        const {commonActions, commonState} = this.props;

        const param = {
            pageNum: 1,
            pageSize: 10,
            orgIds: [commonState.orgId],
            siteIds: [commonState.siteId]
        }


        this.setState({tableLoading: true});
        commonActions.personGetList(param, () => {
            this.setState({tableLoading: false});
        });
    }

    userAdd = () => {
        this.getUserList();
        this.userAddModal.modalShow();
    }


    taskStepsClose = () => {
        this.userAddModal.modalHide();
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const {entity} = this.props;
        const {code} = this.props;

        const {commonState} = this.props;
        const personListData = commonState.personListData || [];
        const personList = personListData.list;


        const classifiList = commonState.classifiListData;
        const classifi = classifiList.list;


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
                                    <Input type='hidden'/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="库房编码"
                        >
                            {
                                getFieldDecorator('storeroomNum', {
                                    rules: [{required: true, message: '库房编码不能为空!'}],
                                    initialValue: entity ? entity.storeroomNum : code
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="库房名称"
                        >
                            {
                                getFieldDecorator('storeroomName', {
                                    rules: [{required: true, message: '库房名称不能为空!', max: 36}],
                                    initialValue: entity ? entity.storeroomName : ''
                                })(
                                    entity ? <Input disabled/> : <Input placeholder="请输入库房名称"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
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
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="科目"
                        >
                            {
                                getFieldDecorator('controlacc', {
                                    initialValue: entity ? entity.controlacc : ''
                                })
                                (
                                    <Input placeholder="请输入科目"/>
                                )
                            }
                            {/*<EamModal*/}
                            {/*width={800}*/}
                            {/*title={`选择科目`}*/}
                            {/*ref={userAddModal => this.userAddModal = userAddModal}*/}
                            {/*onOk={this.taskStepsAddSave}*/}
                            {/*footer={null}*/}
                            {/*afterClose={this.taskStepsAfterClose}*/}
                            {/*className="select-person"*/}
                            {/*>*/}
                            {/*<Row gutter={16}>*/}
                            {/*<Col className="gutter-row" span={ 24 }>*/}
                            {/*<Table*/}
                            {/*rowKey="id"*/}
                            {/*pagination={false}*/}
                            {/*dataSource={classifi}*/}
                            {/*columns={this.userColumns}*/}
                            {/*rowSelection={this.rowSelection}*/}
                            {/*bordered*/}
                            {/*onChange={this.tableChange}*/}
                            {/*/>*/}
                            {/*<Pagination*/}
                            {/*total={classifiList.total}*/}
                            {/*className="pull-left title-pagination"*/}
                            {/*current={this.state.currentPage}*/}
                            {/*onChange={this.pageChange}*/}
                            {/*/>*/}
                            {/*</Col>*/}
                            {/*</Row>*/}
                            {/*<div className="modal-footer clearfix">*/}
                            {/*<Pagination*/}
                            {/*total={classifiList.total}*/}
                            {/*className="pull-left"*/}
                            {/*showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}*/}
                            {/*current={this.state.currentPage}*/}
                            {/*onChange={this.pageChange}*/}
                            {/*style={{padding: 0}}*/}
                            {/*/>*/}
                            {/*<Button type="primary" size="large" onClick={this.taskStepsClose}>取消</Button>*/}
                            {/*</div>*/}
                            {/*</EamModal>*/}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="科目描述"
                        >
                            {
                                getFieldDecorator('locationCode', {
                                    rules: [{message: '不能超过36个字符!', max: 36}],
                                    initialValue: entity ? entity.locationCode : ''
                                })(
                                    entity ? <Input disabled/> : <Input placeholder="请输入科目描述"/>
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
                                    initialValue: entity ? entity.status : 'true'
                                })
                                (
                                    <Select disabled size="large" style={{width: '100%'}}>
                                        <Option value="true">活动</Option>
                                        <Option value="false">不活动</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>

                    <Col className="gutter-row" xs={{span: 0}}>
                        <FormItem
                        >
                            {
                                getFieldDecorator('personId', {
                                    initialValue: entity ? entity.personId : ''
                                })
                                (
                                    <Input type='hidden'/>
                                )
                            }
                        </FormItem>
                    </Col>

                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="库房管理员"
                        >
                            {
                                getFieldDecorator('personName', {
                                    rules: [{required: true, message: '库房管理员不能为空!'}],
                                    initialValue: entity ? entity.personName : ''
                                })
                                (
                                    entity ? <Input disabled/> : <Input placeholder="请选择库房管理员"
                                                                        suffix={<Icon type="plus"
                                                                                      onClick={this.userAdd}/> }
                                                                        onClick={this.userAdd}
                                                                        readOnly/>
                                )
                            }
                            <EamModal
                                width={800}
                                title={`选择库房管理员`}
                                ref={userAddModal => this.userAddModal = userAddModal}
                                onOk={this.taskStepsAddSave}
                                footer={null}
                                afterClose={this.taskStepsAfterClose}
                                className="select-person"
                            >
                                <Row gutter={16}>
                                    <Col className="gutter-row" span={ 24 }>
                                        <Table
                                            rowKey="personId"
                                            pagination={false}
                                            dataSource={personList}
                                            columns={this.userColumns}
                                            bordered
                                            onChange={this.tableChange}
                                        />
                                        <Pagination
                                            total={personListData.total}
                                            className="pull-left title-pagination"
                                            current={this.state.currentPage}
                                            onChange={this.userpageChange}
                                        />
                                    </Col>
                                </Row>
                                <div className="modal-footer clearfix">
                                    <Pagination
                                        total={personListData.total}
                                        className="pull-left"
                                        showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                                        current={this.state.currentPage}
                                        onChange={this.pageChange}
                                        style={{padding: 0}}
                                    />
                                </div>
                            </EamModal>
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="收货地址"
                        >
                            {
                                getFieldDecorator('deliveryAddress', {
                                    rules: [{required: true, message: '收货地址不能为空!', max: 36}],
                                    initialValue: entity ? entity.deliveryAddress : ''
                                })(
                                    entity ? <Input disabled/> : <Input placeholder="请输入收货地址"/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="缺省库房?"
                        >
                            {
                                getFieldDecorator('isdefault', {
                                    initialValue: entity ? entity.isdefault ? "true" : "false" : "true"
                                })
                                (
                                    <RadioGroup size="large" className="radio-group-col-2" style={{width: '100%'}}>
                                        <RadioButton value="true">是</RadioButton>
                                        <RadioButton value="false">否</RadioButton>
                                    </RadioGroup>
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

class StoreroomDetailComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

    }

    //
    getStoreroomEntity = () => {
        let id = this.props.location.query.id;
        this.param = {id: id};
        const {actions, commonActions, commonState} = this.props;

        actions.findStoreRoomById(this.param, () => {
            // this.setState({tableLoading: false});
        });
        if (id == '' || id == undefined) {
            actions.findStoreRoomById(this.param, () => {
                // this.setState({tableLoading: false});
            });
            this.param = {modelKey: "item", siteId: commonState.siteId, orgId: commonState.orgId}
            commonActions.codeGenerator(this.param, () => {
            });
        } else {
            actions.findStoreRoomById(this.param, () => {
            });
        }
    }

    componentWillMount() {
        this.getStoreroomEntity();
    }

    render() {
        const {state, commonState, actions, commonActions} = this.props;
        const storeroom = state.storeroomEntity;
        const code = commonState.codeEntity;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down"/></span>} key="1"
                               style={this.customPanelStyle}>
                            <NewFormComponent commonActions={commonActions} commonState={commonState}
                                              entity={storeroom} state={state} actions={actions} code={code}/>
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
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(StoreroomDetailComponent);
