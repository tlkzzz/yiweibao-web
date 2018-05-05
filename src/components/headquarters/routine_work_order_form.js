/** 
 * @Description 事务--工作单
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/headquarters.js';
import commonActions from '../../actions/common.js';
import Upload from '../../components/common/upload.js';
import { correspondenceJson, filterArrByAttr,msFormat } from '../../tools/';
import SelectPerson from '../../components/common/select_person.js';
import { browserHistory } from 'react-router';
import { createForm } from 'rc-form';

import Dropdown from '../../components/common/dropdown.js';
import moment from 'moment';

import { Icon, Button,message, Tabs, Modal,  notification,Checkbox, Timeline, Spin, Table, Pagination, Collapse, Tree, Form, Input, Row, Col, Select, DatePicker } from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const TimeItem = Timeline.Item;
const Option = Select.Option;
const { TextArea } = Input;

class FormComponent extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          selectPersonModalShow: false,
          currentPage: 1,
          visibleProcess: false,
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
        const { actions,commonState} = this.props.props;

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
                for (let attr in values) {
                    if (values[attr] === null||values[attr]=="") delete values[attr];
                }

                values.estimateDate = moment(values.estimateDate).format('YYYY-MM-DD HH:mm:ss');
                    //moment(values.estimateDate, 'YYYY-MM-DD HH:mm')

               // delete values.estimateDate;
                //moment(values.estimateDate).format('YYYY-MM-DD HH:mm:ss');

                    let param = {
                    ...values,
                    orgId: commonState.orgId,
                    siteId: commonState.siteId,
                }
                actions.saveDailyTask(param, (msg) => {
                    if (msg.success) {
                        //更新数据
                        message.success("保存成功");
                        //
                        param = {id: msg.data.id};

                        actions.getDailyTaskDetail(param, (json) => {
                            if(json!=null&&json.data.workType!=null){
                                let  param = {
                                    orgId: commonState.orgId,
                                    siteId: commonState.siteId,
                                    domainValue: json.data.workType,
                                    domainNum: "workType"
                                };
                                commonActions.getUserBydomainValue(param);
                            }


                        });
                        localStorage.setItem('dailyTaskId', msg.data.id );
                        localStorage.setItem('dailyTaskWork_edit_flag', false);
                    } else {
                        message.error(msg.msg);
                    }
                });
            }
        });
    }

    getStatus=(text)=>{
        const {actions, commonState,commonActions} = this.props.props;
        let status=commonState.dailyTaskState;

        if(status==null||status==undefined){
            const domainValueParam = {
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                prodId: 'EAM'
            }
            commonActions.getDomainValue(domainValueParam, 'headquartersDaliyTask', 'DAILY_TASK_STATUS');//状态
        }
        for (let attr in status) {
            if(status[attr].value==text){
                return status[attr].description;
            }
        }
    }
    workTypesSelect=(value,option)=>{
        const {actions, commonState,commonActions} = this.props.props;
        let  param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            domainValue: value,
            domainNum: "workType",
            associationType:"ALL"
        };
        commonActions.getUserBydomainValue(param,(json)=>{
            console.info(json);
        });
    }

    //验收人选择弹框渲染
    taskStepsClose = () => {
        this.userAddModal.modalHide();
    }
    //验收人选择赋值
    selectCheckPerson = (id,name) => {
        //给人员赋值

        const {form} = this.props;
        form.setFieldsValue({'executor': id, 'executorName': name});
        this.userAddModal.modalHide()

    }
    //验收人选择框
    personInputFocus = (selected) => {
        //  this.userAddModal.modalShow();

        let selectedPerson = {};
        switch (this.state.currentInp) {
            case 'executorName': {
                selectedPerson = {
                    executor: filterArrByAttr(selected, 'personId'),
                    executorName: filterArrByAttr(selected, 'name')
                };
            } break;
        }
        this.props.form.setFieldsValue(selectedPerson);
    }


    render () {
        const { getFieldDecorator } = this.props.form;
        let { location,persondata,workType,checkItem,taskProperty,codeEntity } = this.props;
       let{state,commonState,commonActions} =this.props.props
        //人员数据
        const  personList=persondata==undefined?[]:persondata;
        //任务编码
        const workTypes= workType==undefined?[]:workType;
        const checkItems= checkItem==undefined?[]:checkItem;
        const taskPropertys= taskProperty==undefined?[]:taskProperty;
        let data=state.dailyTaskInfo;
        let  dtb=false;
        let  dfp=false;
        let  dhb=false;
        if(data!=null&&data.status!="DTB"){
            dtb=true;
        }else{
            dtb=false;
        }
        if(data==null||data.status!="DFP"){
            dfp=true
        }else{
            dfp=false;
        }
        if(data==null||data.status!="DHB"){
            dhb=true
        }else{
            dhb=false;
        }
        if(data!=null){

            let status=this.getStatus(data.status);
            if(status!=undefined&&status!=null){
                data.statusDescription=status;
            }
        }
        let processOptionExplain=[];
      if(data!=null&&data.status=="DTB"){
         // this.workTypesSelect(data.workType);
          // let param={
          //     domainValue:data.workType,
          //     domainNum:"workType",
          //     orgId:commonState.orgId,
          //     siteId:commonState.siteId,
          //     associationType:"ALL"
          // }
          // commonActions.getUserBydomainValue(param,null,(json)=>{
          //     let p=filterArrByAttr(json.data, 'name').join(',')
          //     processOptionExplain[0]=p;
          // })
          processOptionExplain[0]=filterArrByAttr(commonState.getPersonByDomain, 'name').join(',');
          state.processOptionExplain=processOptionExplain;
      }else if(data!=null&&data.status=="DFP"){
          processOptionExplain[0]=data.executorName;
          processOptionExplain[1]=data.reportPersonName;
          state.processOptionExplain=processOptionExplain;
      }else if(data!=null&&data.status=="DJD"){
          processOptionExplain[0]=commonState.personName;
          processOptionExplain[1]=data.dispatchPersonName;
          state.processOptionExplain=processOptionExplain;
      }else if(data!=null&&data.status=="DHB"){
          processOptionExplain[0]=data.dispatchPersonName;
          processOptionExplain[1]=data.dispatchPersonName;
          state.processOptionExplain=processOptionExplain;
      }else if(data!=null&&data.status=="DYS"){
          processOptionExplain[0]=data.receiverPersonName;
          processOptionExplain[1]=data.receiverPersonName;
          state.processOptionExplain=processOptionExplain;
      }
        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 4}}>
                        {
                            getFieldDecorator('id',{
                                initialValue: data ? data.id :"",
                            })(
                                <Input type="hidden" />
                            )
                        }
                        {
                            getFieldDecorator('executor',{
                                initialValue: data ? data.executor :"",
                            })(
                                <Input type="hidden"  />
                            )
                        }
                        {
                            getFieldDecorator('planId',{
                                initialValue: data ? data.planId :"",
                            })(
                                <Input type="hidden" />
                            )
                        }
                        {
                            getFieldDecorator('status',{
                                initialValue: data ? data.status :"",
                            })(
                                <Input type="hidden" />
                            )
                        }
                        <FormItem
                            label="任务编号"
                        >
                            {
                                getFieldDecorator('taskNum',{
                                    initialValue: data ? data.taskNum : codeEntity,
                                    rules: [{ required: true, message: '任务编号不能为空' }],
                                })(
                                    <Input  disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 8}} >
                        <FormItem
                            label="任务名称"
                        >
                            {
                                getFieldDecorator('taskName',{
                                    initialValue: data ? data.taskName : '',
                                    rules: [
                                        { required: true, message: '任务名称不能为空' },
                                        { max: 36, message: '任务名称长度应小于36字符长度' }
                                        ],
                                })
                                (
                                    <Input disabled={dtb} />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}} >
                        <FormItem
                            label="任务属性"
                        >
                            {
                                getFieldDecorator('taskProperty', {
                                    initialValue: data ? data.taskProperty : '',
                                    rules: [{ required: true, message: '任务属性不能为空' }],
                                })(
                                    <Select  disabled={dtb}  size="large" style={{width: '100%'}}  >
                                        {
                                            taskPropertys.map((item, i) => <Option key={i}  value={item.value}>{item.description}</Option>)
                                        }
                                    </Select>
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}} >
                        <FormItem
                            label="状态"
                        >
                            {
                                getFieldDecorator('statusDescription', {
                                    initialValue: data ? data.statusDescription: '待提报',
                                })(
                                    <Input disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 12}}>
                        <FormItem
                            label="英文描述"
                        >
                            {
                                getFieldDecorator('description', {
                                    initialValue: data? data.description : '',
                                    rules: [
                                        { max: 500, message: '英文描述长度应小于500字符长度' },
                                        ],
                                })(
                                    <Input  disabled={dtb} />
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
                                    <Select disabled={dtb}  size="large" style={{width: '100%'}}  >
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
                            label="创建时间"
                        >
                            {
                                getFieldDecorator('createDate',{
                                    initialValue: data ? data.createDate  : '',
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
                            label="例行工作编号"
                        >
                            {
                                getFieldDecorator('planNum', {
                                    initialValue: data? data.planNum:"",
                                })(
                                    <Input  disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 8}}>
                        <FormItem
                            label="名称"
                        >
                            {
                                getFieldDecorator('planName', {
                                    initialValue: data? data.planName: '',
                                })(
                                    <Input disabled />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="工作类型"
                        >
                            {
                                getFieldDecorator('workType', {
                                    initialValue: data? data.workType: '',
                                    rules: [{ required: true, message: '工作类型不能为空' }],
                                })(
                                    <Select onSelect={this.workTypesSelect} disabled={dtb}  size="large" style={{width: '100%'}}  >
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
                            label="计划完成时间"
                        >
                            {
                                getFieldDecorator('estimateDate',{
                                    initialValue: data ? moment(data.estimateDate, 'YYYY-MM-DD HH:mm'):"",
                                    rules: [{ required: true, message: '计划完成时间不能为空' }],
                                })(
                                    <DatePicker
                                        disabled={dtb}
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder="请计划完成时间"
                                        onChange={(onChange) => { }}
                                        onOk={(onOk) => { }}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{ span: 12}}>
                        <FormItem
                            label="执行总结"
                        >
                            {
                                getFieldDecorator('summary',{
                                    initialValue: data ? data.summary: '',
                                    rules: [
                                        { max: 500, message: '执行总结长度应小于500字符长度' }
                                        ],
                                })(
                                    <TextArea disabled={dhb} />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="执行负责人"
                        >
                            {
                                getFieldDecorator('executorName',{
                                    initialValue: data ? data.executorName: '',
                                })(
                                    dfp? <Input  disabled />:<Input placeholder="请选择验收人" readonly suffix={<Icon type="plus" onClick={() => {
                                            this.setState({
                                                selectPersonModalShow: true,
                                                currentInp: 'executorName'
                                            });
                                    }} /> }/>
                                )
                            }
                        </FormItem>
                        <SelectPerson
                            multiple
                            visible={this.state.selectPersonModalShow}
                            selectPersonModalHide={() => { this.setState({ selectPersonModalShow: false }) }}
                            onOk={this.personInputFocus.bind(this)}
                        />
                    </Col>
                    <Col className="gutter-row" xs={{ span: 6}}>
                        <FormItem
                            label="实际完成时间"
                        >
                            {
                                getFieldDecorator('actualDate',{
                                    initialValue: data ? data.actualDate: '',
                                })(
                                    <Input  disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const NewFormComponent = Form.create({onValuesChange: (props, values) => {
    for (let attr in values) {
        if (values[attr] instanceof moment) {
            values[attr] = moment(values[attr]).format('YYYY-MM-DD HH:mm:ss');
        }
    }
    //标记表单数据已更新
    localStorage.setItem('dailyTaskWork_edit_flag', true);
    let tmp = Object.assign({}, JSON.parse(localStorage.getItem('dailyTaskWork_edit')), values);
    localStorage.setItem('dailyTaskWork_edit', JSON.stringify(tmp));

}})(FormComponent)
// const NewFormComponent = connect(mapStateToProps, buildActionDispatcher)(createForm()(FormComponent));

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

        this.param = {
            pageSize: 10,
            pageNum: 0
        }
        this.props.router.setRouteLeaveHook(
            this.props.route,
            this.routerWillLeave.bind(this)
        );
        this.onBeforeUnload = (event) => {
            const isEdited = JSON.parse(localStorage.getItem('defectOrder_edit_flag'));
            if (isEdited) {
                let confirmationMessage = '当前页面已修改，是否确认离开？';
                (event || window.event).returnValue = confirmationMessage; // Gecko and Trident
                return confirmationMessage; // Gecko and WebKit
            }
            return "\o/";
        };

        //注册刷新事件，当页面刷新时，缓存页面数据
        window.addEventListener('beforeunload', this.onBeforeUnload);
  }
    getDailyTaskInfo = (id) => {

        const {actions,commonActions,state,commonState} = this.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
            let  param = {id: id};
        if(id !=null&&id!="null"){
            actions.updateDailyTaskAddState(false);
            actions.getDailyTaskDetail(param, (json) => {

                if(json!=null&&json.data.processInstanceId!=null){
                    this.getExecutionRecord(json.data.processInstanceId);//开始查询执行记录
                }else{
                    commonState.processExecutionRecord=[];
                }
                if(json!=null&&json.data.workType){
                    let  param = {
                        orgId: commonState.orgId,
                        siteId: commonState.siteId,
                        domainValue: json.data.workType,
                        domainNum: "workType",
                        associationType:"ALL"
                    };
                    commonActions.getUserBydomainValue(param,(json)=>{
                        console.info(json);
                    });



                }
            });
        }else{
            state.dailyTaskInfo=null;//值清空
            let  param = {
                orgId: commonState.orgId,
                siteId: commonState.siteId,
                prodId: 'EAM',
                modelKey: "headquartersDaliyTask"
            };
            commonActions.codeGenerator(param,(json)=>{
                let patam={
                    taskNum:json.data,
                    status:'DTB'
                }
                let tmp = Object.assign({}, JSON.parse(localStorage.getItem('dailyTaskWork_edit')), patam);
                localStorage.setItem('dailyTaskWork_edit', JSON.stringify(tmp));
            });
            commonState.processExecutionRecord=[];
            actions.updateDailyTaskAddState(true);
        }

    }
    //获取执行记录
    getExecutionRecord=(processInstanceId)=>{
        let  param = { processInstanceId: processInstanceId}
        const {actions,commonActions} = this.props;
        commonActions.getProcessExecutionRecord(param, (json) => {

        });
    }
    //人员数据加载
    getList = () => {
        const {commonActions,commonState} = this.props;
        this.setState({tableLoading: true});
        this.param={
            ...this.param,
            orgIds: [commonState.orgId],
            siteIds: [commonState.siteId],
            productIds: commonState.productArray,
        }
        commonActions.personGetList(this.param, () => {
            this.setState({tableLoading: false});
        });
    }
    componentWillMount () {
        const {actions,commonActions,state,commonState} = this.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        commonActions.getDomainValue(domainValueParam, 'workType', 'WORKTYPE');//工作类型
        commonActions.getDomainValue(domainValueParam, 'checkItem', 'CHECKITEM');//检查项
        commonActions.getDomainValue(domainValueParam, 'taskProperty', 'TASKPROPERTY');//任务属性

        let id =localStorage.getItem('dailyTaskId');
        let dailyTaskWork_edit=localStorage.getItem('dailyTaskWork_edit')?JSON.parse(localStorage.getItem('dailyTaskWork_edit')):false;
        if(state.defectIsAdd&&!dailyTaskWork_edit){//增加
            this.getDailyTaskInfo(id);
        }else{
            if(dailyTaskWork_edit){
                actions.updateDailyTaskInfo(dailyTaskWork_edit);
            }else{
                this.getDailyTaskInfo(id);
            }
        }
    }

    routerWillLeave(nextLocation)   {
        const { location } = this.props;
        if (!nextLocation.pathname.startsWith(location.pathname.substring(0, location.pathname.length - 1))) {
            //切换其它页面
            const isEdited = JSON.parse(localStorage.getItem('dailyTaskWork_edit_flag'));
            if (isEdited) {
                const confirm = Modal.confirm;
                confirm({
                    title: '提示',
                    content: '当前页面已修改，是否确认离开？',
                    onOk() {
                        localStorage.removeItem('dailyTaskId');
                        localStorage.removeItem('dailyTaskWork');
                        localStorage.removeItem('dailyTaskWork_edit_flag');
                        localStorage.removeItem('dailyTaskWork_edit');
                        browserHistory.push(nextLocation.pathname);

                    }
                });
                return false;
            } else {
                localStorage.removeItem('dailyTaskId');
                localStorage.removeItem('dailyTaskWork');
                localStorage.removeItem('dailyTaskWork_edit_flag');
                localStorage.removeItem('dailyTaskWork_edit');
            }
        }
    }
    render () {
        const { state, commonState,commonActions} = this.props;
        const data=commonState.processExecutionRecord;
        const recordList = data.executionRecord || [];
        // 执行记录日期
        const recordDateArr = data.dateArr;
       // const persondata = commonState.getPersonByDomain;
        const persondata = commonState.personListData
        const deilyTaskInfoData = state.dailyTaskInfo;
        //工作类型
        const workType=commonState.workType;
        //检查项
        const checkItem= commonState.checkItem;
        //任务属性
        const taskProperty= commonState.taskProperty;
        const code = commonState.codeEntity;
        const routine=deilyTaskInfoData?deilyTaskInfoData.id:false;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                            <NewFormComponent props={this.props}  codeEntity={code}  workType={workType} checkItem={checkItem} taskProperty={taskProperty} data={deilyTaskInfoData} persondata={persondata} />
                        </Panel>
                        <Panel header={<span className="label">文件 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                            {
                                routine?
                                <Upload
                                    hideButton={routine}
                                    quoteId={routine}
                                    fileType="PDF"
                                    quoteType="PDF"
                                    commonActions={commonActions}
                                    commonState={commonState}
                                />:"请保存工单信息"
                            }
                        </Panel>
                        <Panel header={<span className="label">日志 <Icon type="caret-down" /></span>} key="3" style={this.customPanelStyle}>
                            <Timeline>
                                {
                                    recordList.map((item, i) => {

                                        let time = item.endTime ? item.endTime.split(' ')[1] : '';

                                        let iconType;
                                        if (i === 0) {
                                            iconType = item.endTime ? 'minus-circle-o': 'clock-circle-o';
                                        } else {
                                            iconType = item.processType === 'reject' ? 'exclamation-circle-o' : 'check-circle-o';
                                        }

                                        return (
                                            <Timeline.Item
                                                key={i}
                                                dot={
                                                    <div>
                                                        <div className={recordDateArr[i] ? 'date' : ''}>{recordDateArr[i] ? recordDateArr[i] : ''} {recordDateArr[i] ? <i></i> : ''}</div>
                                                        <div>
                                                            <Icon className={item.processType === 'reject' ? 'red pull-right' : 'pull-right'} type={iconType} style={{ fontSize: '16px' }} />
                                                            <span className="pull-right time">{time.slice(0,5)}</span>
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <h2>
                                                    <span className={item.processType === 'reject' ? 'red name' : 'name'}>{item.name}</span>
                                                    <span>持续时间：{item.durationInMillis ? `${msFormat(item.durationInMillis, 'h')}小时${msFormat(item.durationInMillis, 'm')}分钟` : '-'}</span>
                                                    &nbsp;&nbsp;
                                                    <span>责任人：{item.personName}</span>
                                                </h2>
                                                <p>{item.description}</p>
                                            </Timeline.Item>
                                        )
                                    })
                                }
                            </Timeline>
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
