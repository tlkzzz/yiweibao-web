/**
 * 维保保养-维保工单-工单提报 
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {filterArrByAttr} from '../../tools/';
import actions from '../../actions/material.js';
import commonActions from '../../actions/common';
import workorderActions from '../../actions/maintenance';
import repairActions from '../../actions/matter_repair'

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
    Menu,
    message, InputNumber,
} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const Option = Select.Option;

class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            ordercurrentPage: 1,
            personcurrentPage: 1,
            tableLoading: false,
        }

        const {commonState} = this.props;
        this.param = {
            pageNum: 1,
            pageSize: 10,
            siteId: commonState.siteId,
            orgId: commonState.orgId,
        }

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };
        //人员字段
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
            },
        ];
        this.storeroomColumns = [
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
            },
        ];

        this.orderColumns = [
            {
                title: '工单编号',
                dataIndex: 'workOrderNum',
                key: 'workOrderNum',
                render: (text, record, key) => {
                    return (

                        <p><a href="javascript:;" onClick={() => {
                            this.selectOrder(record.workOrderNum, record.description)
                        }} className="order-number">{text ? text : '-'}</a></p>

                    )
                }
            },
            {
                title: '工单描述',
                dataIndex: 'description',
                key: 'description',
                render: defaultRender
            },
            {
                title: '位置描述',
                dataIndex: 'locationDesc',
                key: 'locationDesc',
                render: defaultRender
            },
            {
                title: '工单类型',
                dataIndex: 'worktype',
                key: 'worktype',
                render: (text, record, key) => {
                    return (
                        <p>{record.workType === 'PM' ? '保养工单' : '维修工单' }</p>

                    )
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, record, key) => {
                    return (

                        <p>{'待回报'}</p>

                    )
                }
            },
        ];

        this.repaireorderColumns = [
            {
                title: '工单编号',
                dataIndex: 'workOrderNum',
                key: 'workOrderNum',
                render: (text, record, key) => {
                    return (
                        <p><a href="javascript:;" onClick={() => {
                            this.selectOrder(record.workOrderNum, record.description)
                        }} className="order-number">{text ? text : '-'}</a></p>
                    )
                }
            },
            {
                title: '报修描述',
                dataIndex: 'description',
                key: 'description',
                render: defaultRender
            },

            {
                width: '10%',
                title: '是否超时',
                dataIndex: 'executeTimeout',
                key: 'executeTimeout',
                sorter: true,
                render: (text, record) => {
                    return (
                        <p>{text ? '是' : '否'}</p>
                    )
                }
            },
            {
                title: '状态',
                dataIndex: 'workOrderStatus',
                key: 'workOrderStatus',
                render: (text, record, key) => {
                    return (

                        <p>{'待回报'}</p>

                    )
                }
            },
            {
                title: '提报时间',
                dataIndex: 'reportDate',
                key: 'reportDate',
                render: defaultRender
            },
        ];

    }

    componentDidUpdate() {
        const {state, actions} = this.props;
        if (state.getFormValues) {
            actions.getFormValues(false);
            this.releaseSave();
        }
    }

    releaseSave = () => {


        const {state, actions, commonState} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                for (let attr in values) {
                    if (values[attr] === null || values[attr] == "") delete values[attr];
                }
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {

                    const releaseDetailData = state.releasedetailListData || [];
                    const newReleaseDetailList = releaseDetailData.newReleaseDetailList || [];
                    values.updateDate = moment(values.updateDate).format('YYYY-MM-DD HH:mm:ss');
                    values.createDate = moment(values.createDate).format('YYYY-MM-DD HH:mm:ss');

                    const materialReleaseDetailVos = JSON.parse(JSON.stringify(newReleaseDetailList));
                    materialReleaseDetailVos.forEach(item => {
                        item.inventoryId = item.id;
                        delete item.id;
                    });
                    const param = {
                        ...values,
                        siteId: commonState.siteId,
                        orgId: commonState.orgId,
                        materialReleaseDetailVos: materialReleaseDetailVos,
                    }
                    const listParam = {
                        pageNum: 1,
                        pageSize: 10,
                        siteId: commonState.siteId,
                        orgId: commonState.orgId,
                    }
                    // console.log(param);
                    const id = param.id;
                    if (id == undefined || id == '') {

                        actions.releaseSave(param, (json) => {
                            if (json.data) {
                                // this.setState({tableLoading: true});
                                // actions.releaseGetList(listParam, () => {
                                //     // this.setState({tableLoading: false});
                                // });
                                browserHistory.push('/material/release')
                                browserHistory.push(`/material/release/release_detail?id=${json.data.id}`);
                            } else {
                                message.error(json.msg);
                            }
                        });
                    } else {
                        actions.releaseUpdate(param, (json) => {
                            if (json.data) {
                                // this.setState({tableLoading: true});
                                // actions.releaseGetList(listParam, () => {
                                //     // this.setState({tableLoading: false});
                                // });
                                // browserHistory.push('/material/release');
                            } else {
                                message.error(json.msg);
                            }
                        });
                    }
                }, 0);
            }
        });
    }

    // 选择库房
    selectStoreroom = (id, storeroomNum, storeroomName) => {

        const {form} = this.props;
        form.setFieldsValue({
            'fromStoreroomId': id,
            'fromStoreroomNum': storeroomNum,
            'fromStoreroomName': storeroomName,
        });
        this.taskStepsClose();
    }

    getStoreroomList = () => {
        const {actions} = this.props;
        this.setState({tableLoading: true});
        //this.param = {pageSize: 10, pageNum: 0};
        actions.storeroomGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    }

    storeroomAdd = () => {
        this.getStoreroomList();
        this.storeroomModal.modalShow();
    }

    orderpageChange = (page, pageSize) => {
        this.setState({ordercurrentPage: page});
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.orderAdd();
    }

    //工单

    orderAdd = () => {
        const {workorderActions, repairActions, form} = this.props;

        const orderType = form.getFieldValue("orderType");

        if (orderType == '') {
            message.error("请先选择工单类型");
        } else {
            if (orderType == 'PM') {
                this.setState({tableLoading: true});
                const param = {...this.param, status: ["DHB"]}
                workorderActions.workOrderGetList(param, () => {
                    this.setState({tableLoading: false});
                })
            }
            if (orderType == 'BM') {
                this.setState({tableLoading: true});
                const param = {...this.param, status: ["DHB"]}
                repairActions.repairWorkOrderGetList(param, () => {
                    this.setState({tableLoading: false});
                })
            }
            this.orderModal.modalShow();
        }
    }

    selectOrder = (orderNum, orderDescription) => {
        const {form} = this.props;
        form.setFieldsValue({'orderNum': orderNum, 'orderDiscription': orderDescription,});
        this.taskStepsClose();
    }

    personpageChange = (page, pageSize) => {
        this.setState({personcurrentPage: page});
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getUserList();
    }
    storoompageChange = (page, pageSize) => {
        this.setState({currentPage: page});
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getStoreroomList();
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({currentPage: page});
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }

    userAdd = () => {
        this.getUserList();
        this.userAddModal.modalShow();
    }
    getUserList = () => {
        const {commonActions, commonState} = this.props;
        const param = {
            ...this.param,
            siteIds: [commonState.siteId],
            orgIds: [commonState.orgId],
        }
        this.setState({tableLoading: true});
        commonActions.personGetList(param, () => {
            this.setState({tableLoading: false});
        });
    }
    onUserAdd = (id, name) => {
        const {form} = this.props;
        form.setFieldsValue({"personId": id, "consumingPeople": name});
        this.taskStepsClose();
    }


    componentDidMount() {
        // this.getList();
    }


    taskStepsClose = () => {
        this.storeroomModal.modalHide();
        this.orderModal.modalHide();
        this.userAddModal.modalHide();
    }

    render() {

        const {getFieldDecorator} = this.props.form;
        const {entity, state, code} = this.props;

        const storeroomdata = state.storeroomListData; //*** 拿到请求返回的数据
        const storeroomlist = storeroomdata.list;

        const {workorderState} = this.props;

        const workorderdate = workorderState.workOrderListData;
        const workorderlist = workorderdate.list;


        const {commonState} = this.props;

        const releasetype = commonState.releaseTypeData;
        const releaseStatus = commonState.releaseStatusData;

        const workOrderType = commonState.workOrderTypeData;
        const personListData = commonState.personListData;
        const personList = personListData.list;

        const {repairState} = this.props;

        const repairOrder = repairState.repairWorkOrderListData || [];
        const repairOrderList = repairOrder.list;
        console.log(this.state.orderType);

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
                                    <Input type="hidden"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 4}}>
                        <FormItem
                            label="发放单编码"
                        >
                            {
                                getFieldDecorator('releaseNum', {
                                    rules: [{required: true, message: '发放单编码不能为空!'}],
                                    initialValue: entity ? entity.releaseNum : code
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 8}}>
                        <FormItem
                            label="发放单描述"
                        >
                            {
                                getFieldDecorator('description', {
                                    rules: [{required: true, message: '发放单描述不能为空!', max: 255}],
                                    initialValue: entity ? entity.description : ''
                                })(
                                    <Input placeholder="请输入发放单描述"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="*状态"
                        >
                            {
                                getFieldDecorator('status', {
                                    initialValue: entity ? entity.status : 'ENTERED'
                                })(
                                    <Select size="large" style={{width: '100%'}} disabled>
                                        {
                                            releaseStatus.map((item, i) => <Option key={i}
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
                                })(
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
                                getFieldDecorator('fromStoreroomId', {
                                    initialValue: entity ? entity.fromStoreroomId : ''
                                })(
                                    <Input type="hidden"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 4}}>
                        <FormItem
                            label="库房"
                        >
                            {
                                getFieldDecorator('fromStoreroomNum', {
                                    rules: [{required: true, message: '库房不能为空!', max: 36}],
                                    initialValue: entity ? entity.fromStoreroomNum : ''
                                })
                                (
                                    entity ? <Input disabled/> : <Input placeholder="请选择库房"
                                                                        suffix={<Icon type="plus"
                                                                                      onClick={this.storeroomAdd}/> }
                                                                        onClick={this.storeroomAdd}
                                                                        readOnly/>
                                )
                            }
                            <EamModal
                                title={
                                    <div>
                                        <Pagination
                                            total={storeroomdata.total}
                                            current={this.state.currentPage}
                                            onChange={this.storoompageChange}
                                            className="pull-right"
                                        />
                                        <span>选择库房</span>
                                    </div>
                                }
                                width={800}
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
                                            columns={this.storeroomColumns}
                                            rowSelection={this.rowSelection}
                                            bordered
                                            onChange={this.tableChange}
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
                            label="*库房名称"
                        >
                            {
                                getFieldDecorator('fromStoreroomName', {
                                    initialValue: entity ? entity.fromStoreroomName : ''
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
                                getFieldDecorator('updateDate', {
                                    initialValue: entity ? moment(entity.updateDate, 'YYYY-MM-DD HH:mm:ss') : moment(moment(), 'YYYY-MM-DD HH:mm:ss')
                                })

                                (
                                    <DatePicker
                                        showTime
                                        disabled
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
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="创建人"
                        >
                            {
                                getFieldDecorator('createUser', {
                                    initialValue: entity ? entity.createUser : commonState.loginName
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
                            label="工单类型"
                        >
                            {
                                getFieldDecorator('orderType', {

                                    initialValue: entity ? entity.orderType : ''
                                })(
                                    <Select size="large" style={{width: '100%'}}
                                            onChange={value => {
                                                const {form} = this.props;
                                                form.setFieldsValue({'orderNum': '', 'orderDiscription': '',});
                                                this.setState({orderType: value})
                                            }}>
                                        {
                                            workOrderType.map((item, i) => <Option key={i}
                                                                                   value={item.value}>{item.description}</Option>)
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 8}}>
                        <FormItem
                            label="维保工单的描述"
                        >
                            {
                                getFieldDecorator('orderDiscription', {
                                    initialValue: entity ? entity.orderDiscription : ''
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="工单编码"
                        >
                            {
                                getFieldDecorator('orderNum', {
                                    initialValue: entity ? entity.orderNum : ''
                                })
                                (
                                    entity ? <Input disabled/> : <Input placeholder="请选择工单"
                                                                        suffix={<Icon type="plus"
                                                                                      onClick={this.orderAdd}/> }
                                                                        onClick={this.orderAdd}
                                                                        readOnly/>
                                )
                            }
                            <EamModal
                                width={800}
                                title={
                                    <div>
                                        <Pagination
                                            total={this.state.orderType == 'PM' ? workorderdate.total:repairOrder.total}
                                            current={this.state.ordercurrentPage}
                                            onChange={this.orderpageChange}
                                            className="pull-right"
                                        />
                                        <span>选择工单</span>
                                    </div>
                                }
                                ref={orderModal => this.orderModal = orderModal}
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
                                            dataSource={ this.state.orderType == 'PM' ? workorderlist:repairOrderList}
                                            columns={this.state.orderType == 'PM' ? this.orderColumns : this.repaireorderColumns}
                                            rowSelection={this.rowSelection}
                                            bordered
                                            onChange={this.tableChange}
                                        />
                                    </Col>
                                </Row>
                                <div className="modal-footer clearfix">
                                    <Pagination
                                        total={this.state.orderType == 'PM' ? workorderdate.total:repairOrder.total}
                                        className="pull-left"
                                        showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                                        current={this.state.ordercurrentPage}
                                        onChange={this.orderpageChange}
                                        style={{padding: 0}}
                                    />
                                </div>
                            </EamModal>
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="创建时间"
                        >
                            {
                                getFieldDecorator('createDate', {
                                    initialValue: entity ? moment(entity.updateDate, 'YYYY-MM-DD HH:mm:ss') : moment(new Date(), 'YYYY-MM-DD HH:mm:ss')
                                })

                                (
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
                <Row gutter={16} justify="start">
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
                            label="负责人"
                        >
                            {
                                getFieldDecorator('consumingPeople', {
                                    initialValue: entity ? entity.consumingPeople : ''
                                })
                                (
                                    entity ? <Input disabled/> : <Input placeholder="请选择负责人"
                                                                        suffix={<Icon type="plus"
                                                                                      onClick={this.userAdd}/> }
                                                                        onClick={this.userAdd}
                                                                        readOnly/>
                                )
                            }
                            <EamModal
                                width={800}
                                title={
                                    <div>
                                        <Pagination
                                            total={personListData.total}
                                            current={this.state.personcurrentPage}
                                            onChange={this.personpageChange}
                                            className="pull-right"
                                        />
                                        <span>选择负责人</span>
                                    </div>
                                }
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
                                            rowSelection={this.rowSelection}
                                            bordered
                                            onChange={this.tableChange}
                                        />
                                    </Col>
                                </Row>
                                <div className="modal-footer clearfix">
                                    <Pagination
                                        total={personListData.total}
                                        className="pull-left"
                                        showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                                        current={this.state.personcurrentPage}
                                        onChange={this.personpageChange}
                                        style={{padding: 0}}
                                    />
                                </div>
                            </EamModal>
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="成本总计"
                        >
                            {
                                getFieldDecorator('costTotal', {
                                    initialValue: entity ? entity.costTotal : ''
                                })(
                                    entity ? <InputNumber readOnly={true} placeholder="请输入成本总计"/> :
                                        <InputNumber min={0} precision={2} placeholder="请输入成本总计"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="发放类型"
                        >
                            {
                                getFieldDecorator('releaseType', {
                                    initialValue: entity ? entity.releaseType : ''
                                })(
                                    <Select size="large" style={{width: '100%'}}>
                                        {
                                            releasetype.map((item, i) => <Option key={i}
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
const NewFormComponent = Form.create()(FormComponent);

class WorkOrderOneComponent extends React.Component {
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

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        // 接收明细表格字段
        this.relaseColumns = [
            {
                title: '物资编码',
                dataIndex: 'itemNum',
                key: 'itemNum',
                sorter: true,
                render: defaultRender
            },
            {
                title: '物资描述',
                dataIndex: 'itemDescription',
                key: 'itemDescription',
                sorter: true,
                render: defaultRender
            },
            {
                title: '目标(库房)',
                dataIndex: 'storeroomName',
                key: 'storeroomName',
                sorter: true,
                render: defaultRender
            },
            {
                title: '数量',
                dataIndex: 'quantity',
                key: 'quantity',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        record.quantity ? <p>{text}</p> : <InputNumber min={0} onChange={e => {
                            record.quantity = e;

                        }}/>
                    )
                }
            },
            {
                title: '单价',
                dataIndex: 'lineCost',
                key: 'lineCost',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        record.lineCost ? <p>{text}</p> : <InputNumber min={0} onChange={e => {
                            record.lineCost = e;

                        }}/>
                    )
                }
            },
            {
                title: '说明',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '操作',
                dataIndex: '4',
                key: 'ok',
                width: 120,
                render: (text, record, key) => {
                    return (
                        record.quantity ? <p>{'-'}</p> :
                            <button onClick={() => {
                                this.updatereleaseDetail(record)
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
                                this.showConfirm(record.id, record.itemNum)
                            }}/>
                        </div>
                    )
                }
            },
        ];

        this.inventorycolumns = [
            {
                title: '物资编码',
                dataIndex: 'itemNum',
                key: 'itemNum',
                render: defaultRender
            },
            {
                title: '物资名称',
                dataIndex: 'itemName',
                key: 'itemName',
                render: defaultRender
            },
            {
                title: '库房名称',
                dataIndex: 'storeroomName',
                key: 'storeroomName',
                render: defaultRender
            },
            {
                title: '当前余量',
                dataIndex: 'currentBalance',
                key: 'currentBalance',
                render: defaultRender
            },
            {
                title: '订购单位',
                dataIndex: 'orderUnitName',
                key: 'orderUnitName',
                render: defaultRender
            },
            {
                title: '是否周转',
                dataIndex: 'isTurnOver',
                key: 'isTurnOver',
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
                render: (text, record, key) => {
                    return (
                        <p>{record.status ? '活动' : '不活动'}</p>
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
                            <Icon
                                type="delete"
                                onClick={() => {
                                    this.showConfirm(record.id, record.itemNum)
                                }}
                            />
                        </div>
                    )
                }
            },
        ];
        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({selectedRows: selectedRows});
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log(selected, selectedRows, changeRows);
            },
        }
        this.releaseModalRowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
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
        const {actions, state} = this.props;
        const entity = state.releaseEntity
        const param = {ids: id};
        if (entity == null) {

            actions.releaseDetailOperation(['RELEASE_DEL', {id: id}]);
        } else {
            actions.deleteReleaseDetail(param, (json) => {
                if (json.success) {
                    message.success(json.msg);
                    this.getReleaseDetailList();
                } else {
                    message.error(json.msg);
                }
            });
        }
    }
    batchDel = () => {
        const selectedRows = this.state.selectedRows;
        this.del(filterArrByAttr(selectedRows, 'id').join(','));
    }
    getReleaseEntity = () => {
        let id = this.props.location.query.id;
        const {actions, commonActions, commonState} = this.props;
        this.param = {id: id, siteId: commonState.siteId, orgId: commonState.orgId};

        if (id == '' || id == undefined) {
            actions.findMaterialReleaseById(this.param, () => {
                this.setState({tableLoading: false});
            });
            this.param = {modelKey: "item", siteId: commonState.siteId, orgId: commonState.orgId}
            commonActions.codeGenerator(this.param, () => {
                this.setState({tableLoading: false});
            });

        } else {
            actions.findMaterialReleaseById(this.param, () => {
                this.setState({tableLoading: false});
            });
        }
    }

    getReleaseDetailList = () => {
        let id = this.props.location.query.id;
        if (id == undefined) {
            id = "";
        }
        this.param = {releaseId: id, pageSize: 10, pageNum: 0};
        const {actions} = this.props;
        actions.findMaterialReleaseDetail(this.param, () => {
            this.setState({tableLoading: false});
        });
    }

    getReleaseDetailListafteradd = (id) => {
        this.param = {releaseId: id, pageSize: 10, pageNum: 0};
        const {actions} = this.props;
        actions.findMaterialReleaseDetail(this.param, () => {
            this.setState({tableLoading: false});
        });
    }

    releaseDetailAdd = () => {
        const {state, actions, commonState} = this.props;
        const storeroomId = this.releaseAddForm.props.form.getFieldValue('fromStoreroomId')
        // const entity = state.releaseEntity
        // console.log(entity == null);
        // if (entity == null) {
        //     message.error("请先填写、保存基本信息!!");
        // } else {
        const param = {
            storeroomId: storeroomId,
            itemNums: filterArrByAttr(state.releasedetailListData.list, 'itemNum').join(','),
            pageNum: 0,
            pageSize: 10,
            siteId: commonState.siteId,
            orgId: commonState.orgId,
        };
        actions.findInventorysNotInItemNum(param, () => {
        });
        this.releaseModal.modalShow();
    }


    updatereleaseDetail = (record) => {
        const {actions} = this.props;
        actions.releaseDetailOperation(['RELEASE_UPDATE', record]);
    }

    releaseSave = () => {
        const selectionrows = this.rowSelectionRows;
        const {actions} = this.props;
        actions.releaseDetailOperation(['RELEASE_SAVE', selectionrows]);
        this.releaseModal.modalHide();
    }
    getreleaseType = () => {
        const {commonActions, commonState} = this.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'invsueStatus', 'RELEASE_STATUS');
        commonActions.getDomainValue(domainValueParam, 'useType', 'RELEASE_TYPE');
        commonActions.getDomainValue(domainValueParam, 'woType', 'WORK_ORDER_TYPE');
    }

    componentWillMount() {
        this.getReleaseEntity();
        this.getReleaseDetailList();
        this.getreleaseType();
    }

    render() {
        const {state, commonState, actions, workorderActions, repairActions, repairState, workorderState, commonActions} = this.props;
        const relase = state.releaseEntity;
        const code = commonState.codeEntity;

        const relaseDetaildata = state.releasedetailListData || [];
        const relaseDetaildataList = relaseDetaildata.list;

        const inventroydata = state.inventoryListData;
        const inventroylist = inventroydata.list;


        const list = state.informationListData;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down"/></span>} key="1"
                               style={this.customPanelStyle}>
                            <NewFormComponent
                                wrappedComponentRef={releaseAddForm => this.releaseAddForm = releaseAddForm}
                                workorderActions={workorderActions} workorderState={workorderState}
                                repairState={repairState}
                                repairActions={repairActions} commonActions={commonActions}
                                commonState={commonState} entity={relase}
                                state={state} actions={actions} code={code}/>
                        </Panel>
                        <Panel header={<span className="label">明细信息<Icon type="caret-down"/></span>} key="2"
                               style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.taskstepsLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={relaseDetaildataList}
                                columns={this.relaseColumns}
                                rowSelection={this.rowSelection}
                                bordered
                            />
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
                                {relase ? relase.status == 'COMPLETE' ? '' :
                                    <Button type="primary" size="large" onClick={this.releaseDetailAdd}>新增</Button> :
                                    <Button type="primary" size="large" onClick={this.releaseDetailAdd}>新增</Button> }
                            </div>
                        </Panel>
                    </Collapse>
                </div>
                <EamModal
                    title={`选择库存明细`}
                    ref={releaseModal => this.releaseModal = releaseModal}
                    width={1200}
                >
                    <Table
                        rowSelection={this.releaseModalRowSelection}
                        loading={this.state.materialsAddLoading}
                        rowKey="id"
                        dataSource={inventroylist}
                        columns={this.inventorycolumns}
                        bordered
                    />
                    <div className="modal-footer clearfix">
                        <Button size="large" onClick={() => {
                            this.releaseModal.modalHide()
                        }}>取消</Button>
                        <Button type="primary" size="large" onClick={this.releaseSave}>确定</Button>
                    </div>
                </EamModal>
            </div>
        )
    }
}


function

mapStateToProps(state) {
    return {
        state: state.material,
        commonState: state.common,
        workorderState: state.maintenance,
        repairState: state.matter_repair
    }
}

function

buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
        workorderActions: bindActionCreators(workorderActions, dispatch),
        repairActions: bindActionCreators(repairActions, dispatch),
    }
}

export
default

connect(mapStateToProps, buildActionDispatcher)

(
    WorkOrderOneComponent
)
;
