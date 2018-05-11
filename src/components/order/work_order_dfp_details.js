/** 
 * @Description 位置体系-基本信息
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/maintenance.js';
import { createForm } from 'rc-form';
import { browserHistory } from 'react-router';
import Dropdown from '../../components/common/dropdown.js';
import SelectAsset from '../common/select_asset';
import { runActionsMethod } from '../../tools';
import SelectPerson from '../../components/common/select_person.js';
import moment  from 'moment';
import { Icon, Button, Modal, Table, Pagination, Collapse, Form, Input,message, Row, Col, Select} from 'antd';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;


//工单信息
class FormComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            parentLocation: {},
            locationModalShow: false,
        }
    }


 


    render () {
        const { getFieldDecorator } = this.props.form;
        const {detail,tcLevelValue} = this.props.result?this.props.result:{};
        //  console.log('data');
        // console.log(detail);
        // console.log(tcLevelValue);
        return (
            <Form layout="vertical">
                <Row gutter={32} justify="start">
                    <Col className="gutter-row" xs={{ span:7}}>
                        <FormItem
                            label="工单编号"
                        >
                            {
                                getFieldDecorator('tseUnitid',{
                                  initialValue: detail?detail.tsoNumber:'',
                                   
                                })(
                                  <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>

                    <Col className="gutter-row" xs={{ span: 7}}>
                        <FormItem
                            label={detail?detail.sousrceType=='asset'?'设备名称':'商品名称':'名称'}
                        >
                            {
                                getFieldDecorator('tbName',{
                                  initialValue: detail?detail.sousrceType=='asset'?detail.assetName:detail.tcName:'',
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                     <Col className="gutter-row" xs={{ span: 7}}>
                        <FormItem
                            label="报修时间"
                        >
                            {
                                getFieldDecorator('tbName',{
                                initialValue: detail?moment(detail.tsoAddDate).format('YYYY-MM-DD hh:mm:ss'):'',
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>

                       <Row gutter={32} justify="start">
                    <Col className="gutter-row" xs={{ span:7}}>
                        <FormItem
                            label="一般/紧急"
                        >
                            {
                                getFieldDecorator('tseUnitid',{
                                  initialValue: detail?detail.tsoOrderStatus==0? '一般':'紧急' :'',
                                   
                                })(
                                  <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                     <Col className="gutter-row" xs={{ span:7}}>
                        <FormItem
                            label="报修人"
                        >
                            {
                                getFieldDecorator('tseUnitid',{
                                 initialValue: detail?detail.tcName:'',
                                   
                                })(
                                  <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                     <Col className="gutter-row" xs={{ span: 7}}>
                        <FormItem
                            label="会员等级"
                        >
                            {
                                getFieldDecorator('tbName',{
                                 initialValue: tcLevelValue?tcLevelValue:'',
                                })(
                                    <Input disabled/>
                                )
                            }
                        </FormItem>
                    </Col>
                  
                </Row>
                    <Row gutter={32} justify="start">
                   
                    <Col className="gutter-row" xs={{ span: 7}}>
                        <FormItem
                            label="故障描述"
                        >
                            {
                                getFieldDecorator('tbName',{
                                  initialValue: detail?detail.tsoQuestion:'',
                                })(
                                    <Input disabled/>
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


//报修人信息
class FormBxPsersonComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


 


    render () {
  
        const {detail} = this.props.result?this.props.result:{};

        const dataSource = detail?[{
                  key: '1',
                  name: detail.tcName,
                  age: detail.tcMobile,
                  address: detail.tcProv+detail.tcCity+detail.tcRegion+detail.tcAddress
                }] :[];

            const columns = [{
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
            }, {
              title: '手机号码',
              dataIndex: 'age',
              key: 'age',
            }, {
              title: '地址',
              dataIndex: 'address',
              key: 'address',
            }];


        return (
                   <div>
               
                   
                            <Table

                             dataSource={dataSource}
                             columns={columns}
                        />
                      
                   
                 
                  
                </div>
        )
    }
}

//派工记录信息
class FormPgPsersonComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list:[],
            tableLoading:false,

        }
    }


componentWillMount () {
  const { actions,location} = this.props;
            console.log('paigongdian')
               console.log(location);
            //获取工单详情
             this.setState({tableLoading:true})
         actions.dispatchList(location.state, (json) => {
            console.log(json)
               this.setState({list:json.result.rows,tableLoading:false})
          });
            
    }

 workOrder_state = (val)=>{
                if(val == 1){//工单状态待派工
                    return  '初始分配';
                }else if(val == 2){
                    return '确认工单';
                }else if(val == 3){
                    return '维修中';
                }else if(val == 4){
                    return '已维修';
                }else if(val == 5){
                    return '完成验收';
                }else if(val == 0){
                    return '已拒绝';
                }

 }


    render () {
  
      const columns = [{
              title: '姓名',
              dataIndex: 'tseName',
              key: 'tseName',
            }, {
              title: '手机号码',
              dataIndex: 'tseMobile',
              key: 'tseMobile',
            }, {
              title: '维修状态',
              dataIndex: 'tsodStatus',
              key: 'tsodStatus',
              render:val=><span>{this.workOrder_state(val)}</span>
            }, {
              title: '派工时间',
              dataIndex: 'tsodAllocateDate',
              key: 'tsodAllocateDate',
            }, {
              title: '到达耗时(分)',
              dataIndex: 'reachTime',
              key: 'reachTime',
            }, {
              title: '维修耗时(分)',
              dataIndex: 'tim',
              key: 'tim',
            }, {
              title: '验收评价',
              dataIndex: 'teMaintain',
              key: 'teMaintain',
            }];



        return (
                   <div> 
                    <Table
                      rowKey="tid"
                               loading={this.state.tableLoading}
                             dataSource={this.state.list}
                             columns={columns}
                        />
                </div>
        )
    }
}




class WorkOrderOneComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            saveLoading:false,
            detail:{},
            selectPersonModalShow:false,
        }

        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };
    }




        // 获取工单详情
    getList = (e) => {
         const { actions} = this.props;
            //获取工单详情
         actions.getAssigned(e, (json) => {
            console.log(json)
                this.setState({detail:json.result})
          });
    }
    //页面初始化
 componentWillMount () {
   const {location} = this.props;

    // if(location.state){
         this.getList(location.state);
    // }else{
    //      browserHistory.push("/order/work_order_dfp");
    // }
    }

    //分派

    orderFpSave =()=>{
         const {location} = this.props;
         const tsoId = location.state;
         this.setState({
                    selectPersonModalShow: true
                })


    }

    //选择人员回调
    setFieldsValue =(json)=>{
        console.log(json);

          const { actions,location} = this.props;
            //获取工单详情
         actions.dispatch({tseId:json.Id,tsoId:this.state.detail.detail.tsoId}, (json) => {
                console.log(json)
                // this.setState({detail:json.result})
               if(json.code==200){
                 message.success(json.msg);

                if(location.state){
                     this.getList(location.state);
                }else{
                     browserHistory.push("/order/work_order_dfp");
                }
               }else{
                    message.error(json.msg);


               }
          });
    }


    getstate = (e)=>{
              if(e==1){
            return '待派工'
        }else if(e==2){
            return '待确认'
        }else if(e==3){
            return '待维修'
        }else if(e==4){
            return '维修中'
        }else if(e==5){
            return '已维修'
        }else if(e==6){
            return '已支付'
        }else if(e==7){
            return '已完成'
        }
    }

    render () {
        const { location ,actions} = this.props;
        const detail = this.state.detail;
        const dd = detail? detail.detail:'';
         // console.log(detail);
         const buttonst = (
            <div className="panel-tools-right">
                                <Button size="large" type="primary" loading={this.state.saveLoading} onClick={this.orderFpSave}>分派</Button>
                            </div>
            )

        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2','3']}>
                        <Panel header={<span className="label">工单信息-{dd? this.getstate(dd.tsoStatus):''} <Icon type="caret-down" /></span>} key="1" style={this.customPanelStyle}>
                           {dd? dd.tsoStatus ==1 ? buttonst:'':''} 
                            <NewFormComponent
                                actions={actions}
                                location={location}
                                result = {detail}
                            />
                             <SelectPerson
                                    multiple={false}
                                    visible={this.state.selectPersonModalShow}
                                    selectPersonModalHide={() => {
                                        this.setState({selectPersonModalShow: false})
                                    }}
                                    onOk={(selected) => {
                                        let json = {
                                            ["Name"]: selected.tseName,
                                            [ 'Id']: selected.tseId,
                                            ['Mobile']: selected.tseMobile,
                                        }
                                        this.setFieldsValue(json);
                                    }}
                                   />




                        </Panel>


                            <Panel header={<span className="label">提报人信息 <Icon type="caret-down" /></span>} key="2" style={this.customPanelStyle}>
                           
                            <FormBxPsersonComponent
                                actions={actions}
                                location={location}
                                result = {detail}
                            />
                        </Panel>
                          {dd? dd.tsoStatus !=1 ? ( <Panel header={<span className="label">派工记录 <Icon type="caret-down" /></span>} key="3" style={this.customPanelStyle}>
                           
                            <FormPgPsersonComponent
                                actions={actions}
                                location={location}
                               
                               
                            />
                        </Panel>):'':''}    
                       


                        
                      
                    </Collapse>
                </div>
            </div>
         
             


        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.maintenance,
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(WorkOrderOneComponent);
