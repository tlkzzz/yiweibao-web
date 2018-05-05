/**  
 * @Description: 缺陷管理-（基本信息，图片上传、执行记录）
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import actions from '../../actions/defect_document.js';
import EamModal from '../../components/common/modal.js';
import commonActions from '../../actions/common.js';
import {correspondenceJson, filterArrByAttr,msFormat} from '../../tools/';
import { browserHistory } from 'react-router';
import Upload from '../../components/common/upload.js';
import Selectarchives from '../../components/common/select_archives.js';
import moment from 'moment';

import {
    Icon,
    Button,
    Table,
    Pagination,
    Collapse,
    InputNumber,
    Form,
    Input,
    Row,
    Col,
    Select,
    Radio,
    DatePicker,
    Timeline,
    Modal,
    notification,
    message,
} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectarchivesModalShow: false,
            currentPage: 1,
            visibleProcess: false,
        }
        this.param = {
            pageSize: 10,
            pageNum: 0
        }
        let defaultRender = (text, record, key) => {
            return (
                <p>{text ? text : '-'}</p>
            )
        };
        this.currentInp = '';
        // // 后端返回英文显示中文的对应数据
        this.defectOrderJson  = correspondenceJson.defectOrder;
    }

    getDefectInfo = (id) => {
        const param = {id: id};
        const {actions,commonState,commonActions} = this.props.props;

        if(id!=null&&id!="null"){
            actions.getdefectInfoById(param, (json) => {
                localStorage.setItem('defectOrder_edit', JSON.stringify(json));

                let  param = {
                    orgId: commonState.orgId,
                    siteId: commonState.siteId,
                    productArray: commonState.productArray,
                    // pageNum:0,
                    // pageSize:100000,//后台接口为分页接口，下拉框数据需要获取全部数据
                    parentId:null
                }

                this.getLocationListPage(json.buildingNum,"FLOORS");
                this.getLocationListPage(json.region,"BUILDI_NGNUMBER")
                // commonActions.locationsGetTreeList(param,false, "FLOORS")
                // param.parentId=json.region;
                // commonActions.locationsGetTreeList(param,false, "BUILDI_NGNUMBER")
               // delete  param.parentId;
              //  commonActions.locationsGetTreeList(param,true,"REGION")

                if (json.processInstanceId != null) {
                    this.getExecutionRecord(json.processInstanceId);//开始查询执行记录
                }
                if(json!=null&&json.projectType){
                    let  param = {
                        orgId: commonState.orgId,
                        siteId: commonState.siteId,
                        domainValue: json.projectType,
                        domainNum: "woProjectType",
                        associationType:"ALL"
                    };
                    commonActions.getUserBydomainValue(param,(json)=>{

                    });
                }
            });
        }else{
                let param = {
                    orgId: commonState.orgId,
                    siteId: commonState.siteId,
                    prodId: 'EAM',
                    modelKey: "defectDocument"
                };
                commonActions.codeGenerator(param,(json)=>{
                    let patam={
                        defectDocumentNum:json.data,
                        status:'DDTB'
                    }
                    let tmp = Object.assign({}, JSON.parse(localStorage.getItem('defectOrder_edit')), patam);
                    localStorage.setItem('defectOrder_edit', JSON.stringify(tmp));
                    actions.getAddState(true);
                  //  this.setState({tableLoading: false});
                });
            commonActions.updateProcessExecutionRecord(null);
        }
    }
    //获取执行记录
    getExecutionRecord = (processInstanceId) => {
        let param = {processInstanceId: processInstanceId}
        const {actions, commonActions} = this.props.props;
        commonActions.getProcessExecutionRecord(param, (json) => {

        });
    }
    // //获取楼号
    // getBuildingNumber = (value, option) => {
    //     this.getLocationsGetTreeList(value, "REGION")
    // }
    // //获取楼层
    // getFloors = (value, option) => {
    //     this.getLocationsGetTreeList(value, "BUILDI_NGNUMBER")
    // }

    getLocationListPage=(id,type)=>{
        const {actions, commonActions, state, commonState} =  this.props.props;
        let  param = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            productArray: commonState.productArray,
            //pageNum:0,
           // pageSize:100000,//后台接口为分页接口，下拉框数据需要获取全部数据
            parentId:id
        }

        switch(type) {
            case "Initialization"://初始化获取楼宇信息
               delete param.parentId;
                commonActions.locationsGetTreeList(param, "REGION",true,(json)=>{
                    // console.info(json);
                    // if(json){
                    //     commonState.region=json[0].children
                    // }
                });
                break;
            case "BUILDI_NGNUMBER"://楼号数据
                commonActions.locationsGetTreeList(param, "BUILDI_NGNUMBER",false,(json)=>{
                });
                // commonActions.locationsGetfindPage(param, "BUILDI_NGNUMBER",(json)=>{
                // });
                break;
            case "FLOORS"://楼层数据
                commonActions.locationsGetTreeList(param,"FLOORS",false,(json)=>{
                });
                // commonActions.locationsGetfindPage(param, "FLOORS",(json)=>{
                // });
                break;
        }
    }


    selectLocation=(id,type)=>{
        const {actions, commonActions, state, commonState} =  this.props.props;
        switch(type)
        {
            case "BUILDI_NGNUMBER"://获取楼号
                const region = commonState.region  //区域
                for (let att in region){
                    if(region[att].id==id){
                        commonState.buildingNumber=region[att].children
                    }
                }
                break;
            case "FLOORS"://获取楼层
                const buildingNumber = commonState.buildingNumber //楼号
                for (let att in buildingNumber){
                    if(buildingNumber[att].id==id){
                        commonState.floors=buildingNumber[att].children
                    }
                }
                break;

        }








    }

    //详细获取地理位置
    // getLocationsGetTreeListByDetailed=(id,type)=>{
    //   let  param = {
    //       orgId: commonState.orgId,
    //       siteId: commonState.siteId,
    //       productArray: commonState.productArray,
    //       parentId:id
    //     }
    //     commonActions.locationsGetTreeList(param, type);
    // }
    //获取地址位置信息--如获取的是树结构可以用此方法，注意后台接口返回值
    // getLocationsGetTreeList = (id, type) => {
    //     const {actions, commonActions, state, commonState} =  this.props.props;
    //     let param = {
    //         orgId: commonState.orgId,
    //         siteId: commonState.siteId,
    //         productArray: commonState.productArray,
    //     };
    //     switch(type) {
    //     case "Initialization"://初始化获取楼宇信息
    //         param = {
    //             ...param,
    //             //   fatherId: id
    //         }
    //         commonActions.locationsGetTreeList(param, "REGION");
    //         break;
    //         case "REGION"://区域
    //             const region = commonState.region  //区域
    //             for (let att in region){
    //                 if(region[att].id==id){
    //                     commonState.buildingNumber=region[att].children
    //                 }
    //             }
    //             break;
    //         case "BUILDI_NGNUMBER"://楼号
    //             const buildingNumber = commonState.buildingNumber //楼号
    //             for (let att in buildingNumber){
    //                 if(buildingNumber[att].id==id){
    //                     commonState.floors=buildingNumber[att].children
    //                 }
    //             }
    //             break;
    //         // case "FLOORS"://楼层
    //         //
    //         //     break;
    //     }
    // }
    //获取各个域值以及code
    getDomain = () => {

        const {actions, commonActions, state, commonState} =  this.props.props;
        const domainValueParam = {
            orgId: commonState.orgId,
            siteId: commonState.siteId,
            prodId: 'EAM'
        }
        const responsibility = commonState.responsibility//责任属性
        const importance = commonState.importance //重要程度
        const standard = commonState.standard //标准依据
        const workProjectTypeData = commonState.workProjectTypeData//工程类型
       // const defectDocumentStatus = commonState.defectDocumentStatus//缺陷单状态

        if (responsibility == null || !responsibility.length) {
            commonActions.getDomainValue(domainValueParam, 'responsibility', 'RESPONSIBILITY');//责任属性
        }
        if (importance == null || !importance.length) {
            commonActions.getDomainValue(domainValueParam, 'importance', 'IMPORTANCE');//重要程度
        }
        if (standard == null || !standard.length) {
            commonActions.getDomainValue(domainValueParam, 'standard', 'STANDARD');//标准依据
        }
        if (workProjectTypeData == null || !workProjectTypeData.length) {
            commonActions.getDomainValue(domainValueParam, 'woProjectType', 'WORK_PROJECT_TYPE');//工程类型
        }

        // if (defectDocumentStatus == null || !defectDocumentStatus.length) {
        //     commonActions.getDomainValue(domainValueParam, 'defectDocumentStatus', 'DEFECT_DOCUMENT_STATUS');//状态
        // }



        this.getLocationListPage(null, "Initialization");//初始化价值楼宇信息
    }
    componentDidUpdate() {
        const {state, actions} = this.props.props;
        if(state.getFormValues==true){
            actions.getFormValues(false);
            this.formDataSave();
        }
    }
    componentWillMount() {
        const {state, actions} = this.props.props;
         let id = localStorage.getItem('defectId');

        this.getDomain();
        let defectOrder_edit=localStorage.getItem('defectOrder_edit')?JSON.parse(localStorage.getItem('defectOrder_edit')):false;
        if(state.defectIsAdd&&!defectOrder_edit){//增加
            this.getDefectInfo(id);
        }else{
            if(defectOrder_edit){
                actions.updateDefectWorkOrder(defectOrder_edit);
            }else{
                this.getDefectInfo(id);
            }
        }
    }
    //选择框
    archivesInputFocus = (selected) => {
        let  selectedData = {
            archivesId: selected.id,
            archivesNum: selected.archivesNum

        }
        this.props.form.setFieldsValue(selectedData);
    }
//保存
    formDataSave = () => {
        const {actions, commonState, state} = this.props.props;
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
                values = {
                    ...values
                }
                for (let attr in values) {
                    if (values[attr] === null || values[attr] == "") delete values[attr];
                }
                values.findDate = moment(values.findDate).format('YYYY-MM-DD HH:mm:ss');
                if(values.reportDate){
                    values.reportDate = moment(values.reportDate).format('YYYY-MM-DD HH:mm:ss');
                }
                actions.saveDefect(values, (msg) => {
                    if (msg.success) {
                        //更新数据
                        message.success("保存成功");
                        localStorage.setItem('defectOrder_edit_flag', false);
                      //  localStorage.setItem('defectOrder_edit', JSON.stringify(msg.data));
                        //let param = {id: msg.data.id};
                        this.getDefectInfo(msg.data.id)
                        // actions.getdefectInfoById(param, (json) => {
                        // });
                        localStorage.setItem('defectId', msg.data.id);
                    } else {
                        message.error(msg.msg);
                    }
                });
            }
        });
    }

    componentDidUpdate() {
        const {state, actions} = this.props.props;
        if (state.getFormValues) {
            actions.getFormValues(false);
            this.formDataSave();
        }

    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const {state, commonState,action} = this.props.props;
        const data = state.defectInfo;
        //true:不可以修改  false:可以修改
        let ismodify = false;
        // if (data != null && data.workOrderStatus != null) {
        //     if (data.workOrderStatus != "DHB") {
        //         ismodify = true;
        //     }
        //
        // }
        const responsibility = commonState.responsibility//责任属性
        const importance = commonState.importance //重要程度
        const standard = commonState.standard //标准依据
        const workProjectTypeData = commonState.workProjectTypeData;//工程类型
        const region = commonState.region;  //区域
        if(data){
            let att =this.defectOrderJson[data.status];
            if(att){
                // if(state.defectStatusDescription!=att.text){
                //
                // }
               // action.updateDefectStatusDescription(att.text)
                state.defectStatusDescription=att.text;
                state.defectIsEdit=att.edit;
                state.defectProcessButton=att.process;
            }
           // commonState.defectDocumentStatus.filter((item, i) => {
           //     if(item.value == data.status){
           //         state.defectStatusDescription= item.description;
           //         return;
           //     }
           //  });
        }else{

            // action.updateDefectStatusDescription('待提报')
          state.defectStatusDescription="待提报";
            state.defectIsEdit=true;
        }
        const defectStatusDescription=state.defectStatusDescription;
        const buildingNumber = commonState.buildingNumber //楼号
        const floor = commonState.floors //楼层
        const code = commonState.codeEntity;
        return (
            <div>
                <Form layout="vertical">
                    {
                        getFieldDecorator('id', {//ID
                            initialValue: data ? data.id  : ''
                        })(
                            <Input disabled type="hidden"/>
                        )
                    }
                    {
                        getFieldDecorator('status', {//状态
                            initialValue: data ? data.status  : 'DDTB'
                        })(
                            <Input disabled type="hidden"/>
                        )
                    }
                    {
                        getFieldDecorator('orgId', {//组织
                            initialValue: data ? data.orgId?data.orgId: commonState.orgId:commonState.orgId
                        })(
                            <Input disabled type="hidden"/>
                        )
                    }
                    {
                        getFieldDecorator('siteId', {//站点
                            initialValue: data ? data.siteId?data.siteId:commonState.siteId: commonState.siteId
                        })(
                            <Input disabled type="hidden"/>
                        )
                    }
                    {
                        getFieldDecorator('archivesId', {//档案Id
                            initialValue: data ? data.archivesId? data.archivesId:"": ""
                        })(
                            <Input type="hidden" />
                        )
                    }
                    {
                        getFieldDecorator('reportId', {//提报人id
                            initialValue: data ? data.reportId?data.reportId:commonState.personId  : commonState.personId
                        })(
                            <Input type="hidden"/>
                        )
                    }

                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{span: 7}}>
                            <FormItem
                                label="编号"
                            >
                                {
                                    getFieldDecorator('defectDocumentNum', {

                                        //   initialValue: data ? data.receiveTime  : "",
                                        initialValue: data ? data.defectDocumentNum : code,
                                        rules: [{
                                            required: true, message: '编号不能为空！'
                                        }]
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 14}}>
                            <FormItem
                                label="描述"
                            >
                                {
                                    getFieldDecorator('description', {
                                        rules: [
                                            {required: true, message: '描述不能为空！'},
                                            {max: 500, message: '描述长度应小于500字符长度'}
                                        ],
                                        initialValue: data ? data.description : ''
                                    })(
                                        <Input  disabled={!state.defectIsEdit}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{span: 7}}>
                            <FormItem
                                label="区域"
                            >
                                {
                                    getFieldDecorator('region', {
                                        initialValue: data ? data.region : '',
                                        rules: [
                                            {required: true, message: '区域不能为空！'}
                                        ]
                                    })(
                                        <Select onChange={(id,type) => {
                                          this.selectLocation(id,'BUILDI_NGNUMBER')
                                        }}  disabled={!state.defectIsEdit} size="large"
                                                style={{width: '100%'}}>
                                            {
                                                region.map((item, i) => <Option key={i}
                                                 value={item.id}>{item.description}</Option>)
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 7}}>
                            <FormItem
                                label="责任属性"
                            >
                                {
                                    getFieldDecorator('responsibility', {
                                        initialValue: data ? data.responsibility : '',
                                        rules: [
                                            {required: true, message: '实际执行人不能为空！'}
                                        ]
                                    })(
                                        <Select  disabled={!state.defectIsEdit} size="large"
                                                style={{width: '100%'}}>
                                            {
                                                responsibility.map((item, i) => <Option key={i}
                                                                                        value={item.value}>{item.description}</Option>)
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 7}}>
                            <FormItem
                                label="站点"
                            >
                                {
                                    getFieldDecorator('siteName', {
                                        initialValue: data ? data.siteName?data.siteName:commonState.siteName : commonState.siteName
                                    })(
                                        <Input placeholder="站点" disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{span: 7}}>
                            <FormItem
                                label="楼号"
                            >
                                {
                                    getFieldDecorator('buildingNum', {
                                        initialValue: data ? data.buildingNum : '',
                                        rules: [
                                            {required: true, message: '楼号不能为空！'}
                                        ]
                                    })(
                                        <Select  disabled={!state.defectIsEdit}size="large"
                                                style={{width: '100%'}} onChange={(id,type) => {
                                            this.selectLocation(id,'FLOORS')
                                             }}>
                                            {
                                                buildingNumber.map((item, i) =>
                                                    <Option key={i} value={item.id}>{item.description}</Option>)
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 7}}>
                            <FormItem
                                label="重要程度"
                            >
                                {
                                    getFieldDecorator('importance', {
                                        initialValue: data ? data.importance : '',
                                    })(
                                        <Select  disabled={!state.defectIsEdit}size="large" style={{width: '100%'}}>
                                            {
                                                importance.map((item, i) => <Option key={i}
                                                                                    value={item.value}>{item.description}</Option>)
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 7}}>
                            <FormItem
                                label="状态"
                            >
                                {
                                    getFieldDecorator('statusDescription', {
                                        initialValue: data ? defectStatusDescription : "待提报"
                                    })(
                                        <Input  disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{span: 7}}>
                            <FormItem
                                label="楼层"
                            >
                                {
                                    getFieldDecorator('floor', {
                                        initialValue: data ? data.floor : '',
                                        rules: [
                                            {required: true, message: '楼层不能为空！'}
                                        ]
                                    })(
                                        <Select onSelect={this.workTypesSelect} disabled={!state.defectIsEdit}size="large"
                                                style={{width: '100%'}}>
                                            {
                                                floor.map((item, i) => <Option key={i}
                                                                               value={item.id}>{item.description}</Option>)
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 7}}>
                            <FormItem
                                label="标准依据"
                            >
                                {
                                    getFieldDecorator('standard', {
                                        initialValue: data ? data.standard : '',
                                    })(
                                  <Select  disabled={!state.defectIsEdit}size="large" style={{width: '100%'}}>
                                            {
                                                standard.map((item, i) =>
                                          <Option key={i}value={item.value}>{item.description}</Option>)
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 7}}>
                            <FormItem
                                label="提报时间"
                            >
                                {
                                    getFieldDecorator('reportDate', {
                                        initialValue: data ? data.reportDate ? moment(data.reportDate).format('YYYY-MM-DD HH:mm'): moment(new Date()).format('YYYY-MM-DD HH:mm') : moment(new Date()).format('YYYY-MM-DD HH:mm'),
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{span: 7}}>
                            <FormItem
                                label="方位"
                            >
                                {
                                    getFieldDecorator('position', {
                                        inintialValue: data ? data.position: '',
                                        rules: [
                                            {max: 50, message: '方位超过50个字符长度'},
                                        ]
                                    })(
                                        <Input placeholder="请输入方位" disabled={!state.defectIsEdit}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 7}}>
                            <FormItem
                                label="关联图纸"
                            >
                                {
                                    getFieldDecorator('archivesNum', {
                                        initialValue: data ? data.archivesNum?data.archivesNum:'' : '',
                                    })(
                                        !state.defectIsEdit ? <Input disabled/> :
                                            <Input placeholder="请选择关联图纸" readOnly
                                                   suffix={<Icon type="plus"
                                                                 onClick={() => {
                                                                     this.setState({
                                                                         selectarchivesModalShow: true,
                                                                     });
                                                                 }} />}/>
                                    )
                                }
                            </FormItem>
                            <Selectarchives
                                multiple
                                visible={this.state.selectarchivesModalShow}
                                getSelectDate={this.archivesInputFocus}
                                modalHide={() => { this.setState({ selectarchivesModalShow: false }) }}
                              //  selectPersonModalHide={() => { this.setState({ selectarchivesModalShow: false }) }}
                            />
                        </Col>
                        <Col className="gutter-row" xs={{span: 7}}>
                            <FormItem label="提报人">
                                {
                                    getFieldDecorator('reportPersonName', {
                                        initialValue: data ? data.reportPersonName?data.reportPersonName :commonState.personName: commonState.personName,
                                    })(
                                        <Input disabled/>
                                    )
                                }

                            </FormItem>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{span: 7}}>
                            <FormItem
                                label="发现时间"
                            >
                                {
                                    getFieldDecorator('findDate', {
                                        initialValue: data ? data.findDate ? moment(data.findDate, 'YYYY-MM-DD HH:mm') : null : null,
                                    })(
                                        <DatePicker disabled={!state.defectIsEdit}
                                                    showTime
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                    placeholder="请选择发现时间"
                                                    onChange={(onChange) => {
                                                    }}
                                                    onOk={(onOk) => {
                                                    }}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 7}}>
                            <FormItem
                                label="其他"
                            >
                                {
                                    getFieldDecorator('other', {
                                        rules: [
                                            { max: 500, message: '其他长度应小于50字符长度' }
                                        ],
                                        initialValue: data ? data.other : ''
                                    })(
                                        <Input disabled={!state.defectIsEdit}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col className="gutter-row" xs={{span: 7}}>
                            <FormItem
                                label="整改完成度"
                            >
                                {
                                    getFieldDecorator('completeness', {
                                        initialValue: data ? data.completeness?data.completeness:'0/0' : '0/0'
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col className="gutter-row" xs={{span: 7}}>
                            <FormItem
                                label="工程类型"
                            >
                                {
                                    getFieldDecorator('projectType', {
                                        initialValue: data ? data.projectType: '',
                                        rules: [
                                            {required: true, message: '工程类型不能为空！'}
                                        ]
                                    })(
                                        <Select  disabled={!state.defectIsEdit}size="large"
                                                style={{width: '100%'}}>
                                            {
                                                workProjectTypeData.map((item, i) => <Option key={i}
                                                                                             value={item.value}>{item.description}</Option>)
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>

                        <Col className="gutter-row" xs={{span: 20}}>
                            <FormItem
                                label="建议措施"
                            >
                                {
                                    getFieldDecorator('proposedMeasures', {
                                        initialValue: data ? data.proposedMeasures : '',
                                        rules: [
                                            {max: 500, message: '建议措施长度应小于200字符长度'}
                                        ]
                                    })(
                                        <TextArea disabled={!state.defectIsEdit} />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
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
    localStorage.setItem('defectOrder_edit_flag', true);
    let tmp = Object.assign({}, JSON.parse(localStorage.getItem('defectOrder_edit')), values);
    localStorage.setItem('defectOrder_edit', JSON.stringify(tmp));

}})(FormComponent)

class WorkOrderThreeComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            currentPage: 1,
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };
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
    routerWillLeave(nextLocation)   {
        const { location } = this.props;
        if (!nextLocation.pathname.startsWith(location.pathname.substring(0, location.pathname.length - 1))) {
            //切换其它页面
            const isEdited = JSON.parse(localStorage.getItem('defectOrder_edit_flag'));
            if (isEdited) {
                const confirm = Modal.confirm;
                confirm({
                    title: '提示',
                    content: '当前页面已修改，是否确认离开？',
                    onOk() {
                        localStorage.removeItem('defectId');
                        localStorage.removeItem('defectInfo');
                        localStorage.removeItem('defectOrder_edit_flag');
                        localStorage.removeItem('defectOrder_edit');
                        browserHistory.push(nextLocation.pathname);

                    }
                });
                return false;
            } else {
                localStorage.removeItem('defectId');
                localStorage.removeItem('defectInfo');
                localStorage.removeItem('defectOrder_edit_flag');
                localStorage.removeItem('defectOrder_edit');
            }
        }
    }
    render() {
        const {state, actions, commonActions, commonState} = this.props;

        const data=commonState.processExecutionRecord;
        const recordList = data.executionRecord || [];
        // 执行记录日期
        const recordDateArr = data.dateArr;
        let defectId = localStorage.getItem('defectId');
        if(defectId==null||defectId=='null'){
            defectId=false;
        }
        let defectIsEdit = state.defectIsEdit;

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">基本信息 <Icon type="caret-down"/></span>} key="1"
                               style={this.customPanelStyle}>
                            <NewFormComponent
                                wrappedComponentRef={taskStepsAddForm => this.taskStepsAddForm = taskStepsAddForm}
                                props={this.props}/>
                        </Panel>
                        <Panel header={<span className="label">图片信息 <Icon type="caret-down"/></span>} key="2"
                               style={this.customPanelStyle}>
                            { defectId ?
                                <Upload
                                    quoteId={defectId}
                                    hideButton={defectIsEdit}
                                    quoteType="dispatchOrderImg_report"
                                    commonActions={commonActions}
                                    commonState={commonState}
                                /> : <span>请保存工单后上传图片</span>
                            }
                        </Panel>
                        <Panel header={<span className="label">执行记录 <Icon type="caret-down"/></span>} key="3"
                               style={this.customPanelStyle}>
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


function mapStateToProps(state) {
    return {
        state: state.defect_document,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        commonActions: bindActionCreators(commonActions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderThreeComponent);
