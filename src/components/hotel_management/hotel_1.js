/** 
 * @Description 酒店管理-详情页面
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/common.js';

import Dropdown from '../../components/common/dropdown.js';
import moment from 'moment';

import { Icon, Button, Upload, Modal, Checkbox, Spin, Table, Pagination, Collapse, Tree, Form, Input, Row, Col, Select, DatePicker } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const { TextArea } = Input;

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

        return (
          <Form layout="vertical">
              <Row gutter={16} justify="start">
                  <Col className="gutter-row" xs={{ span: 6}}>
                      <FormItem
                          label="酒店编号"
                      >
                          {
                            getFieldDecorator('ip',{
                                initialValue: data ? data.ip : ''
                              })(
                                  <Input />
                              )
                          }
                      </FormItem>
                  </Col>
                  <Col className="gutter-row" xs={{ span: 6}} >
                      <FormItem
                          label="酒店名称"
                      >
                          {
                              getFieldDecorator('creater',{
                                  initialValue: data ? data.creater : ''
                              })
                              (
                                  <Input />
                              )
                          }
                      </FormItem>
                  </Col>
                  <Col className="gutter-row" xs={{ span: 6}} >
                      <FormItem
                          label="国家"
                      >
                          {
                            getFieldDecorator('stats ', {
                                initialValue: data ? data.stats : ''
                              })(
                                <Select size="large" style={{ width: '100%' }}>
                                    <Option value="请选择">请选择</Option>
                                    <Option value="中国">中国</Option>
                                </Select>
                              )
                          }
                      </FormItem>
                  </Col>
                  <Col className="gutter-row" xs={{ span: 6}} >
                      <FormItem
                          label="城市"
                      >
                          {
                            getFieldDecorator('status ', {
                                initialValue: data ? data.status : ''
                              })(
                                <Select size="large" style={{ width: '100%' }}>
                                    <Option value="北京">北京</Option>
                                    <Option value="上海">上海</Option>
                                    <Option value="深圳">深圳</Option>
                                </Select>
                              )
                          }
                      </FormItem>
                  </Col>
              </Row>
              <Row gutter={16} justify="start">
                  <Col className="gutter-row" xs={{ span: 12}}>
                      <FormItem
                          label="英文名称"
                      >
                          {
                            getFieldDecorator('meno', {
                                initialValue: data? data.meno : ''
                              })(
                                  <Input />
                              )
                          }
                      </FormItem>
                  </Col>
                  <Col className="gutter-row" xs={{ span: 12}}>
                      <FormItem
                          label="地址"
                      >
                          {
                            getFieldDecorator('meno', {
                                initialValue: data? data.meno : ''
                              })(
                                  <Input />
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
                            getFieldDecorator('meno', {
                                initialValue: data? data.meno : ''
                              })(
                                  <TextArea />
                              )
                          }
                      </FormItem>
                  </Col>
                  <Col className="gutter-row" xs={{ span: 6}}>
                      <FormItem
                          label="酒店品牌"
                      >
                          {
                              getFieldDecorator('test7')(
                                <Select size="large" style={{ width: '100%' }}>
                                    <Option value="请选择">请选择</Option>
                                    <Option value="凯宾斯基">凯宾斯基</Option>
                                    <Option value="诺金">诺金</Option>
                                </Select>
                              )
                          }
                      </FormItem>
                  </Col>
                  <Col className="gutter-row" xs={{ span: 6}}>
                      <FormItem
                          label="酒店星级"
                      >
                          {
                            getFieldDecorator('site',{
                              initialValue: data ? data.site  : ''
                              })(
                                <Select size="large" style={{ width: '100%' }}>
                                    <Option value="五星级">五星级</Option>
                                    <Option value="四星级">四星级</Option>
                                    <Option value="三星级">三星级</Option>
                                    <Option value="二星级">二星级</Option>
                                    <Option value="一星级">一星级</Option>
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
const NewFormComponent = Form.create()(FormComponent)

//建筑信息
class FrequencyComponent extends React.Component {
    render () {
        const { getFieldDecorator } = this.props.form;
        const { data } = this.props;
        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="建筑层数"
                        >
                            {
                                getFieldDecorator('vendorId ',{
                                  initialValue : data ? data.vendorId : ''
                                })(
                                  <Select size="large" style={{ width: '100%' }}>
                                      <Option value="请选择">请选择</Option>
                                      <Option value="地上一层">地上一层</Option>
                                      <Option value="地上二层">地上二层</Option>
                                      <Option value="地上三层">地上三层</Option>
                                      <Option value="地上四层">地上四层</Option>
                                      <Option value="地上五层">地上五层</Option>
                                  </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}} offset={6}>
                        <FormItem
                            label="建筑高度(m)"
                        >
                            {
                              getFieldDecorator('manufacturer  ',{
                                initialValue : data ? data.manufacturer  : ''
                              })(
                                  <Input readOnly />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="客房数量(间)"
                        >
                            {
                              getFieldDecorator('serialNum  ',{
                                initialValue : data ? data.serialNum  : ''
                              })(
                                    <Input  readOnly/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="建筑主朝向"
                        >
                            {
                                getFieldDecorator('vendo ',{
                                  initialValue : data ? data.vendo : ''
                                })(
                                  <Select size="large" style={{ width: '100%' }}>
                                      <Option value="请选择">请选择</Option>
                                      <Option value="坐北朝南">坐北朝南</Option>
                                      <Option value="坐南朝北">坐南朝北</Option>
                                      <Option value="坐东朝西">坐东朝西</Option>
                                      <Option value="坐西朝东">坐西朝东</Option>
                                  </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}} offset={6}>
                        <FormItem
                            label="建筑窗墙比(%)"
                        >
                            {
                              getFieldDecorator('manu ',{
                                initialValue : data ? data.manu : ''
                              })(
                                  <Input readOnly />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="客房面积"
                        >
                            {
                              getFieldDecorator('serialNum  ',{
                                initialValue : data ? data.serialNum  : ''
                              })(
                                    <Input  readOnly/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 6}} offset={12}>
                        <FormItem
                            label="建筑面积"
                        >
                            {
                                getFieldDecorator('vendor ',{
                                  initialValue : data ? data.vendor : ''
                                })(
                                  <Input readOnly />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="供冷面积"
                        >
                            {
                              getFieldDecorator('manu ',{
                                initialValue : data ? data.manu : ''
                              })(
                                  <Input readOnly />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 6}} offset={18}>
                        <FormItem
                            label="采暖面积"
                        >
                            {
                                getFieldDecorator('vendor ',{
                                  initialValue : data ? data.vendor : ''
                                })(
                                  <Input readOnly />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const BFormComponent = Form.create()(FrequencyComponent);
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
            id: localStorage.ipId,
            pageNum: 1,
            pageSize: 10,
        };
        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };

        //表格字段
        this.columns = [
            {
                title: '序号',
                dataIndex: 'code',
                key: 'code',
                sorter: true,
                render: defaultRender
            },
            {
                title: '内容描述',
                dataIndex: 'name',
                key: 'name',
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
                            <Icon
                                type="delete"
                            />
                        </div>
                    )
                }
            },
        ];
    }

    // 通知信息
    taskGetList = () => {
        const { actions } = this.props;
        this.setState({
            taskstepsLoading: true,
            materialsLoading: true
        });
        actions.newsGetList(this.taskParam, () => {
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
      const data = state.newsListData;
      const list = data.list;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewFormComponent state={state} data={list}/>
                        </Panel>
                        <Panel header={<span className="label">建筑信息 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            <BFormComponent  data={list}/>
                        </Panel>
                    </Collapse>
                </div>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.dashboard,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderOneComponent);
