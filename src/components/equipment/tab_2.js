/** 
 * @Description 设备设施结构
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions/equipment.js';
import commonActions from '../../actions/common';

import Dropdown from '../../components/common/dropdown.js';
import SelectAsset from '../../components/common/select_asset.js';
import Modal from '../../components/common/modal.js';

import { filterArrByAttr , runActionsMethod , correspondenceJson  } from '../../tools/';

import { Icon, Button, Table, Pagination, Collapse, Form, Input, Row, Col, Select, DatePicker, Menu, Timeline } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;

import moment from 'moment';

// 部件信息新建
class StructureFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
    }
    render () {
        const { form, data } = this.props;
        const { getFieldDecorator } = form;
        const str = JSON.parse(localStorage.param);

        console.log(data);
        return (
            <Form>
                <FormItem
                    {...this.formItemLayout}
                    label="设备设施编码"
                >
                    {
                        getFieldDecorator('code', {
                            initialValue: '',
                            rules: [{ required: true, message: '文本不能为空' }],
                        })(
                            <Input style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="设备设施名称"
                >
                    {
                        getFieldDecorator('name', {
                            initialValue: '',
                            rules: [{ required: true, message: '文本不能为空' }],
                        })(
                            <Input style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="所属部门"
                >
                    {
                        getFieldDecorator('department', {
                            initialValue: str.ll.department ? str.ll.department: '',
                        })(
                            <Input style={{ width: '100%' }}  disabled/>
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="责任人"
                >
                    {
                        getFieldDecorator('lead', {
                            initialValue: str.ll.lead ? str.ll.lead : '',
                        })(
                            <Input style={{ width: '100%' }} disabled/>
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
const StructureForm = Form.create()(StructureFormComponent);

class WorkOrderTwoComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            structureLoading: false,
            materialsLoading: false,
            materialsAddLoading: false,
            currentPage: 1,
            selectAssetShow: false,
            structureEditData: '',
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

        // 部件信息表格字段
        this.structureColumns = [
            {
                title: '设备设施编码',
                dataIndex: 'code',
                key: 'code',
                render: defaultRender
            },
            {
                title: '设备设施名称',
                dataIndex: 'name',
                key: 'name',
                render: defaultRender
            },
            {
                title: '所属部门',
                dataIndex: 'department',
                key: 'department',
                render: defaultRender
            },
            {
                title: '责任人',
                dataIndex: 'lead',
                key: 'lead',
                render: defaultRender
            },
        ];

        //备件信息
        this.materialsColumns = [
            {
                title: '物料编码',
                dataIndex: 'itemNum',
                key: 'itemNum',
                render: defaultRender
            },
            {
                title: '物料描述',
                dataIndex: 'description',
                key: 'description',
                render: defaultRender
            },
            {
                title: '型号',
                dataIndex: 'model',
                key: 'model',
                render: defaultRender
            },
            {
                title: '物资数量',
                dataIndex: 'currentBalance',
                key: 'currentBalance',
                render: defaultRender
            },
            {
                title: '单位',
                dataIndex: 'orderUnit',
                key: 'orderUnit',
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: defaultRender
            },
        ];

        this.materialsAddRowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                //新建所需物料勾选的数据
                this.materialsAddSelectedRows = selectedRows;
            },
        };
        const { location } = this.props;
        const isAdd = location.query.add_asset;
        this.asset = localStorage.getItem('asset');
        this.param = {
            id : isAdd ? '' : (this.asset && JSON.parse(this.asset).id),
        }
    }

    //表格多选
    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({ selectedRows : selectedRows });
        },
        onSelect: (record, selected, selectedRows) => {
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
        },
    };

    structureGetList = () => {
        const { actions, commonState, location } = this.props;
        this.setState({
            structureLoading: true,
        });
        if (this.param.id) {
            const param = {
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                productArray: commonState.productArray,
                parentId: this.param.id,
                pageNum: 1,
                pageSize: 5,
            }
            actions.structureGetList(param, () => {
                this.setState({
                    structureLoading: false,
                });
            });
        } else {
            this.setState({
                structureLoading: false,
            });
        }
    }

    // 设备信息新建
    assetAdd = () => {
        this.setState({structureEditData: ''});
        this.StepsAddModal.modalShow();
    }
  //保存设备信息
    assetAddSave = () => {
        const  { actions, state, commonState } = this.props;

        const str = JSON.parse(localStorage.param);
        const getFormValues = str.ll;
        const location = str.location;
        const classification = str.classification;
        const classificationId = str.classificationId;
        let parentAsset = str.parentAsset;
        const locationId = str.locationId;
        const parentId = this.param.id;
        const startDate = moment(getFormValues.startDate).format('YYYY-MM-DD HH:mm:ss');
        const usedate = moment(getFormValues.usedate).format('YYYY-MM-DD HH:mm:ss');
        const statusDate = moment(getFormValues.statusDate).format('YYYY-MM-DD HH:mm:ss');

        this.StepsAddForm.validateFields((err, values) => {
            const taskParam = {
                ...getFormValues,
                ...values,
                location,
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                classification,
                locationId,
                parentId,
                parentAsset,
                startDate,
                usedate,
                statusDate,
                classificationId,
                products: ["e4eca0c036f111e7afa90242ac110005"],
            }
            runActionsMethod(actions, 'informationAdd', taskParam , () => {
                this.structureGetList();
            });
         })
        this.setState({structureEditData: ''});
        this.StepsAddModal.modalHide();
    }

    // 删除部件信息
    structureDel = () => {
        const { actions } = this.props;
        const selectedRows = this.state.selectedRows;
        const taskParam = {
            ids: filterArrByAttr(selectedRows,'id').join(',')
        }
        runActionsMethod(actions, 'assetsDel', taskParam);
        this.structureGetList();
    }

    materialsAdd = () => {
        this.materialsAddModal.modalShow();
    }
   //保存勾选的物料信息
    materialsAddSave = () => {
        const { actions } = this.props;
        runActionsMethod(actions, 'materialsAdd', this.materialsAddSelectedRows);
        this.materialsAddModal.modalHide();
    }
//根据assetId查询物料
    materialsByIdGetList = () => {
        const { actions, location } = this.props;
        this.setState({
            materialsLoading: true,
        });
        if (this.param.id) {
            const materialsParam = {
                id: this.param.id,
                pageNum: 1,
                pageSize: 5,
            }
            actions.materialsByIdGetList(materialsParam, () => {
                this.setState({
                    materialsLoading: false,
                });
            });
        } else {
            this.setState({
                materialsLoading: false,
            });
        }
     }

    componentWillMount () {
        this.structureGetList();
        this.materialsByIdGetList();
    }
    render () {
        const { state, commonState , location} = this.props;
        const structureData = state.structureListData;
        const list = structureData.list;
        console.log(list);

        const materialsByIdData = state.materialsByIdListData;

        const isAdd = location.query.add_asset;
        this.asset = localStorage.getItem('asset');
        const id = isAdd ? '' : (this.asset && JSON.parse(this.asset).id);

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                        <Panel header={<span className="label">部件信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.structureLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={list}
                                columns={this.structureColumns}
                                rowSelection={this.rowSelection}
                                bordered
                            />
                            {id ?
                                <div className="panel-tools-right">
                                    <Button type="primary" size="large" onClick={this.assetAdd}>新建</Button>
                                    <Button type="primary" size="large" onClick={this.structureDel}>删除</Button>
                                </div>
                              :
                                ''
                            }
                        </Panel>
                        <Panel header={<span className="label">备件信息 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.materialsLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={materialsByIdData ? materialsByIdData.list : []}
                                columns={this.materialsColumns}
                                bordered
                            />
                        </Panel>
                    </Collapse>
                </div>
                <SelectAsset
                    multiple
                    selectAssetModalHide={() => { this.setState({ selectAssetShow: false }) }}
                    visible={this.state.selectAssetShow}
                    ignoreIds={ this.ignoreIds }
                    onOk={(selected) => {
                        this.assetAddSave(selected)
                    }}
                />
                <Modal
                    title={`${this.state.structureEditData ? '编辑' : '新建'}部件信息`}
                    ref={StepsAddModal => this.StepsAddModal = StepsAddModal}
                    afterClose={this.StepsAfterClose}
                >
                    <StructureForm data={this.state.structureEditData} ref={StepsAddForm => this.StepsAddForm = StepsAddForm} />
                    <div className="modal-footer clearfix">
                        <Button size="large" onClick={() => { this.StepsAddModal.modalHide() }}>取消</Button>
                        <Button type="primary" size="large" onClick={this.assetAddSave}>确定</Button>
                    </div>
                </Modal>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.equipment,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderTwoComponent);
