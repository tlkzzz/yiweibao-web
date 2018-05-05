/** 
 * @Description 技术参数
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions/equipment.js';
import commonActions from '../../actions/common';

import Dropdown from '../../components/common/dropdown.js';
import NumInp from '../../components/common/num_inp.js';
import Modal from '../../components/common/modal.js';
import { filterArrByAttr , runActionsMethod } from '../../tools';

import { Icon, Button, Table, Pagination, message, InputNumber, Collapse, Form, Input, Row, Col, Select, DatePicker, Menu, Timeline } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;

import moment from 'moment';

// 技术参数新建表单
class technologyFormComponent extends React.Component {
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

        return (
            <Form>
                <FormItem
                    {...this.formItemLayout}
                    label="名称"
                >
                    {
                        getFieldDecorator('name', {
                            initialValue: data ? data.name : '',
                            rules: [{ required: true, message: '文本不能为空' }],
                        })(
                            <Input style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="描述"
                >
                    {
                        getFieldDecorator('description', {
                            initialValue: data ? data.description : '',
                            rules: [{ required: true, message: '文本不能为空' }],
                        })(
                            <Input style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="数值"
                >
                    {
                        getFieldDecorator('value', {
                            initialValue: data ? data.value : '',
                            rules: [{ required: true, message: '文本不能为空' }],
                        })(
                            <InputNumber precision={2} min={1} style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="单位"
                >
                    {
                        getFieldDecorator('unit', {
                            initialValue: data ? data.unit : '',
                            rules: [{ required: true, message: '文本不能为空' }],
                        })(
                            <Input style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
const NewtechnologyForm = Form.create()(technologyFormComponent);

class WorkOrderTwoComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            technologyLoading: false,
            currentPage: 1,
            technologyEditData: '',
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

        this.recordDate = null;

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        // 技术参数表格字段
        this.technologyColumns = [
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
                title: '数值',
                dataIndex: 'value',
                key: 'value',
                render: defaultRender
            },
            {
                title: '单位',
                dataIndex: 'unit',
                key: 'unit',
                render: defaultRender
            },
            {
                title: '创建时间',
                dataIndex: 'createDate',
                key: 'createDate',
                render: defaultRender
            },
        ];
    }
    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }
    //表格多选
   rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({ selectedRows : selectedRows });
        },
        onSelect: (record, selected, selectedRows) => {

        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },
    };
    // 技术参数列表
    taskGetList = () => {
        const { actions, location, commonState } = this.props;
        const isAdd = location.query.add_asset;
        this.asset = localStorage.getItem('asset');
        const assetId = isAdd ? '' : (this.asset && JSON.parse(this.asset).id);
        this.setState({
            technologyLoading: true,
        });
        if (assetId) {
            const taskParam = {
                assetId: assetId,
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                productArray: commonState.productArray,
                pageNum: 1,
                pageSize: 10,
            }
            actions.technologyGetList(taskParam, () => {
                this.setState({
                    technologyLoading: false,
                });
            });
        } else {
            this.setState({
                technologyLoading: false,
            });
        }
    }
    // 新建技术参数
    technologyAdd = () => {
        this.setState({technologyEditData: ''});
        this.technologyAddModal.modalShow();
    }
    // 保存新建技术参数
    technologyAddSave = () => {
        const { actions, commonState, location } = this.props;
        let editJson = this.state.technologyEditData;
        const isAdd = location.query.add_asset;

        const assetId = isAdd ? '' : (JSON.parse(localStorage.getItem('asset')).id);
        this.technologyAddForm.validateFields((err, values) => {
            if (err) return;
            values.id = editJson.id;
            const param = {
                ...values,
                siteId: commonState.siteId,
                orgId: commonState.orgId,
                assetId,
                products: commonState.productArray,
            }
            actions.technologyAdd(param,() => {
                this.taskGetList();
            });
        });
        this.technologyAddModal.modalHide();
    }

    // 删除技术参数
    technologyDel = () => {
        const { actions } = this.props;
        const selectedRows = this.state.selectedRows;
        const taskParam = {
            ids: [filterArrByAttr(selectedRows,'id').join(',')]
        }
        runActionsMethod(actions, 'technologyDel', taskParam);
        this.taskGetList();
    }

    technologyAfterClose = () => {
        this.technologyAddForm.resetFields();
    }
    componentWillMount () {
        this.taskGetList();
    }
    render () {
        const { state , commonState, location} = this.props;
        const taskData = state.technologyListData
        const list = taskData.list;

        const isAdd = location.query.add_asset;
        this.asset = localStorage.getItem('asset');
        const assetId = isAdd ? '' : (this.asset && JSON.parse(this.asset).id);
        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1']}>
                        <Panel header={<span className="label">技术参数 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.technologyLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={list}
                                columns={this.technologyColumns}
                                rowSelection={this.rowSelection}
                                bordered
                            />
                            {assetId ?
                                <div className="panel-tools-right">
                                    <Button type="primary" size="large" onClick={this.technologyAdd}>新建</Button>
                                    <Button type="primary" size="large" onClick={this.technologyDel}>删除</Button>
                                </div>
                            :
                               ''
                            }
                        </Panel>
                    </Collapse>
                </div>
                <Modal
                    title={`${this.state.technologyEditData ? '编辑' : '新建'}任务步骤`}
                    ref={technologyAddModal => this.technologyAddModal = technologyAddModal}
                    onOk={this.technologyAddSave}
                    afterClose={this.technologyAfterClose}
                >
                    <NewtechnologyForm data={this.state.technologyEditData} ref={technologyAddForm => this.technologyAddForm = technologyAddForm} />
                    <div className="modal-footer clearfix">
                        <Button size="large" onClick={() => { this.technologyAddModal.modalHide() }}>取消</Button>
                        <Button type="primary" size="large" onClick={this.technologyAddSave}>确定</Button>
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
