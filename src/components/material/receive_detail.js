/**
 * 维保保养-维保工单-工单提报 
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import actions from '../../actions/material.js';
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


class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            storeroomcurrentPage: 1,
            tableLoading: false,
        }

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        this.param = {
            pageSize: 10,
            pageNum: 0,
            siteId: this.props.commonState.siteId,
            orgId: this.props.commonState.orgId,
        }
        //接收人字段
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
            },
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
                render: (text, record, key) => {
                    return (

                        <p>{record.status == 'true' ? '活动' : '不活动'} </p>

                    )
                }
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
    }


    componentDidUpdate() {
        const {state, actions, form} = this.props;
        if (!state.getFormValues) {
            actions.getFormValues(form.getFieldsValue());
        }
    }

    // 选择库房
    selectStoreroom = (id, storeroomNum, storeroomName) => {
        const {form} = this.props;
        form.setFieldsValue({'storeroomId': id, 'storeroomNum': storeroomNum, 'storeroomName': storeroomName,});

        this.taskStepsClose();
    }

    storeroomAdd = () => {
        this.getStoreroomList();
        this.storeroomModal.modalShow();
    }

    getStoreroomList = () => {
        const {actions} = this.props;
        this.setState({tableLoading: true});
        actions.storeroomGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    }

    componentDidUpdate() {
        const {state, actions} = this.props;
        if (state.getFormValues) {
            actions.getFormValues(false);
            this.receiveAdd();
        }
    }

    receiveAdd = () => {
        const {actions, commonState, state} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                for (let attr in values) {
                    if (values[attr] === null || values[attr] == "") delete values[attr];
                }

                const listParam = {
                    pageNum: 1,
                    pageSize: 10,
                    siteId: commonState.siteId,
                    orgId: commonState.orgId,
                }
                const materialGoodsReceiveDetail = state.receiveDetailListData || [];
                const newReceiveDetailList = materialGoodsReceiveDetail.newReceiveDetailList || [];
                values.usedate = moment(values.usedate).format('YYYY-MM-DD HH:mm:ss');
                values.receiveDate = moment(values.receiveDate).format('YYYY-MM-DD HH:mm:ss');

                const materialGoodsReceiveDetailVos = JSON.parse(JSON.stringify(newReceiveDetailList));
                materialGoodsReceiveDetailVos.forEach(item => {
                    item.itemId = item.id;
                    delete item.id;
                });

                const param = {
                    ...values,
                    siteId: commonState.siteId,
                    orgId: commonState.orgId,
                    materialGoodsReceiveDetailVos: materialGoodsReceiveDetailVos,
                }
                //console.log(param);
                const id = param.id;
                if (id == undefined || id == '') {

                    actions.receiveSave(param, (json) => {
                        if (json.success) {
                            // this.setState({tableLoading: true});
                            // actions.receiveGetList(listParam, () => {
                            //     // this.setState({tableLoading: false});
                            // });
                            message.success(json.msg);
                            browserHistory.push('/material/receive')
                            browserHistory.push(`/material/receive/receive_detail?id=${json.data.id}`);
                        } else {
                            message.error(json.msg);
                        }
                    });
                } else {
                    actions.receiveUpdate(param, (json) => {
                        if (json.success) {
                            // this.setState({tableLoading: true});
                            // actions.receiveGetList(listParam, () => {
                            //     // this.setState({tableLoading: false});
                            // });
                            // browserHistory.push('/material/receive');
                        } else {
                            message.error(json.msg);
                        }
                    });
                }
            }
        });
    }


    userAdd = () => {
        this.getUserList();
        this.userAddModal.modalShow();
    }

    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({currentPage: page});
        // this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getUserList(page);
    }

    storeroompageChange = (page, pageSize) => {
        this.setState({storeroomcurrentPage: page});
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getStoreroomList();
    }
    getUserList = (page) => {
        const {commonActions, commonState} = this.props;

        const param = {
            pageNum: page == undefined ? 1 : page,
            pageSize: 10,
            orgIds: [commonState.orgId],
            siteIds: [commonState.siteId]
        };

        this.setState({tableLoading: true});
        commonActions.personGetList(param, () => {
            this.setState({tableLoading: false});
        });
    }
    onUserAdd = (id, name) => {
        const {form} = this.props;
        form.setFieldsValue({"personId": id, "receivePerson": name});
        this.taskStepsClose();
    }

    taskStepsClose = () => {
        this.storeroomModal.modalHide();
        this.userAddModal.modalHide();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {entity} = this.props;
        const {state} = this.props;
        const {code} = this.props;

        const data = state.storeroomListData; //*** 拿到请求返回的数据
        const list = data.list;

        const {commonState} = this.props;
        const receiveStatus = commonState.receiveStatusData;
        const receiveType = commonState.receiveTypeData;

        const personListData = commonState.personListData || [];
        const personList = personListData.list;


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
                    <Col className="gutter-row" xs={{span: 4}}>
                        <FormItem
                            label="接收单"
                        >
                            {
                                getFieldDecorator('goodsReceiveNum', {
                                    rules: [{required: true, message: '接收单不能为空!'}],
                                    initialValue: entity ? entity.goodsReceiveNum : code
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 8}}>
                        <FormItem
                            label="接收单描述"
                        >
                            {
                                getFieldDecorator('description', {
                                    rules: [{required: true, message: '接收单描述不能为空!', max: 255}],
                                    initialValue: entity ? entity.description : ''
                                })(
                                    entity ? <Input disabled/> : <Input placeholder="请输入接收单描述"/>
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
                            label="接收人"
                        >
                            {
                                getFieldDecorator('receivePerson', {
                                    rules: [{required: true, message: '接收人不能为空!'}],
                                    initialValue: entity ? entity.receivePerson : ''
                                })
                                (
                                    entity ? <Input disabled/> : <Input placeholder="请选择接收人"
                                                                        suffix={<Icon type="plus"
                                                                                      onClick={this.userAdd}/> }
                                                                        onClick={this.userAdd}
                                                                        readOnly/>
                                )
                            }
                            <EamModal
                                width={800}
                                title={`选择接收人`}
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
                                            onChange={this.pageChange}
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
                            label="状态"
                        >
                            {
                                getFieldDecorator('status', {
                                    initialValue: entity ? entity.status : 'CG'
                                })
                                (
                                    <Select size="large"
                                            style={{width: '100%'}}
                                            disabled>
                                        {
                                            receiveStatus.map((item, i) => <Option key={i}
                                                                                   value={item.value}>{item.description}</Option>)
                                        }
                                    </Select>
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
                                    entity ? <Input disabled/> : <Input placeholder="请选择接收人"
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
                                            dataSource={list}
                                            columns={this.storeroomcolumns}
                                            bordered
                                            onChange={this.tableChange}
                                        />
                                        <Pagination
                                            total={data.total}
                                            className="pull-left title-pagination"
                                            current={this.state.storeroomcurrentPage}
                                            onChange={this.storeroompageChange}
                                        />
                                    </Col>
                                </Row>
                                <div className="modal-footer clearfix">
                                    <Pagination
                                        total={data.total}
                                        className="pull-left"
                                        showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                                        current={this.state.storeroomcurrentPage}
                                        onChange={this.storeroompageChange}
                                        style={{padding: 0}}
                                    />
                                </div>
                            </EamModal>
                        </FormItem>
                    </Col>

                    <Col className="gutter-row" xs={{span: 0}}>
                        <FormItem
                        >
                            {
                                getFieldDecorator('storeroomId', {
                                    initialValue: entity ? entity.storeroomId : ''
                                })(
                                    <Input type="hidden"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 8}}>
                        <FormItem
                            label="*库房名称"
                        >
                            {
                                getFieldDecorator('storeroomName', {
                                    initialValue: entity ? entity.storeroomName : ''
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="接收日期"
                        >
                            {
                                getFieldDecorator('receiveDate', {
                                    initialValue: moment(entity ? entity.receiveDate : new Date(), 'YYYY-MM-DD HH:mm:ss')
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
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="时间日期"
                        >
                            {
                                getFieldDecorator('usedate', {
                                    initialValue: moment(entity ? entity.receiveDate : new Date(), 'YYYY-MM-DD HH:mm:ss')
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
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{span: 12}}>
                        <FormItem
                            label="接收说明"
                        >
                            {
                                getFieldDecorator('explains', {
                                    initialValue: entity ? entity.explains : ''
                                })
                                (
                                    <Input placeholder="请输入接收说明"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="接收类型"
                        >
                            {
                                getFieldDecorator('receiveType', {
                                    initialValue: entity ? entity.receiveType : ''
                                })(
                                    <Select size="large" style={{width: '100%'}}>
                                        {
                                            receiveType.map((item, i) => <Option key={i}
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
            materialsAddLoading: false,
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
        this.receiveDetailColumns = [
            {
                title: '物资编码',
                dataIndex: 'itemNum',
                key: 'itemNum',
                sorter: true,
                render: defaultRender
            },
            {
                title: '物资描述',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '数量',
                dataIndex: 'receiveQuantity',
                key: 'receiveQuantity',
                sorter: true,
                render: (text, record, key) => {
                    //  record.receiveQuantity ? record.receiveQuantity : 0;
                    return (
                        record.receiveQuantity ? <p>{text}</p> : <InputNumber min={0} onChange={e => {
                            record.receiveQuantity = e;

                        }}/>
                    )
                }
            },
            {
                title: '单价',
                dataIndex: 'unitCost',
                key: 'unitCost',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        record.unitCost ? <p>{text}</p> : <InputNumber min={0} onChange={e => {
                            record.unitCost = e;

                        }}/>
                    )
                }
            },
            {
                title: '行价',
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
                title: '备注',
                dataIndex: 'mark',
                key: 'mark',
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
                        record.receiveQuantity ? <p>{'-'}</p> :
                            <button onClick={() => {
                                this.updatereceiveDetail(record)
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

        this.rowReceiveDetailSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({selectedRows: selectedRows});
            },
        };

        this.receiveModalRowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.rowSelectionRows = selectedRows;
            },
        };
        //表格字段
        this.itemcolumns = [
            {
                title: '物资编码',
                dataIndex: 'itemNum',
                key: 'itemNum',
                sorter: true,
                render: defaultRender
            },
            {
                title: '物资名称',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '品牌',
                dataIndex: 'brand',
                key: 'brand',
                sorter: true,
                render: defaultRender
            },
            {
                title: '型号',
                dataIndex: 'model',
                key: 'model',
                sorter: true,
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                sorter: true,
                render: defaultRender
            },
            {
                title: '是否工具',
                dataIndex: 'tools',
                key: 'tools',
                sorter: true,
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
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><Checkbox checked={text} disabled/></p>
                    )
                }
            },
        ];
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
        const {state, actions} = this.props;

        const param = {ids: id};
        const entity = state.receiveEntity;
        //console.log(entity == null);

        if (entity == null) {
            actions.receiveDetailOperation(['RECEIVE_DEL', {id: id}]);
        } else {
            actions.deleteReceiveDetail(param, (json) => {
                if (json.success) {
                    message.success(json.msg);
                    this.getReceiveDetailList();
                } else {
                    message.error(json.msg);
                }
            });
        }
    }

    //根据id获取接收实体
    getReceiveEntity = () => {

        let id = this.props.location.query.id;
        this.param = {id: id};
        const {actions, commonActions, commonState} = this.props;

        if (id == '' || id == undefined) {
            actions.findGoodsreceiveById(this.param, () => {
                this.setState({tableLoading: false});
            });
            this.param = {modelKey: "item", siteId: commonState.siteId}
            commonActions.codeGenerator(this.param, () => {
                this.setState({tableLoading: false});
            });

        } else {
            actions.findGoodsreceiveById(this.param, () => {
                this.setState({tableLoading: false});
            });
        }
    }


    updatereceiveDetail = (record) => {
        const {actions} = this.props;
        actions.receiveDetailOperation(['RECEIVE_UPDATE', record]);
    }
    //获取物资接受明细列表
    getReceiveDetailList = () => {
        let id = this.props.location.query.id;
        this.param = {id: id, pageSize: 10, pageNum: 0};
        const {actions} = this.props;
        actions.findGoodsReceiveDetailByGoodsReceiveId(this.param, () => {
            this.setState({tableLoading: false});
        });
    }
    getReceiveDetailListafteradd = (id) => {
        this.param = {id: id, pageSize: 10, pageNum: 0};
        const {actions} = this.props;
        actions.findGoodsReceiveDetailByGoodsReceiveId(this.param, () => {
            // this.setState({tableLoading: false});
        });
    }

    //获取物资
    getItemList = () => {
        const {actions} = this.props;
        this.setState({tableLoading: true});
        this.param = {pageSize: 10, pageNum: 0}
        actions.itemGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    }

    receiveDetailAdd = () => {
        const {state, actions, commonState} = this.props;
        // const entity = state.receiveEntity;
        // //console.log(entity==null) ;
        // if(entity==null){
        //     message.error("请先填写、保存基本信息!!") ;
        // }else{
        const param = {
            itemNums: filterArrByAttr(state.receiveDetailListData.list, 'itemNum').join(','),
            pageNum: 0,
            pageSize: 10,
            siteId: commonState.siteId,
            orgId: commonState.orgId,
        };
        actions.itemNotInReleaseList(param, () => {
        });
        this.receiveModal.modalShow();
        // }
    }
    receiveSave = () => {
        const selectionrows = this.rowSelectionRows;
        const {actions} = this.props;

        actions.receiveDetailOperation(['RECEIVE_SAVE', selectionrows]);
        this.receiveModal.modalHide();
    }

    // 分页事件
    receivepageChange = (page, pageSize) => {
        this.setState({currentPage: page});
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getItemList();
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
        this.getReceiveEntity();
        this.getReceiveDetailList();
        this.getReceiveStatus();
    }

    render() {

        const {state, commonState, actions, commonActions} = this.props;
        const receive = state.receiveEntity;

        const code = commonState.codeEntity;
        const itemListData = state.itemListData;
        const itemList = itemListData.list;
        const receiveDetaildata = state.receiveDetailListData;
        const receiveDetaildataList = receiveDetaildata.list;


        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down"/></span>} key="1"
                               style={this.customPanelStyle}>
                            <NewFormComponent state={state} commonActions={commonActions} commonState={commonState}
                                              entity={receive} actions={actions} code={code}/>
                        </Panel>
                        <Panel header={<span className="label">接收明细<Icon type="caret-down"/></span>} key="2"
                               style={this.customPanelStyle}>
                            <Table
                                rowSelection={this.rowReceiveDetailSelection}
                                rowKey="id"
                                loading={this.state.taskstepsLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={receiveDetaildataList}
                                columns={this.receiveDetailColumns}
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
                                {receive ? receive.status == 'YJS' ? '' :
                                    <Button type="primary" size="large" onClick={this.receiveDetailAdd}>新增</Button> :
                                    <Button type="primary" size="large" onClick={this.receiveDetailAdd}>新增</Button> }

                                </div>
                            {/*}*/}
                        </Panel>
                    </Collapse>
                </div>

                <EamModal
                    title={`选择接受物资`}
                    ref={receiveModal => this.receiveModal = receiveModal}
                    width={1200}
                    // afterClose={this.taskStepsAfterClose}
                >
                    <Table
                        rowSelection={this.receiveModalRowSelection}
                        loading={this.state.materialsAddLoading}
                        rowKey="id"
                        dataSource={itemList}
                        columns={this.itemcolumns}
                        bordered
                    />
                    <div className="modal-footer clearfix">
                        <Button size="large" onClick={() => {
                            this.receiveModal.modalHide()
                        }}>取消</Button>
                        <Button type="primary" size="large" onClick={this.receiveSave}>确定</Button>
                    </div>
                </EamModal>

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

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderOneComponent);
