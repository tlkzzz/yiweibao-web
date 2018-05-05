/** 
 * @Description  培训管理--评价
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
const { TextArea } = Input;

class FormComponent extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
        currentPage: 1,
        selectPersonModalShow: false,
      }
  }

  userAdd = () => {
      this.setState({ selectPersonModalShow: true });
  }

    render () {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.props;
        const list = data.list;

        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 12}}>
                        <FormItem
                            label="培训内容"
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
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="评价人"
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
                            label="培训有效性"
                        >
                            {
                              getFieldDecorator('name',{
                                  initialValue: data ? data.name : ''
                                })(
                                  <Select size="large" style={{ width: '100%' }}>
                                      <Option value="优">优</Option>
                                      <Option value="良">良</Option>
                                      <Option value="中">中</Option>
                                      <Option value="差">差</Option>
                                  </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 12}}>
                        <FormItem
                            label="培训评价"
                        >
                            {
                              getFieldDecorator('status',{
                                  initialValue: data ? data.status : ''
                                })(
                                  <Input  />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="评价日期"
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
                            label="培训复合型"
                        >
                            {
                                getFieldDecorator('startDat',{
                                    initialValue: data ? data.startDat : ''
                                })
                                (
                                  <Select size="large" style={{ width: '100%' }}>
                                      <Option value="优">优</Option>
                                      <Option value="良">良</Option>
                                      <Option value="中">中</Option>
                                      <Option value="差">差</Option>
                                  </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 12}}>
                        <FormItem
                            label="部门评价"
                        >
                            {
                                getFieldDecorator('startDat',{
                                    initialValue: data ? data.startDat : ''
                                })
                                (
                                    <TextArea />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="部门评价日期"
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
                            label="培训适宜型"
                        >
                            {
                                getFieldDecorator('startDat',{
                                    initialValue: data ? data.startDat : ''
                                })
                                (
                                  <Select size="large" style={{ width: '100%' }}>
                                      <Option value="优">优</Option>
                                      <Option value="良">良</Option>
                                      <Option value="中">中</Option>
                                      <Option value="差">差</Option>
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

        this.taskParam = {
            id: localStorage.assetId,
            pageNum: 1,
            pageSize: 10,
        };
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
                    <Collapse bordered={false} defaultActiveKey={['1']}>
                        <Panel header={<span className="label">培训评价信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewFormComponent  data={list}/>
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
