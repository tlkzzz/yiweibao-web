/** 
 * @Description 能源价格
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import actions from '../../actions/equipment.js';
import SearchInp from '../../components/common/search_inp.js';
import DropdownMenu from '../../components/common/dropdown_menu.js';
import Multiselect from '../../components/common/multiselect.js';
import EamModal from '../../components/common/modal.js';
import Collection from '../../components/common/collection.js';
import Dropdown from '../../components/common/dropdown.js';
import ListTools from '../common/list_tools';
 import MoreOperations from '../../components/common/more_operations.js';

import { runActionsMethod ,filterArrByAttr} from '../../tools/';

import { Icon, Checkbox, Modal, InputNumber , Button, Table, Form, Input, Pagination, Menu, message, Select } from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;

// 能源价格新建表单
class energyPriceFormComponent extends React.Component {
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
                    label="能源种类"
                >
                    {
                        getFieldDecorator('fillFormId', {
                            initialValue: data ? data.fillFormId : '',
                            rules: [{ required: true, message: '文本不能为空' }],
                        })(
                            <Input style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="单位"
                >
                    {
                        getFieldDecorator('priceUnit', {
                            initialValue: data ? data.priceUnit : '',
                            rules: [{ required: true, message: '文本不能为空' }],
                        })(
                            <Input style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="日常价格"
                >
                    {
                        getFieldDecorator('price', {
                            initialValue: data ? data.price : '',
                            rules: [{ required: true,message: '请填入数字类型' }],
                        })(
                            <InputNumber precision={2} min={1} style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="波峰价格"
                >
                    {
                        getFieldDecorator('crestPrice', {
                            initialValue: data ? data.crestPrice : '',
                            rules: [{ required: true, message: '请填入数字类型' }],
                        })(
                            <InputNumber precision={2} min={1} style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="波谷价格"
                >
                    {
                        getFieldDecorator('troughPrice', {
                            initialValue: data ? data.troughPrice : '',
                            rules: [{required: true, message: '请填入数字类型' }],
                        })(
                            <InputNumber precision={2} min={1} style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="状态"
                >
                    {
                        getFieldDecorator('status', {
                            initialValue: data ? data.status : '',
                            rules: [{ required: true, message: '文本不能为空' }],
                        })(
                            <Select size="large" style={{ width: '100%' }} >
                                <Option value="活动">活动</Option>
                                <Option value="不活动">不活动</Option>
                            </Select>
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
const NewenergyPriceForm = Form.create()(energyPriceFormComponent);

class EnergyPriceComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
            tableLoading: false,
            energyPriceEditData: '',
            rowSelection: null, // 表格多选
            selectedRows: [],
        }
        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };


        //表格字段
        this.columns = [
            {
                title: '能源种类',
                dataIndex: 'fillFormId',
                key: 'fillFormId',
                sorter: false,
                render: defaultRender
            },
            {
                title: '单位',
                dataIndex: 'priceUnit',
                key: 'priceUnit',
                sorter:false,
                render: defaultRender
            },
            {
                title: '日常价格',
                dataIndex: 'price',
                key: 'price',
                sorter: (a, b) => a.price-b.price,
                render: (text, record, key) => {
                    return (
                        <div className="number-center">{text}</div>
                    )
                }
            },
            {
                title: '波峰价格',
                dataIndex: 'crestPrice',
                key: 'crestPrice',
                sorter: (a, b) =>  a.crestPrice - b.crestPrice,
                render: (text, record, key) => {
                    return (
                        <div className="number-center">{text}</div>
                    )
                }
            },
            {
                title: '波谷价格',
                dataIndex: 'troughPrice',
                key: 'troughPrice',
                sorter: (a, b) => a.troughPrice -b.troughPrice,
                render: (text, record, key) => {
                    return (
                        <div className="number-center">{text}</div>
                    )
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                sorter: false,
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
                            <Icon  className="icon-right"
                                type="delete"
                                onClick={() => {
                                    this.listMoreOperations.cancel();
                                    this.showConfirm(record.id, record.fillFormId)
                                }}
                            />
                            <Icon type="edit"
                                onClick={() => {
                                    this.energyPriceEdit(record);
                                }}
                            />
                        </div>
                    )
                }
            },
        ];

        //*** 初始化列表参数 需要到处改参数的请求 把参数定义到这里 严禁把参数用state管理 因为参数变化不需要触发render来渲染页面
        this.param = {
            pageNum: 1,
            pageSize: 10,
        }

    }

    // 分页事件
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page; //*** 需要修改参数 在方法内单独修改
        this.getList();
    }

    onShowSizeChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page;
        this.param.pageSize = pageSize;//*** 需要修改参数 在方法内单独修改
        this.getList();
    }
    // 获取列表数据
    getList = () => {
        const { actions } = this.props;
        this.setState({ tableLoading: true });
        actions.energyPriceGetList(this.param, () => {
            this.setState({ tableLoading: false });
        });
    }

    // 新建能源价格
    energyPriceAdd = () => {
        this.setState({energyPriceEditData: ''});
        this.energyPriceAddModal.modalShow();
        this.listMoreOperations.cancel();
    }
    // 保存新建/编辑任务步骤
    energyPriceAddSave = () => {
        let { actions } = this.props;
        let editJson = this.state.energyPriceEditData;

        this.energyPriceAddForm.validateFields((err, values) => {
            if (err) return;
            values.id = editJson.id;
            if(editJson){
                actions.energyPriceUpdate(values, ()=>{
                    this.getList();
                });
            }
            else{
                actions.energyPriceCreate(values, ()=>{
                    this.getList();
                });
            }
            this.energyPriceAddModal.modalHide();
        });
    }
    //编辑能源价格
    energyPriceEdit = (record) => {
        this.setState({energyPriceEditData: record});
        this.energyPriceAddModal.modalShow();
        this.listMoreOperations.cancel();
    }
    energyPriceClose = () => {
        this.energyPriceAddModal.modalHide();
    }
    energyPriceAfterClose = () => {
        this.energyPriceAddForm.resetFields();
    }
    tableSelectChange = (selectedRows) => {
        this.setState({ selectedRows });
    }
    // 更多操作
    moreClick = () => {
        this.showConfirm(this.state.selectedRows)
    }
    // 删除确认
    showConfirm = (id, text) => {
        if (!id) {
            message.error('请选择要删除的数据。')
        } else {
            confirm({
                title: `删除 ${text ? text : '数据' }?`,
                okText: '删除',
                onOk: () => {
                    this.del(id);
                }
            });
        }
    }
    // 列表删除
    del = (id) => {
        const { actions } = this.props;
        let param = {ids: id};
        runActionsMethod(actions, 'energyPriceDel', param, () => {
            this.setState({
                selectedRows : []
            })
            this.getList();
        });
    }

    // 模糊查询
    fuzzyQuery = (keywords) => {
        this.param.word = keywords;
        this.getList();
    }
    componentWillMount () {
        this.getList();
    }
    render () {

        const { children , state } = this.props;
        const data = state.energyPriceListData //*** 拿到请求返回的数据
        const list = data.list;
        const rowSelection = this.state.rowSelection ?
                            {
                                selectedRows: this.state.selectedRows,
                                onChange: this.tableSelectChange,
                            } :
                            null;
        return children ?
        (
            <div className="eam-content">
                {children}
            </div>
        ) :
        (
            <div>
                <div className="top-bar clearfix">
                    <ListTools
                        title="能源价格"

                        onEnter={(text) => {
                            this.fuzzyQuery(text);
                        }}
                    />
                    <div className="list-tools-right pull-right">
                        <Pagination
                            total={data.total}
                            className="pull-left"
                            current={this.state.currentPage}
                            onChange={this.pageChange}
                        />
                        <MoreOperations
                            style={{float: 'left'}}
                            ref={listMoreOperations => this.listMoreOperations = listMoreOperations}
                            menuData={[
                                {
                                    icon: 'delete',
                                    text: '批量删除',
                                    confirmText: '确认删除'
                                }
                            ]}
                            onChange={(key, showCheckbox) => {
                                let rowSelection;

                                if (showCheckbox) {
                                    this.setState({ selectedRows: [] }); // 清空选择
                                    rowSelection = true
                                } else {
                                    rowSelection = false;
                                }

                                this.setState({
                                    rowSelection,
                                }, () => {
                                    this.setState({
                                        moreOperationsKey: key,
                                    })
                                })
                            }}
                            onOk={ ()=> {
                                this.moreClick();
                            }}
                        />
                        <Button type="primary" size="large" onClick={this.energyPriceAdd}>新建</Button>
                    </div>
                </div>
                <div className="eam-content">
                    <div className="eam-content-inner">
                        <Table
                            loading={this.state.tableLoading}
                            rowKey="id"
                            pagination={false}
                            dataSource={list} // ***渲染数据
                            columns={this.columns}
                            rowSelection={rowSelection}
                            bordered
                            onChange={this.tableChange}
                        />
                        <Pagination
                            total={data.total}
                            showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                            current={this.state.currentPage}
                            showQuickJumper
                            showSizeChanger
                            onChange={this.pageChange}
                            onShowSizeChange={this.onShowSizeChange}
                        />
                    </div>
                </div>
                <EamModal
                    title={`${this.state.energyPriceEditData ? '编辑' : '新建'}能源价格`}
                    ref={energyPriceAddModal => this.energyPriceAddModal = energyPriceAddModal}
                    afterClose={this.energyPriceAfterClose}
                >
                    <NewenergyPriceForm data={this.state.energyPriceEditData} ref={energyPriceAddForm => this.energyPriceAddForm = energyPriceAddForm} />
                    <div className="modal-footer clearfix">
                        <Button size="large" onClick={this.energyPriceClose}>取消</Button>
                        <Button type="primary" size="large" onClick={this.energyPriceAddSave}>确定</Button>
                    </div>
                </EamModal>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.equipment
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(EnergyPriceComponent);
