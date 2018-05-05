/** 
 * @Description  锁管理-详情页面
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/equipment.js';

import Dropdown from '../../components/common/dropdown.js';
import BackList from '../common/back_list';

import { Icon, Button, Upload, Modal, Table, Pagination, Collapse, Form, Input, Row, Col, Select, DatePicker, Checkbox, Menu } from 'antd';
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
                            label="*锁编码"
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
                            label="描述"
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
                            label="*锁类型"
                        >
                            {
                              getFieldDecorator('name',{
                                  initialValue: data ? data.name : ''
                                })(
                                  <Select size="large" style={{ width: '100%' }}>
                                      <Option value="普通锁">普通锁</Option>
                                      <Option value="智能锁">智能锁</Option>
                                  </Select>
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
                                  initialValue: data ? data.status : ''
                                })(
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
                    <Col className="gutter-row" xs={{ span: 4}}>
                        <FormItem
                            label="*锁位置"
                        >
                            {
                                getFieldDecorator('startDat',{
                                    initialValue: data ? data.startDat : ''
                                })
                                (
                                    <Input  />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 8}}>
                        <FormItem
                            label="描述"
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
                            label="钥匙数量"
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
                            label="状态日期"
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
                title: '钥匙编码',
                dataIndex: 'description',
                key: 'description',
                sorter: true,
                render: defaultRender
            },
            {
                title: '钥匙描述',
                dataIndex: 'qualityStandard',
                key: 'qualityStandard',
                sorter: true,
                render: defaultRender
            },
            {
                title: '钥匙类型',
                dataIndex: 'duration',
                key: 'duration',
                sorter: true,
                render: defaultRender
            },
            {
                title: '数量',
                dataIndex: 'dur',
                key: 'dur',
                sorter: true,
                render: defaultRender
            },
            {
                title: '状态',
                dataIndex: 'qualityStandar',
                key: 'qualityStandar',
                sorter: true,
                render: defaultRender
            },
            {
                title: '注意事项',
                dataIndex: 'duratio',
                key: 'duratio',
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
      const { state, commonState } = this.props;
      const list = state.informationListData;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewFormComponent  data={list}/>
                        </Panel>
                        <Panel header={<span className="label">钥匙信息<Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
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
                            <div className="panel-tools-right">
                            <Dropdown
                                overlay={(
                                    <Menu >
                                        <Menu.Item key="3" ><Icon type="delete" /> 批量删除</Menu.Item>
                                        <Menu.Item key="1"><Icon type="setting" /> 导出Excel</Menu.Item>
                                    </Menu>
                                )}
                                trigger={['click']}
                            >
                                更多操作
                            </Dropdown>
                                <Button type="primary" size="large" >新增</Button>
                            </div>
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
