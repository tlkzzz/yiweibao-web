/**
 * 维保保养-维保工单-工单提报 
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import actions from '../../actions/material.js';
import commonActions from '../../actions/common';

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
    Checkbox,
    message,
    InputNumber,
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
        const {state} = this.props;
        this.param = {
            siteId: commonState.siteId,
            orgId: commonState.orgId,
            pageNum: 1,
            pageSize: 10,
            productArray: commonState.productArray,
        }


        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };
        //物资编码字段
        //表格字段
        this.itemColumns = [
            {
                title: '物资编码',
                dataIndex: 'itemNum',
                key: 'itemNum',
                render: (text, record, key) => {
                    return (

                        <p><a href="javascript:;" onClick={() => {
                            this.selectItem(record.id, record.itemNum, record.description)
                        }} className="order-number">{text ? text : '-'}</a></p>
                    )
                }
            },
            {
                title: '物资名称',
                dataIndex: 'description',
                key: 'description',
                render: defaultRender
            },
            {
                title: '品牌',
                dataIndex: 'brand',
                key: 'brand',
                render: defaultRender
            },
            {
                title: '型号',
                dataIndex: 'model',
                key: 'model',
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: defaultRender
            },
            {
                title: '是否工具',
                dataIndex: 'tools',
                key: 'tools',
                render: (text, record, key) => {
                    return (

                        <p><Checkbox checked={text} disabled/></p>
                    )
                }
            },
            {
                title: '是否设备设施',
                dataIndex: 'asset',
                key: 'asset',
                render: (text, record, key) => {
                    return (
                        <p><Checkbox checked={text} disabled/></p>
                    )
                }
            }
        ];

        //表格字段
        this.storeroomcolumns = [
            {
                title: '库房编号',
                dataIndex: 'storeroomNum',
                key: 'storeroomNum',
                render: (text, record, key) => {
                    return (

                        <p><a href="javascript:;" onClick={() => {
                            this.selectStoreroom(record.id, record.storeroomNum, record.storeroomName)
                        }} className="order-number">{text ? text : '-'}</a></p>
                    )
                }
            },
            {
                title: '库房名称',
                dataIndex: 'storeroomName',
                key: 'storeroomName',
                render: defaultRender
            },
            {
                title: '科目',
                dataIndex: 'controlacc',
                key: 'controlacc',
                render: defaultRender
            },
            {
                title: '负责人名称',
                dataIndex: 'personName',
                key: 'personName',
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: defaultRender
            },
            {
                title: '是否设置为缺省库房',
                dataIndex: 'isdefault',
                key: 'isdefault',
                render: (text, record, key) => {
                    return (

                        <p><Checkbox checked={text} disabled/></p>
                    )
                }

            }
        ];


        this.issueUnitcolumns = [
            {
                title: '编码',
                dataIndex: 'code',
                key: 'code',
                render: (text, record, key) => {
                    return (

                        <p><a href="javascript:;" onClick={() => {
                            this.issueUnitSelect(record.id, record.description);
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
    }

    componentDidUpdate() {
        const {state, formValueArr} = this.props;
        if (state.getFormValues) {
            actions.getFormValues(false);
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    for (let attr in values) {
                        if (values[attr] === null || values[attr] == "") delete values[attr];
                    }
                    formValueArr[0] = values;
                }
            });
        }
    }

    //选择物资
    selectItem = (id, itemNum, itemName) => {
        const {form} = this.props;

        form.setFieldsValue({'itemId': id, 'itemNum': itemNum, 'itemName': itemName,});
        this.taskStepsClose();
    }

    // 选择库房
    selectStoreroom = (id, storeroomNum, storeroomName) => {
        const {form} = this.props;
        form.setFieldsValue({'storeroomId': id, 'storeroomNum': storeroomNum, 'storeroomName': storeroomName,});
        this.taskStepsClose();
    }

    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({currentPage: page});
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }

    inventoryPageChang = (page, pageSize) => {
        this.setState({currentPage: page});
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getItemList();
    }

    getList = () => {
        const {commonActions} = this.props;
        this.setState({tableLoading: true});
        commonActions.classifiGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    }


    //物料编码
    getItemList = () => {
        const {actions} = this.props;
        this.setState({tableLoading: true});
        actions.itemGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    }

    getStoreroomList = (itemNum) => {
        const {actions, commonState} = this.props;
        const param = {itemNum: itemNum, siteId: commonState.siteId, orgId: commonState.orgId}

        actions.findUsableStoreRoom(param, () => {
            this.setState({tableLoading: false});
        });
    }

    storeroomtableChange = (page, pageSize) => {
        this.setState({currentPage: page});
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        const {form} = this.props;
        const itemNum = form.getFieldValue('itemNum');
        this.getStoreroomList(itemNum);
    }

    userAdd = () => {
        this.getItemList();
        this.userAddModal.modalShow();

    }
    unitAdd = () => {
        this.unitAddModel.modalShow();
    }

    issueUnitSelect = (id, name) => {
        const {form} = this.props;
        form.setFieldsValue({"issueUnit": id, "issueUnitName": name});
        this.taskStepsClose();
    }
    storeroomAdd = () => {
        const {form} = this.props;
        const itemNum = form.getFieldValue('itemNum');
        this.setState({tableLoading: true});
        if (itemNum == '' || itemNum == undefined) {
            message.error("请选择物资");
            return;
        } else {
            this.getStoreroomList(itemNum);
            this.storeroomModal.modalShow();
        }
    }


    taskStepsClose = () => {
        this.userAddModal.modalHide();
        this.storeroomModal.modalHide();
        this.unitAddModel.modalHide();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {entity} = this.props;
        const {state} = this.props;
        const data = state.itemListData;//*** 拿到请求返回的数据
        const unitdata = state.unitList;
        const itemlist = data.list;
        const storeroomdata = state.storeroomListData;
        const storeroomlist = storeroomdata.list;

        const {commonState} = this.props;

        const inventroyStatus = commonState.inventoryStatusData;


        const classifiList = commonState.classifiListData;
        const classifi = classifiList.list;


        return (

            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col xs={{span: 0}}>
                        <FormItem
                        >
                            {
                                getFieldDecorator('id', {initialValue: entity ? entity.id : ""})(
                                    <Input type="hidden"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col xs={{span: 0}}>
                        <FormItem
                        >
                            {
                                getFieldDecorator('itemId', {initialValue: entity ? entity.itemId : ""})(
                                    <Input type="hidden"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col xs={{span: 0}}>
                        <FormItem
                        >
                            {
                                getFieldDecorator('storeroomId', {initialValue: entity ? entity.storeroomId : ""})(
                                    <Input type="hidden"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 4}}>
                        <FormItem
                            label="物资编码"
                        >
                            {
                                getFieldDecorator('itemNum', {
                                    rules: [{required: true, message: '物资编码不能为空!'}],
                                    initialValue: entity ? entity.itemNum : ''
                                })(
                                    entity ? <Input disabled/> : <Input placeholder="请选择物资编码"
                                                                        suffix={<Icon type="plus"
                                                                                      onClick={this.userAdd}/> }
                                                                        onClick={this.userAdd}
                                                                        readOnly/>
                                )
                            }
                            <EamModal
                                width={800} d
                                title={`选择物资编码`}
                                ref={userAddModal => this.userAddModal = userAddModal}
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
                                            dataSource={itemlist}
                                            columns={this.itemColumns}
                                            bordered
                                            onChange={this.tableChange}
                                        />
                                        <Pagination
                                            total={data.total}
                                            className="pull-left title-pagination"
                                            current={this.state.currentPage}
                                            onChange={this.inventoryPageChang}
                                        />
                                    </Col>
                                </Row>
                                <div className="modal-footer clearfix">
                                    <Pagination
                                        total={data.total}
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
                    <Col className="gutter-row" xs={{span: 8}}>
                        <FormItem
                            label="物资名称"
                        >
                            {
                                getFieldDecorator('itemName', {
                                    rules: [{required: true, message: '物资名称不能为空!'}],
                                    initialValue: entity ? entity.itemName : ''
                                })(
                                    <Input placeholder="请选择物资编码" disabled/>
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
                                    initialValue: entity ? entity.status : 'draft'
                                })
                                (
                                    <Select disabled size="large" style={{width: '100%'}}>
                                        {
                                            inventroyStatus.map((item, i) => <Option key={i}
                                                                                     value={item.value}>{item.description}</Option>)
                                        }
                                    </Select>
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
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{span: 4}}>
                        <FormItem
                            label="库房"
                        >
                            {
                                getFieldDecorator('storeroomNum', {
                                    rules: [{required: true, message: '库房不能为空!'}],
                                    initialValue: entity ? entity.storeroomNum : ''
                                })
                                (
                                    entity ? <Input disabled/> : <Input placeholder="请输入选择库房"
                                                                        suffix={<Icon type="plus"
                                                                                      onClick={this.storeroomAdd}/> }
                                                                        onClick={this.storeroomAdd}
                                                                        readOnly/>
                                )
                            }
                            <EamModal
                                width={800}
                                title={`选择库房`}
                                ref={storeroomModal => this.storeroomModal = storeroomModal}
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
                                            dataSource={storeroomlist}
                                            columns={this.storeroomcolumns}
                                            bordered
                                            onChange={this.storeroomtableChange}
                                        />
                                        <Pagination
                                            total={storeroomdata.total}
                                            className="pull-left title-pagination"
                                            current={this.state.currentPage}
                                            onChange={this.pageChange}
                                        />
                                    </Col>
                                </Row>
                                <div className="modal-footer clearfix">
                                    <Pagination
                                        total={storeroomdata.total}
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
                    <Col className="gutter-row" xs={{span: 8}}>
                        <FormItem
                            label="库房名称"
                        >
                            {
                                getFieldDecorator('storeroomName', {
                                    rules: [{required: true, message: '库房不能为空!'}],
                                    initialValue: entity ? entity.storeroomName : ''
                                })(
                                    <Input disabled/>
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
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="发放单位"
                        >
                            {
                                getFieldDecorator('issueUnitName', {
                                    initialValue: entity ? entity.issueUnitName : ''
                                })
                                (
                                    entity ? <Input disabled/> : <Input placeholder="请选择发放单位"
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
                                            columns={this.issueUnitcolumns}
                                            bordered
                                            onChange={this.tableChange}
                                            scroll={{y: 240}}
                                        />
                                        {/*<Pagination*/}
                                        {/*total={classifiList.total}*/}
                                        {/*className="pull-left title-pagination"*/}
                                        {/*current={this.state.currentPage}*/}
                                        {/*onChange={this.pageChange}*/}
                                        {/*/>*/}
                                    </Col>
                                </Row>
                                <div className="modal-footer clearfix">
                                    {/*<Pagination*/}
                                    {/*total={classifiList.total}*/}
                                    {/*className="pull-left"*/}
                                    {/*showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}*/}
                                    {/*current={this.state.currentPage}*/}
                                    {/*onChange={this.pageChange}*/}
                                    {/*style={{padding: 0}}*/}
                                    {/*/>*/}
                                </div>
                            </EamModal>
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="是否周转?"
                        >
                            {
                                getFieldDecorator('turnOver', {
                                    initialValue: entity ? entity.turnOver ? 'true' : 'false' : 'false'
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
//余量与成本信息
class BuyFormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            tableLoading: false,
            treeLoading: false,
        }

        const {commonState} = this.props;
        this.param = {
            orgId: commonState.orgId,
            pageNum: 1,
            pageSize: 10,
            //  productArray: commonState.productArray,
        }


    }

    componentDidUpdate() {
        const {state, actions, form, formValueArr} = this.props;
        if (state.getFormValues) {
            actions.getFormValues(false);
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    for (let attr in values) {
                        if (values[attr] === null || values[attr] == "") delete values[attr];
                    }
                    formValueArr[1] = values;
                }
            });
        }
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
        this.getList();
    }

    parentAdd = () => {
        this.parentAddModal.modalShow();
    }

    taskStepsClose = () => {
        this.parentAddModal.modalHide();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {entity} = this.props;


        // const list = data.list;

        const {commonActions} = this.props;
        const {commonState} = this.props;

        const costType = commonState.inventoryCostTypeData;
        const abcType = commonState.inventoryABCTypeData;
        const classifiList = commonState.classifiListData;
        const classifi = classifiList.list;
        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="标准成本"
                        >
                            {
                                getFieldDecorator('standardCost', {
                                    rules: [{required: true, message: '标准成本不能为空且只能为数字!'}],
                                    initialValue: entity ? entity.standardCost : '0.00'
                                })(
                                    entity ? <InputNumber
                                        disabled/> : <InputNumber min={0} placeholder="请输入标准成本"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="当前余量"
                        >
                            {
                                getFieldDecorator('currentBalance', {
                                    rules: [{required: false, message: '当前余量只能为数字!'}],
                                    initialValue: entity ? entity.currentBalance : ''
                                })(
                                    entity ? <InputNumber disabled/> :
                                        <InputNumber min={0} precision={2} placeholder="请输入当前余量"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="*平均成本"
                        >
                            {
                                getFieldDecorator('averageCost', {
                                    rules: [{required: false, message: '平均成本只能为数字!'}],
                                    initialValue: entity ? entity.averageCost : ''
                                })(
                                    entity ? <InputNumber disabled/> :
                                        <InputNumber min={0} precision={2} placeholder="请输入平均成本"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="预留余量"
                        >
                            {
                                getFieldDecorator('reservationNumber', {
                                    rules: [{required: false, message: '预留余量只能为数字!'}],
                                    initialValue: entity ? entity.reservationNumber : ''
                                })(
                                    entity ? <InputNumber disabled/> :
                                        <InputNumber min={0} precision={2} placeholder="请输入预留余量"/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="上次接收成本"
                        >
                            {
                                getFieldDecorator('lastReceiveCost', {
                                    rules: [{required: false, message: '上次接收成本只能为数字!'}],
                                    initialValue: entity ? entity.lastReceiveCost : ''
                                })(
                                    entity ? <InputNumber disabled/> :
                                        <InputNumber min={0} precision={2} placeholder="请输入上次接收成本"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="*可用数量"
                        >
                            {
                                getFieldDecorator('availableBalance', {
                                    rules: [{required: false, message: '可用数量只能为数字!'}],
                                    initialValue: entity ? entity.availableBalance : ''
                                })(
                                    entity ? <InputNumber disabled/> :
                                        <InputNumber min={0} precision={2} placeholder="请输入可用数量"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="发放成本类型"
                        >
                            {
                                getFieldDecorator('costTypeId', {
                                    initialValue: entity ? entity.costTypeId : ''
                                })(
                                    <Select size="large" style={{width: '100%'}}>
                                        {
                                            costType.map((item, i) => <Option key={i}
                                                                              value={item.value}>{item.description}</Option>)
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="ABC类型"
                        >
                            {
                                getFieldDecorator('abcType', {
                                    initialValue: entity ? entity.abcType : ''
                                })(
                                    <Select size="large" style={{width: '100%'}}>
                                        {
                                            abcType.map((item, i) => <Option key={i}
                                                                             value={item.value}>{item.description}</Option>)
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const BFormComponent = Form.create()(BuyFormComponent);

//重订购

class RBuyComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            tableLoading: false,
            treeLoading: false,
        }

        const {commonState} = this.props;
        this.param = {
            orgId: commonState.orgId,
            pageNum: 1,
            pageSize: 10,
            //   productArray: commonState.productArray,
        }


        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        this.issueunitcolumns = [

            {
                title: '编码',
                dataIndex: 'code',
                key: 'code',
                sorter: true,
                render: (text, record, key) => {
                    return (

                        <p><a href="javascript:;" onClick={() => {
                            this.unitSelect(record.id, record.description);
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
    }

    componentDidUpdate() {
        const {state, actions, commonState, formValueArr} = this.props;
        if (state.getFormValues) {
            actions.getFormValues(false);
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    for (let attr in values) {
                        if (values[attr] === null || values[attr] == "") delete values[attr];
                    }
                    formValueArr[2] = values;

                    const FormValuesArr = formValueArr;
                    console.log(FormValuesArr);
                    if (FormValuesArr[0] != undefined && FormValuesArr[1] != undefined && FormValuesArr[2] != undefined && FormValuesArr.length === 3) {
                        const param = Object.assign(FormValuesArr[0], FormValuesArr[1], FormValuesArr[2]);
                        param.siteId = commonState.siteId;
                        param.orgId = commonState.orgId;

                        console.log(param);
                        const listParam = {
                            pageNum: 1,
                            pageSize: 10,
                            siteId: commonState.siteId,
                            orgId: commonState.orgId,
                        }
                        const id = param.id;
                        if (id == undefined || id == '') {
                            actions.inventorySave(param, (json) => {
                                if (json.success) {
                                    browserHistory.push('/material/inventory')
                                    browserHistory.push(`/material/inventory/inventory_detail?id=${json.data.id}`);
                                } else {
                                    message.error(json.msg);
                                }
                            });
                        } else {
                            actions.inventoryUpdate(param, (json) => {
                                if (json.success) {
                                    // actions.inventoryGetList(listParam);
                                    // browserHistory.push('/material/inventory');
                                } else {
                                    message.error(json.msg);
                                }
                            });
                        }
                    }
                }
            });
        }
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
        //this.getList();
    }

    unitSelect = (id, name) => {
        const {form} = this.props;
        form.setFieldsValue({"orderUnit": id, "orderUnitName": name});
        this.taskStepsClose();
    }
    userAdd = () => {
        this.orderunitAddModel.modalShow();
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const {entity} = this.props;
        const {state} = this.props;

        const unitdata = state.unitList;
        const {commonActions} = this.props;
        const {commonState} = this.props;
        const classifiList = commonState.classifiListData;
        const classifi = classifiList.list;


        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="是否重订购？"
                        >
                            {
                                getFieldDecorator('reorder', {
                                    initialValue: entity ? entity.reorder ? "true" : "false" : "true"
                                })(
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
                            label="提前时间(天)"
                        >
                            {
                                getFieldDecorator('deliveryTime', {
                                    rules: [{required: false, message: '提前时间只能(天)为数字!'}],
                                    initialValue: entity ? entity.deliveryTime : ''
                                })(
                                    entity ? <InputNumber disabled/> : <InputNumber min={0} placeholder="请输入提前时间(天)"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="重购重点"
                        >
                            {
                                getFieldDecorator('reorderPoint', {
                                    initialValue: entity ? entity.reorderPoint : ''
                                })
                                (
                                    <Input placeholder="请输入重购重点"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="经济订购量"
                        >
                            {
                                getFieldDecorator('economicOrderQuantity', {
                                    rules: [{required: false, message: '经济订购量为数字!'}],
                                    initialValue: entity ? entity.economicOrderQuantity : ''
                                })
                                (
                                    <InputNumber min={0} placeholder="请输入经济订购量"/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="安全库存"
                        >
                            {
                                getFieldDecorator('safeStock', {
                                    rules: [{required: false, message: '安全库存为数字!'}],
                                    initialValue: entity ? entity.safeStock : ''
                                })
                                (
                                    entity ? <InputNumber disabled/> : <InputNumber min={0} placeholder="请输入安全库存"/>
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
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="订购单位"
                        >
                            {
                                getFieldDecorator('orderUnitName', {
                                    initialValue: entity ? entity.orderUnitName : ''
                                })
                                (
                                    entity ? <Input disabled/> : <Input placeholder="请选择订购单位"
                                                                        suffix={<Icon type="plus"
                                                                                      onClick={this.userAdd}/> }
                                                                        onClick={this.userAdd}
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
                                            scroll={{y: 240}}
                                            dataSource={unitdata}
                                            columns={this.issueunitcolumns}
                                            rowSelection={this.rowSelection}
                                            bordered
                                            onChange={this.tableChange}
                                        />
                                    </Col>
                                </Row>
                            </EamModal>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const RBuyFormComponent = Form.create()(RBuyComponent)

class InventoryDetailComponent extends React.Component {
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

        // 盘点记录表格字段
        this.checkColumns = [
            {
                title: '盘点单',
                dataIndex: 'checkNum',
                key: 'checkNum',
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
                title: '实际库存量',
                dataIndex: 'availableBalance',
                key: 'availableBalance',
                sorter: true,
                render: defaultRender
            },
            {
                title: '盘点负责人',
                dataIndex: 'checkPerson',
                key: 'checkPerson',
                sorter: true,
                render: defaultRender
            },
            {
                title: '盘点日期',
                dataIndex: 'updateDate',
                key: 'updateDate',
                sorter: true,
                render: defaultRender
            },
        ];
    }

    // 设备设施信息
    getInventoryEntity = () => {
        let id = this.props.location.query.id;
        this.param = {id: id};
        const {actions} = this.props;
        actions.findInventoryDetailById(this.param, () => {
        });
    }


    getCheckList = () => {
        let id = this.props.location.query.id;
        this.param = {id: id, pageNum: 0, pageSize: 10};
        const {actions} = this.props;
        this.setState({tableLoading: true});
        actions.findMaterialCheckByInvtoryId(this.param, () => {
            this.setState({tableLoading: false});
        });
    }

    getInventoryStatus = () => {
        const {commonActions, commonState} = this.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'costtype', 'INVENTORY_COST_TYPE');
        commonActions.getDomainValue(domainValueParam, 'abctype', 'INVENTORY_ABC_TYPE');
        commonActions.getDomainValue(domainValueParam, 'inventoryStatus', 'INVENTORY_STATUS');
    }

    getUnitList = () => {
        const {actions} = this.props;
        this.setState({tableLoading: true});
        actions.getUnit({}, () => {
            this.setState({tableLoading: false});
        });
    }

    componentWillMount() {
        this.getInventoryEntity();
        this.getCheckList();
        this.getInventoryStatus();
        this.getUnitList();
    }

    render() {
        const {state, commonState, actions} = this.props;
        const data = state.inventoryEntity;
        const checkdata = state.checkByInvtoryListData;
        const checkList = checkdata.list;
        const formValueArr = [];

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3', '4']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down"/></span>} key="1"
                               style={this.customPanelStyle}>
                            <NewFormComponent formValueArr={formValueArr} actions={actions} state={state}
                                              commonActions={commonActions}
                                              commonState={commonState} entity={data }/>
                        </Panel>
                        <Panel header={<span className="label">余量与成本 <Icon type="caret-down"/></span>} key="2"
                               style={this.customPanelStyle}>
                            <BFormComponent actions={actions} formValueArr={formValueArr} state={state} entity={data}
                                            commonState={commonState} commonActions={commonActions}/>
                        </Panel>
                        <Panel header={<span className="label">重订购 <Icon type="caret-down"/></span>} key="3"
                               style={this.customPanelStyle}>
                            <RBuyFormComponent formValueArr={formValueArr} actions={actions} entity={data} state={state}
                                               commonState={commonState} commonActions={commonActions}/>
                        </Panel>
                        {data ? <Panel header={<span className="label">盘点记录<Icon type="caret-down"/></span>} key="4"
                                       style={this.customPanelStyle }>
                            <Table
                                rowKey="id"
                                loading={this.state.tableLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={checkList}
                                columns={this.checkColumns}
                                rowSelection={this.rowSelection}
                                bordered
                            />
                        </Panel> : null}
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

export default connect(mapStateToProps, buildActionDispatcher)(InventoryDetailComponent);
