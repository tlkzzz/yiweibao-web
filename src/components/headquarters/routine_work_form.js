/** 
 * @Description 总部事务--例行工作详情页
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/headquarters.js';
import commonActions from '../../actions/common.js';
import Dropdown from '../../components/common/dropdown.js';
import moment from 'moment';
import { createForm } from 'rc-form';

import { Icon, Button, notification, Upload, Tabs,message, Modal,InputNumber, Checkbox, Timeline, Spin, Table, Pagination, Collapse, Tree, Form, Input, Row, Col, Select, DatePicker } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const TimeItem = Timeline.Item;
const Option = Select.Option;
const { TextArea } = Input;

class FormComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        currentPage: 1,
      }

    }
    componentDidUpdate() {

        const {state, actions} = this.props.props;
        if(state.getFormValues==true){
            actions.getFormValues(false);
            this.formDataSave();
        }
    }
    formDataSave = () => {
        const { actions,commonState,state} = this.props.props;
        const {formValueArr} = this.props;
        this.props.form.validateFields((err, values) => {

            if (err) {
                for (let attr in err) {
                    message.warning(err[attr].errors[0].message);
                    // notification.warning({
                    //     message: '警告',
                    //     description: err[attr].errors[0].message
                    // });
                }
            }

            if (!err) {
                formValueArr[0] =values;
              //  formValueArr.push(values);
                actions.getFormValues(formValueArr);
              //  state.getFormValues=formValueArr;
            }
        });
    }
    getDailyDetail = (data) => {
        const { actions } = this.props;
        if(data != ""){

            let param = {id:data};
            actions.getDailyDetail(param, (json) => {
            });
        }
    }
    componentWillMount () {
        const id = localStorage.getItem("workId")
        const { state, commonState,commonActions } = this.props.props;
        if(id!=""){
            this.getDailyDetail(id);
        }else{
            state.dailyDetail='';
            let  param = {
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                modelKey: "hq_jp"
            };
            commonActions.codeGenerator(param, () => {
                this.setState({tableLoading: false});
            });
        }
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'workType', 'WORKTYPE');//工作类型
        commonActions.getDomainValue(domainValueParam, 'checkItem', 'CHECKITEM');//检查项
        commonActions.getDomainValue(domainValueParam, 'timeFrequency', 'GET_TIME_FREAUENCY');//状态
        commonActions.getDomainValue(domainValueParam, 'HQWorkStatus', 'HQ_WORK_TYPE');//状态
        commonActions.getDomainValue(domainValueParam, 'HQPlanNature', 'HQ_PLAN_NATURE');//计划性质
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        const { state, commonState,workType,checkItem,timeFrequency } = this.props;
        const data = state.dailyDetail;
        const code = commonState.codeEntity ;
        const workTypes= workType==undefined?[]:workType;
        const checkItems= checkItem==undefined?[]:checkItem;
        const hqPlanNature= commonState.hqPlanNature==undefined?[]:commonState.hqPlanNature;
        const hqWorkType= commonState.hqWorkType==undefined?[]:commonState.hqWorkType;
        


        return (
          <Form layout="vertical">
              <Row gutter={16} justify="start">
                  {
                      getFieldDecorator('headquartersPlanId',{
                          initialValue: data ? data.headquartersPlanId :"",
                      })(
                          <Input type="hidden" />
                      )
                  }
                  {
                      getFieldDecorator('id',{
                          initialValue: data ? data.id :"",
                      })(
                          <Input type="hidden" />
                      )
                  }
                  <Col className="gutter-row" xs={{ span: 4}}>
                      <FormItem
                          label="例行工作编号"
                      >
                          {
                            getFieldDecorator('planNum',{
                               initialValue: data ? data.planNum : code,
                               rules: [{ required: true, message: '例行工作编号不能为空' }],
                              })(
                                  <Input  readOnly/>
                              )
                          }
                      </FormItem>
                  </Col>
                  <Col className="gutter-row" xs={{ span: 8}} >
                      <FormItem
                          label="名称"
                      >
                          {
                              getFieldDecorator('planName',{
                                 initialValue: data ? data.planName : '',
                                  rules: [
                                      { required: true, message: '请填写名称！'},
                                      { max: 200, message: '名称不能超过30字符长度！'}
                                  ]
                              })
                              (
                                  <Input />
                              )
                          }
                      </FormItem>
                  </Col>
                  <Col className="gutter-row" xs={{ span: 6}} >
                      <FormItem
                          label="计划性质"
                      >
                            {
                                getFieldDecorator('nature', {
                                initialValue: data ? data.nature : '',
                                rules: [{ required: true, message: '计划性质不能为空' }],
                                })(
                                    <Select size="large" style={{ width: '100%' }}>
                                        {
                                            hqPlanNature.map((item, i) => <Option key={i}  value={item.value}>{item.description}</Option>)
                                        }
                                    </Select>
                                )
                            }
                            {
                                getFieldDecorator('id',{
                                    initialValue: data ? data.id : ''
                                })(
                                    <Input type="hidden" />
                                )
                            }
                      </FormItem>
                  </Col>
                  <Col className="gutter-row" xs={{ span: 6}} >
                      <FormItem
                          label="状态"
                      >
                          {
                            getFieldDecorator('status', {
                                initialValue: data ? data.status : '',
                                rules: [{ required: true, message: '状态不能为空' }],
                              })(
                                <Select size="large" style={{ width: '100%' }}>
                                    {
                                        hqWorkType.map((item, i) => <Option key={i}  value={item.value}>{item.description}</Option>)
                                    }
                                </Select>
                              )
                          }
                      </FormItem>
                  </Col>
              </Row>
              <Row gutter={16} justify="start">
                  <Col className="gutter-row" xs={{ span: 4}}>
                      <FormItem
                          label="计划编号"
                      >
                          {
                            getFieldDecorator('headquartersPlanNum', {
                               initialValue: data? data.headquartersPlanNum : "",
                              })(
                                  <Input disabled  />
                              )
                          }
                      </FormItem>
                  </Col>
                  <Col className="gutter-row" xs={{ span: 8}}>
                      <FormItem
                          label="计划名称"
                      >
                          {
                            getFieldDecorator('planDescription', {
                               initialValue: data? data.planDescription : '',
                              })(
                                  <Input disabled  />
                              )
                          }
                      </FormItem>
                  </Col>
                  <Col className="gutter-row" xs={{ span: 6}}>
                      <FormItem
                          label="检查项"
                      >
                          {
                              getFieldDecorator('checkItem', {
                                initialValue: data? data.checkItem : '',
                                rules: [{ required: true, message: '检查项不能为空' }],
                                })(
                                    <Select  size="large" style={{width: '100%'}}  >
                                        {
                                            checkItems.map((item, i) => <Option key={i}  value={item.value}>{item.description}</Option>)
                                        }
                                    </Select>
                                )
                          }
                      </FormItem>
                  </Col>
                  <Col className="gutter-row" xs={{ span: 6}}>
                      <FormItem
                          label="完成期限(天)"
                      >
                          {
                            getFieldDecorator('deadline',{
                               initialValue: data ? data.deadline  : '',
                               rules: [
                                   { required: true, message: '完成期限不能为空' },
                                   { max: 3, message: '完成期限长度不能超过2个字符长度' },
                                   { pattern: /^\+?[1-9][0-9]*$/, message: '请输入合法的数字' },
                                   ],
                              })(
                                 <Input />
                              )
                          }
                      </FormItem>
                  </Col>
              </Row>
              <Row gutter={16} justify="start">
                  <Col className="gutter-row" xs={{ span: 6}}>
                      <FormItem
                          label="工作类型"
                      >
                          {
                              getFieldDecorator('workType',{
                               rules: [{ required: true, message: '工作类型不能为空' }],
                                initialValue: data ? data.workType  : '',
                              })(
                                <Select  size="large" style={{width: '100%'}}  >
                                    {
                                        workTypes.map((item, i) => <Option key={i}  value={item.value}>{item.description}</Option>)
                                    }
                                </Select>
                              )
                          }
                      </FormItem>
                  </Col>
                  <Col className="gutter-row" xs={{ span: 6}}>
                      <FormItem
                          label="有效开始日期"
                      >
                          {
                            getFieldDecorator('validStartDate',{
                               initialValue: data.validStartDate ? moment(data.validStartDate,"YYYY-MM-DD HH:mm:ss")  : '',
                               rules: [{ required: true, message: '有效开始日期不能为空' }],
                              })(
                                <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime placeholder="Select Time" />
                              )
                          }
                      </FormItem>
                  </Col>
                  <Col className="gutter-row" offset={18}>
                      <FormItem
                          label="有效结束日期"
                      >
                          {
                            getFieldDecorator('validEndDate',{
                               initialValue: data.validEndDate ? moment(data.validEndDate,"YYYY-MM-DD HH:mm:ss")  : '',
                               rules: [{ required: true, message: '有效结束日期不能为空' }],
                              })(
                                <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime placeholder="Select Time"/>
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
//const NewFormComponent = connect(mapStateToProps, buildActionDispatcher)(createForm()(FormComponent))

class PLFormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
        }
    }

    componentDidUpdate() {

        const {state, actions} = this.props.props;
        if(state.getFormValues==true){
            actions.getFormValues(false);
            this.formDataSave();
        }

        // const {form, formValueArr,state} = this.props;
        // if (!state.getFormValues) {
        //     formValueArr[0] = form.getFieldsValue();
        // }
    }
    formDataSave = () => {
        const { actions,commonState,state} = this.props.props;
        const {formValueArr} = this.props;

        this.props.form.validateFields((err, values) => {
            if (err) {
                for (let attr in err) {
                    message.warning(err[attr].errors[0].message);
                    // notification.warning({
                    //     message: '警告',
                    //     description: err[attr].errors[0].message
                    // });
                }
            }
            if (!err) {
                formValueArr[1]=values;
                actions.getFormValues(formValueArr);
            }
        });
    }
    componentWillMount () {
        const id = localStorage.getItem("workId")
        const { state, commonState,commonActions } = this.props.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'timeFrequency', 'GET_TIME_FREAUENCY');//频率单位
    }

    // componentDidUpdate() {
    //     const {form, formValueArr,state,actions} = this.props;
    //     if (!state.getFormValues) {
    //         formValueArr[1] = form.getFieldsValue();
    //         actions.getFormValues(formValueArr);
    //         //  if (__DEV__) console.log("getFormValues",state.getFormValues);
    //         //  if (__DEV__) console.log("formValueArr", formValueArr);
    //         // this.formDataSave();
    //     }
    // }
    render () {
        const { getFieldDecorator } = this.props.form;
        const { state, commonState } = this.props;
        const data = state.dailyDetail;
        const timeFrequency= commonState.timeFrequency;

        return (
          <Form layout="vertical">
              <Row gutter={16} justify="start">
                  <Col className="gutter-row" xs={{ span: 6}}>
                      <FormItem
                          label="下一生成日期"
                      >
                          {
                            getFieldDecorator('startDate',{
                               initialValue: data.startDate ? moment(data.startDate,"YYYY-MM-DD HH:mm:ss") : '',
                               rules: [{ required: true, message: '下一生成日期不能为空' }],
                              })(
                                <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime placeholder="Select Time"/>
                              )
                          }
                      </FormItem>
                  </Col>
                  <Col className="gutter-row" xs={{ span: 6}} offset={6} >
                      <FormItem
                          label="频率"
                      >
                          {
                              getFieldDecorator('times',{
                                 initialValue: data ? data.times : '',
                                 rules: [
                                     { required: true, message: '频率不能为空' },
                                     { max: 3, message: '频率长度不能超过2个字符长度' },
                                     { pattern: /^\+?[1-9][0-9]*$/, message: '请输入合法的数字' },
                                     ],
                              })
                              (
                                  <Input />
                              )
                          }
                      </FormItem>
                  </Col>
                  <Col className="gutter-row" xs={{ span: 6}} >
                      <FormItem
                          label="频率单位"
                      >
                          {
                            getFieldDecorator('frequency', {
                               initialValue: data ? data.frequency : '',
                               rules: [{ required: true, message: '频率单位不能为空' }],
                              })(
                                <Select size="large" style={{ width: '100%' }}>
                                    {
                               timeFrequency.map((item, i) => <Option key={i}  value={item.value}>{item.description}</Option>)
                                    }
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
//const PFormComponent = connect(mapStateToProps, buildActionDispatcher)(createForm()(PLFormComponent))
const PFormComponent = Form.create()(PLFormComponent)

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
          //通过url获取id
            id: location.search.substr(4),
            pageNum: 1,
            pageSize: 10,
        };
    }
    getDailyTaskInfo = () => {

        const {actions,commonActions,state,commonState} = this.props;

        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'workType', 'WORKTYPE');//工作类型
        commonActions.getDomainValue(domainValueParam, 'checkItem', 'CHECKITEM');//检查项
        commonActions.getDomainValue(domainValueParam, 'taskProperty', 'TASKPROPERTY');//任务属性

    }
    componentWillMount () {
     this.getDailyTaskInfo();
    }

    
    render () {
      const { state,actions,commonState } = this.props;
      const formValueArr =[];
      const data = state.dailyDetail;
        //工作类型
        const workType=commonState.workType;
        //检查项
        const checkItem= commonState.checkItem;

      
        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2']}>
                        <Panel header={<span className="label">计划信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewFormComponent props={this.props} workType={workType}  checkItem={checkItem} actions={actions} state={state}
                                              commonActions={commonActions}
                                              commonState={commonState} entity={data} formValueArr={formValueArr}/>
                        </Panel>
                        <Panel header={<span className="label">频率信息 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            <PFormComponent  props={this.props} actions={actions} state={state}
                                              commonActions={commonActions}
                                              commonState={commonState} entity={data} formValueArr={formValueArr}/>
                        </Panel>
                    </Collapse>
                </div>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.headquarters,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderOneComponent);
