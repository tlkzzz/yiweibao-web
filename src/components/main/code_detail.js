/** 
 * @Description  二维码--详情页
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link , browserHistory } from 'react-router';
import actions from '../../actions/system.js';
import commonActions from '../../actions/common';
import { createForm } from 'rc-form';

import Dropdown from '../../components/common/dropdown.js';
import SelectPublic from '../../components/common/select_public.js';
import BackList from '../common/back_list';
import EAModal from '../../components/common/modal.js';

import { filterArrByAttr, correspondenceJson } from '../../tools/';

import moment from 'moment';

import { Icon, Button, Upload, Table, Pagination, Radio , Collapse, Form, Input, Row, Col, Select, DatePicker, Checkbox, Menu, message, Modal} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            applicationModalShow: false,
            description:'',
            applicationId:'',
        }
        this.applicationColumns = [
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
            },
        ];
    }
  //应用程序选择
    applicationAdd = (stateAttr) => {
        this.setState({ [stateAttr]: true });
    }
  //子页面取得表格组件值
    componentDidUpdate () {
        const { state, actions, form } = this.props;
        if (!state.getFormValues) {
            actions.getFormValues(form.getFieldsValue());
        }
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        const { data , commonState , state , location , actions } = this.props;
        const isAdd = location.query.add_code;

        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 4}}>
                        <FormItem
                            label="二维码"
                        >
                            {
                                getFieldDecorator('quickResponseCodeNum',{
                                    initialValue:  isAdd ? state.getCodeData : data.quickResponseCodeNum,
                                    rules: [{ required: true, message: '文本不能为空' }],
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 8}}>
                        <FormItem
                            label="描述"
                        >
                            {
                                getFieldDecorator('description',{
                                    initialValue: data ? data.description : '',
                                    rules: [{ required: true, message: '文本不能为空' }],
                                })(
                                     <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="状态"
                        >
                            {
                                getFieldDecorator('status',{
                                    initialValue:  isAdd ?  'false' : data.status + ''
                                })(
                                    <Select size="large" style={{ width: '100%' }}>
                                        <Option value="true">活动</Option>
                                        <Option value="false">不活动</Option>
                                     </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="站点"
                        >
                            {
                                getFieldDecorator('siteName',{
                                    initialValue: isAdd ? commonState.siteName : data.siteName
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" style={{display: 'none'}}>
                        <FormItem
                            label="站点id"
                        >
                            {
                                getFieldDecorator('siteId',{
                                    initialValue: isAdd ? commonState.siteId : data.siteId
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 4}}>
                        <FormItem
                            label="应用程序"
                        >
                            {
                                getFieldDecorator('applicationName',{
                                    initialValue: this.state.description ? this.state.description : data ? data.applicationName : '',
                                    rules: [{ required: true, message: '文本不能为空' }],
                                })(
                                    <Input  onClick={() => {this.applicationAdd('applicationModalShow')}}  suffix={<Icon type="plus"/>} />
                                )
                            }
                        </FormItem>
                        <SelectPublic
                            fetch={{
                                url: "/eam/open/qrCode/findQRCodeApplicationList",
                                type: 'get',
                                data: {
                                    pageNum:1,
                                    pageSize:5,
                                },
                                actionsType: 'APPLICATION_GET_LIST'
                            }}
                            stateAttr="applicationListData"
                            width={800}
                            modalHide={() => { this.setState({ applicationModalShow: false }) }}
                            columns={this.applicationColumns}
                            visible={this.state.applicationModalShow}
                            onOk={record => {
                                this.setState({
                                     description: record.description,
                                     applicationId: record.id,
                                })
                            }}
                        />
                    </Col>
                    <Col className="gutter-row" style={{display: 'none'}}>
                        <FormItem
                            label="应用程序id"
                        >
                            {
                                getFieldDecorator('applicationId',{
                                    initialValue: this.state.applicationId ? this.state.applicationId : data ? data.applicationId : '',
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="上次生成时间"
                        >
                            {
                                getFieldDecorator('lastGenerateDate',{
                                    initialValue: data ? data.lastGenerateDate : ''
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 4}} offset={2}>
                        <FormItem
                            label="有数据更新？"
                        >
                            {
                                getFieldDecorator('dataUpdate',{
                                    initialValue: data ? data.dataUpdate + '' : 'false'
                                })(
                                    <RadioGroup size="large" className="radio-group-col-2" style={{ width: '100%' }} disabled >
                                        <RadioButton value="true"><i className="radio-group-icon-o"></i>是</RadioButton>
                                        <RadioButton value="false"><Icon type="minus" />否</RadioButton>
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

class CodeDetailComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            taskstepsLoading: false,
            allPropertyLoading: false,
            applicationId: '',
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };
        const { location } = this.props;

        const isAdd = location.query.add_code;
        this.code = localStorage.getItem('code');
        this.taskParam = {
            id: isAdd ? '' : (this.code && JSON.parse(this.code).id),
        }

        this.allPropertyAddRowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                //新建所需物料勾选的数据
                this.allPropertyAddSelectedRows = selectedRows;
            },
        };

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        // 属性字段
        this.taskStepsColumns = [
            {
                title: '序号',
                dataIndex: 'sequence',
                key: 'sequence',
                sorter: true,
                render: (text, record, key) => {
                    const sequence = parseInt(key) + 1
                    record.sequence = sequence;
                    return (
                        <p>{sequence}</p>
                    )
                }
            },
            {
                title: '属性',
                dataIndex: 'property',
                key: 'property',
                sorter: true,
                render: defaultRender
            },
            {
                title: '属性描述',
                dataIndex: 'propertyName',
                key: 'propertyName',
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
                            <Icon  className="icon-right"
                                type="delete"
                                onClick={() => {
                                    this.allPropertyDel(record)
                                }}
                            />
                        </div>
                    )
                }
            },
        ];
        // 所有属性表格字段
        this.allPropertyAddColumns = [
            {
                title: '属性',
                dataIndex: 'property',
                key: 'property',
                sorter: true,
                render: defaultRender
            },
            {
                title: '属性描述',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
        ];
    }

    // 表格事件---排序部分
    tableChange = (pagination, filters, sorter) => {
        if (sorter.order) {
            let sorterOrder = sorter.order;
            let endIndex = sorterOrder.indexOf('end');
            sorterOrder = sorterOrder.slice(0, endIndex);
            this.param.sorts = `${sorter.field} ${sorterOrder}`;
        } else {
            this.param.sorts = '';
        }
        this.getList();
    }
    pageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.param.pageNum = page;
        this.allPropertyAdd();
    }
    // 根据Id查询二维码
    getList = () => {
        const { actions, state } = this.props;
        this.setState({
            taskstepsLoading: true,
        });
        if(this.taskParam.id != '') {
            actions.updateList(this.taskParam, () => {
                this.setState({
                    taskstepsLoading: false,
                })
            });
        } else {
            this.setState({
                taskstepsLoading: false,
            })
        }
    }
    // 新建应用程序属性列表获取
    allPropertyAdd = () => {
        const { actions, state } = this.props;
        const applicationId = this.codeAddForm.props.form.getFieldValue("applicationId");
        if(applicationId) {
            this.setState({
                allPropertyLoading: true,
                applicationId: applicationId,
            });
        let ids = state.codeByIdListData.qrcodeApplicationPropertyVoList  ?  filterArrByAttr(state.codeByIdListData.qrcodeApplicationPropertyVoList, 'propertyId').join(',') : '';
        if (!ids) {
            ids = [" "];
        }
            const param = {
                applicationId,
                ids: ids,
                pageNum: 1,
                pageSize: 10,
            };
            actions.allPropertyGetList(param, () => {
                this.setState({
                    allPropertyLoading: false,
                })
            });
            this.allPropertyAddModal.modalShow();
        }else{
            message.error('请先选择应用程序');
        }
    }
    // 新建属性保存
    allPropertyAddSave = () => {
        const { actions } = this.props;
        let newData = Object.assign([], this.allPropertyAddSelectedRows);
        for(let i in newData) {
            newData[i].propertyId = newData[i].id;
            newData[i].description = newData[i].property
            if (newData[i].id) {
                delete newData[i].id
             }
        }
        actions.updateList(['PROPERTY_ADD', newData]);
        this.allPropertyAddModal.modalHide();
    }
    // 属性列表删除
    allPropertyDel = (record) => {
        console.log(record);
        let { actions } = this.props;
        actions.updateList(['PROPERTY_DEL', record]);
    }

    componentWillMount () {
        const { actions, location , commonState } = this.props;
        const isAdd = location.query.add_code;
        if (isAdd) {
            actions.codeGetList({modelKey: 'qrCode', siteId : commonState.siteId});
            actions.updateList({id: ''}, () => {
                this.setState({
                    taskstepsLoading: false,
                })
            });
        }else{
            this.getList();
        }
    }

    render () {
        const { state, commonState ,location , actions } = this.props;
        const list = state.codeByIdListData;
        //获取属性列表
        const qrcodeApplicationPropertyVoList = list.qrcodeApplicationPropertyVoList;
        //应用程序列表
        const allPropertyList = state.allPropertyListData;
        //自动生成编码
        const getCodeData = state.getCodeData;

        return (
            <div className="eam-tab-page">
            	<div className="main-nav clearfix">
                    {/*<Link to="/main/settings/ip" activeClassName="active">IP管理</Link>*/}
                    <Link to="/main/settings/code" activeClassName="active" className="active" >二维码管理</Link>
                </div>
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewFormComponent  data={list} location={location} actions={actions}  state={state} commonState={commonState} wrappedComponentRef={codeAddForm => this.codeAddForm = codeAddForm} />
                        </Panel>
                        <Panel header={<span className="label">属性<Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.taskstepsLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={qrcodeApplicationPropertyVoList}
                                columns={this.taskStepsColumns}
                                rowSelection={this.rowSelection}
                                bordered
                            />
                            <div className="panel-tools-right">
                                <Button type="primary" size="large"  onClick={this.allPropertyAdd}>新增</Button>
                            </div>
                        </Panel>
                    </Collapse>
                </div>
                <EAModal
                    title={
                        <div>
                            <Pagination
                                total={allPropertyList && allPropertyList.length}
                                current={this.state.currentPage}
                                onChange={this.pageChange}
                                className="pull-right"
                            />
                            <span>{`选择属性`}</span>
                        </div>
                    }
                    ref={allPropertyAddModal => this.allPropertyAddModal = allPropertyAddModal}
                    width={800}
                >
                    <Table
                        rowSelection={this.allPropertyAddRowSelection}
                        loading={this.state.allPropertyAddLoading}
                        rowKey="propertyId"
                        pagination={false}
                        dataSource={allPropertyList}
                        columns={this.allPropertyAddColumns}
                        bordered
                    />
                    <div className="modal-footer clearfix">
                        <Pagination
                            total={allPropertyList && allPropertyList.length}
                            className="pull-left"
                            showTotal={(total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`}
                            current={this.state.currentPage}
                            onChange={this.pageChange}
                            style={{padding: 0}}
                        />
                        <Button size="large" onClick={() => { this.allPropertyAddModal.modalHide() }}>取消</Button>
                        <Button type="primary" size="large" onClick={this.allPropertyAddSave}>确定</Button>
                    </div>
                </EAModal>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.system,
        commonState: state.common,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(CodeDetailComponent);
