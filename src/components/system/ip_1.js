/** 
 * @Description ip管理
 */
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Link, browserHistory } from 'react-router';
import actions from '../../actions/system.js';
import { createForm } from 'rc-form';
import PubSub  from 'pubsub-js';
import { pubTopic } from '../../tools/constant';
import { runActionsMethod, correspondenceJson } from '../../tools/';
import { Icon, Button, Upload, Tabs, Modal, Checkbox, Spin, Table, Pagination, Collapse, Tree, Form, Input, Row, Col, Select, DatePicker,Radio  } from 'antd';

const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const {TextArea} = Input;

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        //订阅父页面的消息
        PubSub.subscribe(pubTopic.system.IP_DETAIL, this.saveIp );

    }

    //得到父页面的消息后的操作
    saveIp=(msg, data)=>{
        console.log( msg, data );
        let { actions } = this.props;
        const { commonState } = this.props;
        console.log("--data----",data);
        if(data==='IP_SAVE'){
            this.props.form.validateFields((err, values) => {
                values.orgId=commonState.orgId;
                values.siteId=commonState.siteId;
                if(values.id==='' || values.id===undefined){
                    if (!err) runActionsMethod(actions, 'ipSave', values,(da)=>{
                        console.log("--save----",da);
                    });
                }else{
                    if (!err) runActionsMethod(actions, 'ipUpdate', values,(da)=>{
                        console.log("---update---",da);
                    });
                }
                console.log("--values----",values);
                PubSub.publish(pubTopic.system.IP_LIST_REFRESH, 'IP_LIST_REFRESH' );
                browserHistory.push(`/system/ip`);
            });
        }

    }
    componentWillMount(){
        const { actions } = this.props;
        let  data= localStorage.getItem('ipId');
        actions.ipFindOne({id:data});
    }
    // componentDidUpdate(){
    //     const { actions } = this.props;
    //    console.log("-----1---componentDidUpdate----");
    //      let  data= localStorage.getItem('ipId');
    //     console.log("----1----componentDidUpdate----",data);
    //     actions.ipFindOne({id:data});
    // }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {data} = this.props;
        console.log("-render-data----",data);
        return (
            <Form layout="vertical">
                <Row gutter={16} justify="start">
                    <Col className="gutter-row" xs={{span: 8}}>
                        <FormItem
                            label="IP地址"
                        >
                            {
                                getFieldDecorator('ip', {
                                    initialValue: data ? data.ip : ''
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Col>

                    <Col className="gutter-row" xs={{span: 8}}>
                        <FormItem
                            label="状态"
                        >
                            {getFieldDecorator('status',{
                                initialValue: data ? data.status : 'N'
                            })(
                                <RadioGroup>
                                    <RadioButton value="Y">激活</RadioButton>
                                    <RadioButton value="N">未激活</RadioButton>
                                </RadioGroup>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <FormItem
                    label="备注"
                >
                    {
                        getFieldDecorator('remark', {
                            initialValue: data ? data.remark : ''
                        })(
                            <TextArea autosize={{minRows: 5, maxRows: 7}}/>
                        )
                    }
                </FormItem>
                    <FormItem>
                    {
                        getFieldDecorator('id', {
                            initialValue: data ? data.id : ''
                        })
                        (
                            <Input type='hidden'/>
                        )
                    }
                </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('productArray', {
                            initialValue: ['EAM']
                        })
                        (
                            <Input type='hidden'/>
                        )
                    }
                </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('siteId', {
                            initialValue: data ? data.siteId : ''
                        })
                        (
                            <Input type='hidden'/>
                        )
                    }
                </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('orgId', {
                            initialValue: data ? data.orgId : ''
                        })
                        (
                            <Input type='hidden'/>
                        )
                    }
                </FormItem>

            </ Form >
        )
    }
}

const NewFormComponent = connect(mapStateToProps, buildActionDispatcher)(createForm()(FormComponent));

class IpFormComponent extends React.Component {
    constructor(props) {
        super(props);


        this.customPanelStyle = {
            background: '#fff',
            borderRadius: 2,
            marginBottom: 24,
            border: 0,
            boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)'
        };

    }
    render() {
        const {state, commonState} = this.props;
        const data = state.ipDetail;
        console.log("-----render------props---",state);
        return (
            <div className="eam-tab-page">
                <div className="eam-content">
                    <Collapse bordered={false} defaultActiveKey={['1', '2', '3']}>
                        <Panel header={<span className="label">IP管理 <Icon type="caret-down"/></span>} key="1"
                               style={this.customPanelStyle}>
                            <NewFormComponent state={state} data={data}   />
                        </Panel>
                    </Collapse>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        state: state.system,
        commonState: state.common
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(IpFormComponent);
