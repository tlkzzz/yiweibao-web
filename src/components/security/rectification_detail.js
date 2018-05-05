/** 
 * @Description  安全整改单
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/equipment.js';
import SelectPerson from '../common/select_person';

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
        tableLoading: false,
        treeLoading: false,
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
                    <Col className="gutter-row" xs={{ span: 4}}>
                        <FormItem
                            label="*整改编码"
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
                            label="*整改类型"
                        >
                            {
                              getFieldDecorator('status',{
                                  initialValue: data ? data.status : ''
                                })(
                                  <Select size="large" style={{ width: '100%' }}>
                                      <Option value="立即整改">立即整改</Option>
                                      <Option value="限时整改">限时整改</Option>
                                      <Option value="不整改">不整改</Option>
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
                                      <Option value="执行中">执行中</Option>
                                      <Option value="待执行">待执行</Option>
                                      <Option value="关闭">关闭</Option>
                                  </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 4}}>
                        <FormItem
                            label="*检查单编码"
                        >
                            {
                                getFieldDecorator('startDat',{
                                    initialValue: data ? data.startDat : ''
                                })
                                (
                                    <Input suffix={<Icon type="plus" /> } />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 8}}>
                        <FormItem
                            label="检查单描述"
                        >
                            {
                              getFieldDecorator('locationCode', {
                                  initialValue: data.locationCode? data.locationCode : ''
                                })(
                                    <Input  />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="*整改时间"
                        >
                            {
                              getFieldDecorator('location', {
                                  initialValue: data.location? data.location : ''
                                })(
                                    <Input  />
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
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 12}}>
                        <FormItem
                            label="*整改措施"
                        >
                            {
                                getFieldDecorator('startDa',{
                                    initialValue: data ? data.startDa : ''
                                })
                                (
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="*检查位置"
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
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="创建人"
                        >
                            {
                              getFieldDecorator('locationCode', {
                                  initialValue: data.locationCode? data.locationCode : ''
                                })(
                                    <Input  />
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
                                getFieldDecorator('startDa',{
                                    initialValue: data ? data.startDa : ''
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
                                getFieldDecorator('startDat',{
                                    initialValue: data ? data.startDat : ''
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

//整改信息
class UFormComponent extends React.Component {
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
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="部门"
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
                            label="负责人"
                        >
                            {
                                getFieldDecorator('startDat',{
                                    initialValue: data ? data.startDat : ''
                                })
                                (
                                    <Input suffix={<Icon type="plus"  onClick={this.userAdd} /> } />
                                )
                            }
                          <SelectPerson
                              visible={this.state.selectPersonModalShow}
                              selectPersonModalHide={() => { this.setState({selectPersonModalShow: false}) }}
                          />
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="整改日期"
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
                            label="自查情况"
                        >
                            {
                              getFieldDecorator('location', {
                                  initialValue: data.location? data.location : ''
                                })(
                                    <Input  />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const UpdateFormComponent = Form.create()(UFormComponent);

//复查信息
class ReFormComponent extends React.Component {
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
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="复查人"
                        >
                            {
                                getFieldDecorator('startDat',{
                                    initialValue: data ? data.startDat : ''
                                })
                                (
                                    <Input suffix={<Icon type="plus"  onClick={this.userAdd} /> } />
                                )
                            }
                            <SelectPerson
                                visible={this.state.selectPersonModalShow}
                                selectPersonModalHide={() => { this.setState({selectPersonModalShow: false}) }}
                            />
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="复查日期"
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
                    <Col className="gutter-row" xs={{ span: 12}}>
                        <FormItem
                            label="复查情况"
                        >
                            {
                              getFieldDecorator('location', {
                                  initialValue: data.location? data.location : ''
                                })(
                                    <Input  />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const RFormComponent = Form.create()(ReFormComponent);

//上传图片
class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => this.setState({ fileList })

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="//jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

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
                    <Collapse bordered={false} defaultActiveKey={['1', '2' ,'3' , '4' ,'5' ]}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewFormComponent  data={list}/>
                            <div className="panel-tools-right">
                                <Button type="primary" size="large" >发送流程</Button>
                            </div>
                        </Panel>
                        <Panel header={<span className="label">整改信息<Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            <UpdateFormComponent  data={list}/>
                        </Panel>
                        <Panel header={<span className="label">复查信息<Icon type="caret-down" /></span>} key="3" style={this.customPanelStyle}>
                            <RFormComponent  data={list}/>
                        </Panel>
                        <Panel header={<span className="label">上传图片<Icon type="caret-down" /></span>} key="4" style={this.customPanelStyle}>
                            <PicturesWall />
                        </Panel>
                        <Panel header={<span className="label">执行记录<Icon type="caret-down" /></span>} key="5" style={this.customPanelStyle}>

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
