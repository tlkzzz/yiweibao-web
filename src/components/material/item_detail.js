/**
 * 维保保养-维保工单-工单提报
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link, browserHistory} from 'react-router';
import actions from '../../actions/material.js';
import commActions from '../../actions/common.js';
import EamModal from '../../components/common/modal.js';

import Dropdown from '../../components/common/dropdown.js';

import {
    Icon,
    Button,
    Table,
    Pagination,
    Collapse,
    Form,
    Input,
    Row,
    Col,
    Select,
    Radio,
    Checkbox,
    InputNumber
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

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };
        this.columns = [

            {
                title: '编码',
                dataIndex: 'code',
                key: 'code',
                sorter: true,
                render: (text, record, key) => {
                    return (

                        <p><a href="javascript:;" onClick={() => {
                            this.unitSelect(record.id, record.description)
                        }} className="order-number">{text ? text : '-'}</a></p>

                    )
                }
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                render: defaultRender
            },
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                render: defaultRender
            },
        ];

        this.ordercolumns = [
            {
                title: '编码',
                dataIndex: 'code',
                key: 'code',
                render: (text, record, key) => {
                    return (

                        <p><a href="javascript:;" onClick={() => {
                            this.orderunitSelect(record.id, record.description)
                        }} className="order-number">{text ? text : '-'}</a></p>

                    )
                }
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                render: defaultRender
            },
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                render: defaultRender
            }
        ];
        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.rowSelectionRows = selectedRows;
            },
        };
    }

    orderunitSelect = (id, name) => {
        const {form} = this.props;
        form.setFieldsValue({"orderUnit": id, "orderUnitName": name});
        this.taskStepsClose();
    }
    unitSelect = (id, name) => {
        const {form} = this.props;
        form.setFieldsValue({"issueUnit": id, "issueUnitName": name});
        this.taskStepsClose();
    }

    componentDidUpdate() {
        const {state, actions} = this.props;
        if (state.getFormValues) {
            actions.getFormValues(false);
            this.itemAdd();
        }
    }

    itemAdd = () => {
        const {actions, commState} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                for (let attr in values) {
                    if (values[attr] === null || values[attr] == "") delete values[attr];
                }

                const param = {
                    ...values,
                    orgId: commState.orgId,
                    siteId: commState.siteId,
                }
                const listParam = {
                    pageNum: 1,
                    pageSize: 10,
                    siteId: commState.siteId,
                    orgId: commState.orgId,
                }
                const id = param.id;
                if (id == undefined || id == '') {
                    actions.itemSave(param, (json) => {
                        if (json.success) {
                            // actions.itemGetList(listParam, () => {
                            // });
                            // let json = {};
                            // json.id = json.data.id;
                            // localStorage.setItem('item', JSON.stringify(json));
                            // localStorage.setItem('LIST_PARAM', JSON.stringify(listParam));
                            browserHistory.push('/material/item')
                            browserHistory.push(`/material/item/item_detail?id=${json.data.id}`);
                        } else {
                            message.error(json.msg);
                        }
                    });
                } else {
                    actions.itemUpdate(param, (json) => {
                        if (json.success) {
                            // actions.itemGetList(listParam, () => {
                            // });
                            // browserHistory.push('/material/item/item_detail?id');
                        } else {
                            message.error(json.msg);
                        }
                    });
                }
            }
        });
    }


    orderunitAdd = () => {
        this.orderunitAddModel.modalShow();
    }
    unitAdd = () => {
        this.unitAddModel.modalShow();
    }

    getUnitList = () => {
        const {actions} = this.props;
        this.setState({tableLoading: true});
        actions.getUnit({}, () => {
            this.setState({tableLoading: false});
        });
    }
    taskStepsClose = () => {
        this.unitAddModel.modalHide();
        this.orderunitAddModel.modalHide();
    }

    componentWillMount() {
        this.getUnitList();
    }

    render() {
        const {entity} = this.props;
        const {code} = this.props;
        const {state} = this.props;

        const unitdata = state.unitList;

        const {getFieldDecorator} = this.props.form;


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
                            label="物资编号"
                        >
                            {
                                getFieldDecorator('itemNum', {
                                    rules: [{required: true, message: '请输入编号!'}],
                                    initialValue: entity ? entity.itemNum : code
                                })(
                                    <Input placeholder="请输入编号" disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 9}}>
                        <FormItem
                            label="物资名称"
                        >
                            {
                                getFieldDecorator('description', {
                                    rules: [{required: true, message: '请输入物资名称!'}],
                                    initialValue: entity ? entity.description : ''
                                })(
                                    entity ? <Input placeholder="请输入物资名称" disabled/> : <Input placeholder="请输入物资名称"/>
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
                                    initialValue: entity ? entity.status ? "true" : "false" : "true"
                                })(
                                    <Select disabled size="large" style={{width: '100%'}}>
                                        <Option value="true">活动</Option>
                                        <Option value="false">不活动</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>

                    <Col className="gutter-row" xs={{span: 12}}>
                        <FormItem
                            label="品牌"
                        >
                            {
                                getFieldDecorator('brand', {
                                    initialValue: entity ? entity.brand : '',
                                    rules: [{required: true, message: '请输入品牌!'}]
                                })(
                                    entity ? <Input placeholder="请输入品牌" disabled/> : <Input placeholder="请输入品牌"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 0}}>
                        <FormItem
                        >
                            {
                                getFieldDecorator('orderUnit', {initialValue: entity ? entity.orderUnit : ''})(
                                    <Input type='hidden'/>
                                )
                            }
                        </FormItem>
                    </Col>

                    <Col className="gutter-row" xs={{span: 12}}>
                        <FormItem
                            label="订购单位"
                        >
                            {
                                getFieldDecorator('orderUnitName', {initialValue: entity ? entity.orderUnitName : ''})(
                                    entity ? <Input disabled/> : <Input placeholder="请输入订购单位"
                                                                        suffix={<Icon type="plus"
                                                                                      onClick={this.orderunitAdd}/> }
                                                                        onClick={this.orderunitAdd}
                                                                        readOnly/>
                                )
                            }
                            <EamModal
                                width={800}
                                title={`选择订购单位`}
                                ref={orderunitAddModel => this.orderunitAddModel = orderunitAddModel}
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
                                            dataSource={unitdata}
                                            columns={this.ordercolumns}
                                            bordered
                                            onChange={this.tableChange}
                                            scroll={{y: 240}}
                                        />
                                        {/*<Pagination*/}
                                        {/*total={unitdata.total}*/}
                                        {/*className="pull-left title-pagination"*/}
                                        {/*current={this.state.currentPage}*/}
                                        {/*onChange={this.pageChange}*/}
                                        {/*/>*/}
                                    </Col>
                                </Row>
                                {/*<div className="modal-footer clearfix">*/}
                                {/*<Pagination*/}
                                {/*total={unitdata.total}*/}
                                {/*className="pull-left"*/}
                                {/*showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}*/}
                                {/*current={this.state.currentPage}*/}
                                {/*onChange={this.pageChange}*/}
                                {/*style={{padding: 0}}*/}
                                {/*/>*/}
                                {/*<Button type="primary" size="large" onClick={this.taskStepsClose}>取消</Button>*/}
                                {/*</div>*/}
                            </EamModal>
                        </FormItem>
                    </Col>

                    <Col className="gutter-row" xs={{span: 12}}>
                        <FormItem
                            label="型号"
                        >
                            {
                                getFieldDecorator('model', {
                                    initialValue: entity ? entity.model : '',
                                    rules: [{required: true, message: '请输入品牌!'}]
                                })(
                                    entity ? <Input placeholder="请输入型号" disabled/> : <Input placeholder="请输入型号"/>
                                )
                            }
                        </FormItem>
                    </Col>

                    <Col className="gutter-row" xs={{span: 0}}>
                        <FormItem
                        >
                            {
                                getFieldDecorator('issueUnit', {initialValue: entity ? entity.issueUnit : ''})(
                                    <Input type='hidden'/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 12}}>
                        <FormItem
                            label="发放单位"
                        >
                            {
                                getFieldDecorator('issueUnitName', {initialValue: entity ? entity.issueUnitName : ''})(
                                    entity ? <Input disabled/> : <Input placeholder="请输入发放单位"
                                                                        suffix={<Icon type="plus"
                                                                                      onClick={this.unitAdd}/> }
                                                                        onClick={this.unitAdd}
                                                                        readOnly/>
                                )
                            }
                            <EamModal
                                width={800}
                                title={`选择发放单位`}
                                ref={unitAddModel => this.unitAddModel = unitAddModel}
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
                                            dataSource={unitdata}
                                            columns={this.columns}
                                            bordered
                                            onChange={this.tableChange}
                                            scroll={{y: 240}}
                                        />
                                        {/*<Pagination*/}
                                        {/*total={unitdata.total}*/}
                                        {/*className="pull-left title-pagination"*/}
                                        {/*current={this.state.currentPage}*/}
                                        {/*onChange={this.pageChange}*/}
                                        {/*/>*/}
                                    </Col>
                                </Row>
                                {/*<div className="modal-footer clearfix">*/}
                                {/*<Pagination*/}
                                {/*total={unitdata.total}*/}
                                {/*className="pull-left"*/}
                                {/*showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}*/}
                                {/*current={this.state.currentPage}*/}
                                {/*onChange={this.pageChange}*/}
                                {/*style={{padding: 0}}*/}
                                {/*/>*/}
                                {/*<Button type="primary" size="large" onClick={this.taskStepsClose}>取消</Button>*/}
                                {/*</div>*/}
                            </EamModal>
                        </FormItem>
                    </Col>

                    <Col className="gutter-row" xs={{span: 12}}>
                        <FormItem
                            label="发放最大数量"
                        >
                            {
                                getFieldDecorator('maxIssue', {initialValue: entity ? entity.maxIssue : 0})(
                                    entity ? <InputNumber disabled/> : <InputNumber min={0}/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>

                        <FormItem
                            label="是否为设备"
                        >
                            {
                                getFieldDecorator('asset', {initialValue: entity ? entity.asset ? "true" : "false" : "true"})(
                                    <RadioGroup size="large" className="radio-group-col-2" style={{width: '100%'}}>
                                        <RadioButton value="true">是</RadioButton>
                                        <RadioButton value="false">否</RadioButton>
                                    </RadioGroup>
                                )
                            }
                        </FormItem>
                    </Col>

                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="是否为工具"
                        >
                            {
                                getFieldDecorator('tools', {initialValue:  entity ? entity.tools ? "true" : "false" : "true"})(
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

class ItemDetailComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
        }


        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

        this.param = {}
    }

    //根据id查询实体
    getITemEntity = () => {
        const {commActions, actions, commState} = this.props;
        let id = this.props.location.query.id;

        if (id == '' || id == undefined) {
            this.param = {modelKey: "item", siteId: commState.siteId, orgId: commState.orgId};

            commActions.codeGenerator(this.param, () => {
            });

            this.param = {id: id};
            actions.findItemById(this.param, () => {
            });

        } else {
            this.param = {id: id};
            const {actions} = this.props;
            actions.findItemById(this.param, () => {
            });
        }
    }

    componentWillMount() {
        this.getITemEntity();
    }

    render() {

        const {commState, state, actions} = this.props;
        const item = state.itemEntity;
        const code = commState.codeEntity;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">

                    <Collapse bordered={false} defaultActiveKey={['1']}>
                        <Panel header={<span className="label">台账信息<Icon type="caret-down"/></span>} key="1"
                               style={this.customPanelStyle}>
                            <NewFormComponent entity={item} commState={commState} actions={actions} state={state}
                                              code={code}/>
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
