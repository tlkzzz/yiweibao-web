/**
 * 物资盘点 
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import actions from '../../actions/material.js';
import NumInp from '../../components/common/num_inp.js';
import commonActions from '../../actions/common';
import {createForm} from 'rc-form';
import {filterArrByAttr} from '../../tools';
import moment from 'moment';
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
    Menu, message, InputNumber
} from 'antd';
const confirm = Modal.confirm;
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
            personcurrentPage: 1,
            tableLoading: false,
            selectedRowKeys: [],

        }
        const {commonState} = this.props;
        this.param = {
            pageSize: 10,
            pageNum: 0,
            siteId: commonState.siteId,
            orgId: commonState.orgId,
        }


        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };
        //表格字段
        this.userColumns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                render: (text, record, key) => {
                    return (
                        <p><a href="javascript:;" onClick={() => {
                            this.selectCheckPerson(record.id, record.name)
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
                title: '班组',
                dataIndex: 'workgroup',
                key: 'workgroup',
                render: defaultRender
            },
            {
                title: '电话',
                dataIndex: 'mobile',
                key: 'mobile',
                render: defaultRender
            },
            {
                title: '年龄',
                dataIndex: 'gender',
                key: 'gender',
                render: defaultRender
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
                render: (text, record, key) => {
                    return (

                        <p>{record.status == 'true' ? '活动' : '不活动'}</p>
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
            }
        ];
    }

    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({currentPage: page});
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getStoreroomList();
    }

    personpageChange = (page, pageSize) => {
        this.setState({personcurrentPage: page});
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }
    //
    getList = () => {
        const {commonActions, commonState} = this.props;

        const param = {
            ...this.param,
            siteIds: [commonState.siteId],
            orgIds: [commonState.orgId]
        }

        this.setState({tableLoading: true});
        commonActions.personGetList(param, () => {
            this.setState({tableLoading: false});
        });
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
            this.checkDetailSave()
        }
    }


    checkDetailSave = () => {
        const {state, commonState, actions} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                for (let attr in values) {
                    if (values[attr] === null || values[attr] == "") delete values[attr];
                }

                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    values.updateDate = moment(values.updateDate).format('YYYY-MM-DD HH:mm:ss');

                    const checkDetailData = state.checkdetailList || [];
                    const newCheckDetailList = checkDetailData.newCheckDetailList || [];
                    const materialCheckDetailVos = JSON.parse(JSON.stringify(newCheckDetailList));
                    materialCheckDetailVos.forEach(item => {
                        item.inventoryid = item.id;
                        delete item.id;
                    });

                    const param = {
                        ...values,
                        siteId: commonState.siteId,
                        orgId: commonState.orgId,
                        materialCheckDetailVos: materialCheckDetailVos,
                    }
                    let id = param.id;
                    // console.log(param);
                    if (id == undefined || id == '') {
                        actions.saveMaterialCheck(param, (json) => {
                            if (json.success) {
                                // actions.checkGetList(this.param, () => {
                                // });
                                message.success(json.msg)
                                browserHistory.push('/material/check');
                                browserHistory.push(`/material/check/check_detail?id=${json.data.id}`);

                            } else {
                                message.error(json.msg);
                            }
                        });
                    } else {
                        actions.updateMaterialCheck(param, (json) => {
                            if (json.success) {
                                // actions.checkGetList(this.param, () => {
                                // });
                                // browserHistory.push('/material/check');
                            } else {
                                message.error(json.msg);
                            }
                        });
                    }
                }, 0);
            }
        });


    }

    componentDidMount() {
        this.getList();
        this.getStoreroomList();
        this.getoptions()
    }

    userAdd = () => {
        this.userAddModal.modalShow();
    }
    taskStepsClose = () => {
        this.userAddModal.modalHide();
    }
    storageRoomAdd = () => {
        this.storeroomModal.modalShow();
    }
    storageRoomClose = () => {
        this.storeroomModal.modalHide();
    }
    selectStoreroom = (id, storeroomNum, storeroomName) => {
        const {form} = this.props;
        form.setFieldsValue({'storeroomId': id, 'storeroomNum': storeroomNum, 'storeroomName': storeroomName,});

        this.storageRoomClose();
    }
    selectCheckPerson = (id, name) => {
        const {form} = this.props;
        form.setFieldsValue({'checkPersonId': id, 'checkPerson': name});
        this.taskStepsClose();
    }
    //用于更新状态值
    updateStatusDate = () => {
        const {form} = this.props;
        const newDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        form.setFieldsValue({'statusDate': newDate});
    };
    getoptions = () => {
        const {commonActions, commonState} = this.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'checkStatus', 'CHECK_STATUS');
    }

    //获取长度，支持中文
    getlength = (str) => {
        let l = str.length;
        let blen = 0;
        for (var i = 0; i < l; i++) {
            if ((str.charCodeAt(i) & 0xff00) != 0) {
                blen++;
            }
            blen++;
        }
        return blen;
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const {entity, code, commonState, state} = this.props;
        const roomdata = state.storeroomListData; //*** 拿到请求返回的数据
        const roomlist = roomdata.list;
        const checkStatus = commonState.checkStatusData;
        const persondata = commonState.personListData;
        const personList = persondata.list;


        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{span: 4}}>
                        <FormItem
                            label="盘点单"
                            hasFeedback

                        >
                            {
                                getFieldDecorator('checkNum', {
                                    rules: [{required: true, message: '请输入编号!'}],
                                    initialValue: entity ? entity.checkNum : code,
                                })(
                                    <Input placeholder="请输入盘点单" disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 0}}>
                        <FormItem
                            label="盘点单Id"
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
                    <Col className="gutter-row" xs={{span: 8}}>
                        <FormItem
                            label="盘点单描述"
                        >
                            {
                                getFieldDecorator('description', {
                                    rules: [{required: true, message: '盘点单描述不能为空!'}],
                                    initialValue: entity ? entity.description : ''
                                })(
                                    <Input placeholder="请输入盘点单描述"/>
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
                                    initialValue: entity ? entity.status : 'CG'
                                })(
                                    <Select disabled size="large" style={{width: '100%'}}>
                                        {
                                            checkStatus.map((item, i) => <Option key={i}
                                                                                 value={item.value}>{item.description}</Option>)
                                        }
                                    </Select>
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
                                    // <Input suffix={<Icon type="plus"  onClick={this.userAdd}   /> } disabled />
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
                                    rules: [{required: true, message: '请选择库房'}],
                                    initialValue: entity ? entity.storeroomNum : ''
                                })
                                (
                                    entity ? <Input disabled/> : <Input placeholder="请输入订购单位"
                                                                        suffix={<Icon type="plus"
                                                                                      onClick={this.storageRoomAdd}/> }
                                                                        onClick={this.storageRoomAdd}
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
                                            dataSource={roomlist}
                                            columns={this.storeroomcolumns}
                                            bordered
                                            onChange={this.tableChange}
                                        />
                                        <Pagination
                                            total={roomdata.total}
                                            className="pull-left title-pagination"
                                            current={this.state.currentPage}
                                            onChange={this.pageChange}
                                        />
                                    </Col>
                                </Row>
                                <div className="modal-footer clearfix">
                                    <Pagination
                                        total={roomdata.total}
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
                                getFieldDecorator('storeroomName', {
                                    initialValue: entity ? entity.storeroomName : ''
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 0}}>
                        <FormItem>
                            {
                                getFieldDecorator('storeroomId', {
                                    initialValue: entity ? entity.storeroomId : ''
                                })(
                                    <Input type="hidden" disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="状态时间"
                        >
                            {
                                getFieldDecorator('statusDate', {
                                    initialValue: entity ? moment(entity.statusDate).format('YYYY-MM-DD HH:mm:ss') : moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                                })
                                (<Input disabled/>)
                            }
                        </FormItem>

                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="创建时间"
                        >
                            {
                                getFieldDecorator('createDate', {
                                    initialValue: entity ? moment(entity.createDate).format('YYYY-MM-DD HH:mm:ss') : moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
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
                                getFieldDecorator('checkPersonId', {
                                    initialValue: entity ? entity.checkPersonId : ''
                                })(
                                    <Input type="hidden"/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="盘点负责人"
                        >
                            {
                                getFieldDecorator('checkPerson', {

                                    initialValue: entity ? entity.checkPerson : ''
                                })
                                (
                                    entity ? <Input disabled/> : <Input placeholder="请输入盘点负责人"
                                                                        suffix={<Icon type="plus"
                                                                                      onClick={this.userAdd}/> }
                                                                        onClick={this.userAdd}
                                                                        readOnly/>
                                )
                            }
                            <EamModal
                                width={800}
                                title={`选择盘点负责人`}
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
                                            dataSource={personList}
                                            columns={this.userColumns}
                                            bordered
                                            onChange={this.tableChange}
                                        />
                                        <Pagination
                                            total={persondata.total}
                                            className="pull-left title-pagination"
                                            current={this.state.personcurrentPage}
                                            onChange={this.pageChange}
                                        />
                                    </Col>
                                </Row>
                                <div className="modal-footer clearfix">
                                    <Pagination
                                        total={persondata.total}
                                        className="pull-left"
                                        showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                                        current={this.state.personcurrentPage}
                                        onChange={this.pageChange}
                                        style={{padding: 0}}
                                    />
                                </div>
                            </EamModal>
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem label="盘点日期">
                            {
                                getFieldDecorator('updateDate', {
                                    initialValue: entity ? moment(entity.updateDate).format('YYYY-MM-DD HH:mm:ss') : moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                                })
                                (
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{span: 6}}>
                        <FormItem
                            label="是否盈亏?"
                        >

                            {
                                getFieldDecorator('profit', {
                                    initialValue: entity ? String(entity.profit) : "false"
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
                            label="余量已调整?"
                        >
                            {
                                getFieldDecorator('adjust', {
                                    initialValue: entity ? String(entity.adjust) : "false"
                                })(
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
const NewFormComponent = Form.create()(FormComponent);


class CheckDetailComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            taskStepsEditData: '',
            selectedRowKeys: []
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

        this.param = {
            id: localStorage.id,
            pageNum: 1,
            pageSize: 10,
        };

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        // 盘点明细
        this.checkdetailColumns = [
            {
                title: '物资编码',
                dataIndex: 'itemNum',
                key: 'itemNum',
                sorter: true,
                render: defaultRender
            },
            {
                title: '物资描述',
                dataIndex: 'itemName',
                key: 'itemName',
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
                title: '盘点余量',
                dataIndex: 'physicalInventory',
                key: 'physicalInventory',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        record.physicalInventory ? <p>{text}</p> : <InputNumber min={0} onChange={e => {
                            record.physicalInventory = e;
                        }}/>
                    )

                }

            },
            {
                title: '是否盈亏？',
                dataIndex: 'profit',
                key: 'profit',
                sorter: true,
                render: (text, record, key) => {
                    return (
                        <p><Checkbox checked={text} disabled/></p>
                    )
                }
            },
            {
                title: '说明',
                dataIndex: 'description1',
                key: 'description1',
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
                            <Icon type="delete" onClick={() => {
                                this.showConfirm(record.id, record.itemNum)
                            }}/>
                            {record.physicalInventory ? <p></p> : <Icon type="save" onClick={() => {
                                this.showConfirmSave(record)
                            }}/>}
                        </div>
                    )
                }
            },
        ];

        // 新建物资库存
        this.inventorycolumns = [
            {
                title: '物资编码',
                dataIndex: 'itemNum',
                key: 'itemNum',
                sorter: true,
                render: defaultRender
            },
            {
                title: '物资名称',
                dataIndex: 'itemName',
                key: 'itemName',
                sorter: true,
                render: defaultRender
            },
            {
                title: '库房名称',
                dataIndex: 'storeroomName',
                key: 'storeroomName',
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
                title: '订购单位',
                dataIndex: 'orderUnit',
                key: 'orderUnit',
                sorter: true,
                render: defaultRender
            },
            {
                title: '是否周转',
                dataIndex: 'isTurnOver',
                key: 'isTurnOver',
                sorter: true,
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
                sorter: true,
                render: defaultRender
            },
        ];

        this.rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.rowSelectionRows = [];
                this.rowSelectionRows = selectedRows;
            },
        }

    }


// 库存明细回填
    inventoryDetailsAddSave = () => {
        const {actions} = this.props;
        const selectionrows = this.rowSelectionRows;
        actions.materialCheckDetailOperation(['CHECK_SAVE', selectionrows]);
        this.inventoryAddModal.modalHide();
    }

//盘点余量更新
    updateCheckDetail = (checkDetail) => {
        const {actions} = this.props;
        actions.materialCheckDetailOperation(['CHECK_UPDATE', checkDetail]);
    }


    tableSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    // 更多操作
    moreClick = (e) => {
        if (e.key === '3') { //删除物资盘点详细(批量)
            console.info("删除")
            this.showConfirm(this.state.selectedRowKeys)
        }
    }
    showConfirm = (id, text) => {

        if (Array.isArray(id) && !id.length) {
            message.error('请选择要删除的数据。')
        } else {
            confirm({
                title: `删除 ${text ? text : (id.length + '条数据')}?`,
                okText: '删除',
                onOk: () => {
                    if (Array.isArray(id)) id = id.join(',')
                    this.deleteMaterialCheckDetail(id);
                }
            });
        }
    }
    showConfirmSave = (checkDetail) => {
        confirm({
            title: `保存 ${checkDetail.itemNum}?`,
            okText: '保存',
            onOk: () => {
                this.updateCheckDetail(checkDetail);
            }
        });
    }

    //盘点余量更新
    updateCheckDetail = (checkDetail) => {
        const {actions} = this.props;
        actions.materialCheckDetailOperation(['CHECK_UPDATE', checkDetail]);
    }


    //删除物资盘点详细
    deleteMaterialCheckDetail = (id) => {
        this.param = {
            ids: id
        }
        const {actions, state} = this.props;
        const entity = state.checkEntity;
        if (entity == null) {
            actions.materialCheckDetailOperation(['CHECK_DEL', {id: id}]);
        } else {
            actions.deleteMaterialCheckDetail(this.param, (json) => {
                if (json.success) {
                    message.success(json.msg);
                    this.getCheckDetailList();
                } else {
                    message.error(json.msg);
                }
            });
        }
    }
//获取from值
    getCheckEntity = () => {
        let id = this.props.location.query.id;
        const {actions, commonActions, commonState} = this.props;
        this.param = {id: id, siteId: commonState.siteId, orgId: commonState.orgId};

        if (id == '' || id == undefined) {
            actions.findMaterialCheckById(this.param, () => {
                this.setState({tableLoading: false});
            });
            this.param = {modelKey: "item", siteId: commonState.siteId, orgId: commonState.orgId}
            commonActions.codeGenerator(this.param, () => {
                this.setState({tableLoading: false});
            });

        } else {
            actions.findMaterialCheckById(this.param, () => {
                this.setState({tableLoading: false});
            });
        }

    }
    getCheckDetailList = (id) => {
        // let id = this.props.location.query.id;
        this.param = {id: id, pageSize: 10, pageNum: 0};
        const {actions} = this.props;
        this.setState({tableLoading: true});
        actions.findMaterialCheckDetail(this.param, (json) => {
            this.setState({tableLoading: false});


        });
    }
    // 库存弹出框
    inventoryAdd = () => {
        const {actions, state, commonState} = this.props;
        const storeroomIdVaule = this.taskStepsAddForm.props.form.getFieldValue('storeroomId')
        const param = {
            ids: filterArrByAttr(state.checkdetailList.list, 'id').join(','),
            storeroomid: storeroomIdVaule,
            pageNum: 1,
            pageSize: 10,
            siteId: commonState.siteId,
            orgId: commonState.orgId,
        };
        actions.findInventorysNotInCheck(param, () => {
        });
        this.inventoryAddModal.modalShow();

    }


    componentWillMount() {
        let id = this.props.location.query.id;
        this.getCheckEntity();
        this.getCheckDetailList(id);
    }

    render() {
        const {state, commonActions, commonState, actions} = this.props;
        const check = state.checkEntity;
        const code = commonState.codeEntity;
        const checkdetaildata = state.checkdetailList || [];
        //console.log(checkdetaildata);
        const list = checkdetaildata.list;
        const inventorydate = state.inventoryByStoreroomIdAndCheckId;
        const inventorydateList = inventorydate.list;

        //表格多选
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.tableSelectChange,
        }


        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down"/></span>} key="1"
                               style={this.customPanelStyle}>

                            <NewFormComponent
                                wrappedComponentRef={taskStepsAddForm => this.taskStepsAddForm = taskStepsAddForm}
                                commonActions={commonActions} commonState={commonState}
                                entity={check} state={state} actions={actions} code={code}/>
                        </Panel>
                        <Panel header={<span className="label">盘点明细<Icon type="caret-down"/></span>} key="2"
                               style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.taskstepsLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={list}
                                columns={this.checkdetailColumns}
                                rowSelection={rowSelection}
                                bordered
                            />
                            <div className="panel-tools-right">
                                <Dropdown
                                    overlay={(
                                        <Menu onClick={this.moreClick}>
                                            <Menu.Item key="3"><Icon type="delete"/> 批量删除</Menu.Item>

                                        </Menu>
                                    )}
                                    trigger={['click']}
                                >
                                    更多操作
                                </Dropdown>
                                <Button type="primary" size="large" onClick={this.inventoryAdd}>新增</Button>

                                <EamModal
                                    title={`库存明细`}
                                    ref={inventoryAddModal => this.inventoryAddModal = inventoryAddModal}
                                    width={1200}
                                    afterClose={this.taskStepsAfterClose}
                                >
                                    <Table
                                        rowSelection={this.rowSelection}
                                        loading={this.state.tableLoading}
                                        rowKey="id"
                                        dataSource={inventorydateList}
                                        columns={this.inventorycolumns}
                                        bordered
                                    />
                                    <div className="modal-footer clearfix">
                                        <Button size="large" onClick={() => {
                                            this.inventoryAddModal.modalHide()
                                        }}>取消</Button>
                                        <Button type="primary" size="large"
                                                onClick={this.inventoryDetailsAddSave}>确定</Button>
                                    </div>
                                </EamModal>
                            </div>

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

export default connect(mapStateToProps, buildActionDispatcher)(CheckDetailComponent);
