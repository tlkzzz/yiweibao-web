/**
 * @Description  安全检查标准库
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/equipment.js';

import Dropdown from '../../components/common/dropdown.js';
import BackList from '../common/back_list';

import { Icon, Button, Upload, Modal, Table, Pagination, Collapse, Form, Input, Row, Col, Select, DatePicker, Checkbox } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;

class FormComponent extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
        currentPage: 1,
      }
  }

    render () {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.props;
        const list = data.list;

        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 4}}>
                        <FormItem
                            label="*计划编码"
                        >
                            {
                              getFieldDecorator('c',{
                                  initialValue: data ? data.c : ''
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 8}}>
                        <FormItem
                            label="名称"
                        >
                            {
                              getFieldDecorator('name',{
                                  initialValue: data ? data.name : ''
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="创建人"
                        >
                            {
                                getFieldDecorator('usedate',{
                                  initialValue: data ? data.usedate : ''
                                })
                                (
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
                                getFieldDecorator('usedate',{
                                  initialValue: data ? data.usedate : ''
                                })
                                (
                                  <Select size="large" style={{ width: '100%' }}>
                                      <Option value="活动">活动</Option>
                                      <Option value="不活动">不活动</Option>
                                  </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 12}}>
                        <FormItem
                            label="备注"
                        >
                            {
                                getFieldDecorator('startDat',{
                                    initialValue: data ? data.startDat : ''
                                })
                                (
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="创建日期"
                        >
                            {
                                getFieldDecorator('startDa',{
                                    initialValue: data ? data.startDa : ''
                                })
                                (
                                  <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="Select Time"
                                    onChange={(onChange) => {}}
                                    onOk={(onOk) => {}}
                                  />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="状态日期"
                        >
                            {
                                getFieldDecorator('usedate',{
                                  initialValue: data ? data.usedate : ''
                                })
                                (
                                  <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="Select Time"
                                    onChange={(onChange) => {}}
                                    onOk={(onOk) => {}}
                                  />
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
//频率信息
class BuyFormComponent extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
        currentPage: 1,
      }
  }

    render () {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.props;
        const list = data.list;

        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="*检查频率"
                        >
                            {
                                getFieldDecorator('vendorId ',{
                                  initialValue : data ? data.vendorId : ''
                                })(
                                    <Input  />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="*频率单位"
                        >
                            {
                              getFieldDecorator('warrantyEndDate      ',{
                                initialValue : data ? data.warrantyEndDate : ''
                              })(
                                <Select size="large" style={{ width: '100%' }}>
                                    <Option value="天">天</Option>
                                    <Option value="周">周</Option>
                                    <Option value="月">月</Option>
                                    <Option value="年">年</Option>
                                </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="*下次生成日期"
                        >
                            {
                                getFieldDecorator('usedate',{
                                  initialValue: data ? data.usedate : ''
                                })
                                (
                                  <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="Select Time"
                                    onChange={(onChange) => {}}
                                    onOk={(onOk) => {}}
                                  />
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

        this.taskParam = {
            id: localStorage.assetId,
            pageNum: 1,
            pageSize: 10,
        };

        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        // 表格字段
        this.taskStepsColumns = [
            {
                title: '序号',
                dataIndex: 'name',
                key: 'name',
                sorter: true,
                render: defaultRender
            },
            {
                title: '检查项编码',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '危险点描述',
                dataIndex: 'qualityStandard',
                key: 'qualityStandard',
                sorter: true,
                render: defaultRender
            },
            {
                title: '预防措施',
                dataIndex: 'duration',
                key: 'duration',
                sorter: true,
                render: defaultRender
            },
            {
                title: '备注',
                dataIndex: 'dur',
                key: 'dur',
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
                           <Icon type="delete" />
                        </div>
                    )
                }
            },
        ];
    }

    // 设备设施信息
    taskGetList = () => {
        const { actions } = this.props;
        this.setState({
            taskstepsLoading: true,
            materialsLoading: true
        });
        actions.informationGetList(this.taskParam, () => {
            this.setState({
                taskstepsLoading: false,
                materialsLoading: false
            });
        });
    }

    componentWillMount () {
        this.taskGetList();
    }
    render () {
      const { state } = this.props;
      const list = state.informationListData;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewFormComponent  data={list}/>
                        </Panel>
                        <Panel header={<span className="label">频率信息 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            <BFormComponent  data={list} />
                        </Panel>
                        <Panel header={<span className="label">检查项<Icon type="caret-down" /></span>} key="3" style={this.customPanelStyle}>
                            <Table
                                rowKey="id"
                                loading={this.state.taskstepsLoading}
                                pagination={{
                                    showTotal: (total, range) => `当前第${range[0]}-${range[1]}条 / 共${total}条`,
                                    defaultPageSize: 5,
                                }}
                                dataSource={[]}
                                columns={this.taskStepsColumns}
                                rowSelection={this.rowSelection}
                                bordered
                            />
                        </Panel>
                    </Collapse>
                </div>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.equipment,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderOneComponent);
