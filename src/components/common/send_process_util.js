import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import actions from '../../actions/common.js';


import {Modal, Button, Row, Col, Table, Pagination, Tag, Icon, Form, Radio, Input,message} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

/**
 * SelectAsset
 * 发送流程组件
 


 * @props  status                   根据状态选择要展示的单选按钮
 * @props  visible                  弹窗显示/隐藏
 * @props  onOk                     确认方法 onOk={selected => selected}

 */
class SendProcess extends React.Component {
    constructor(props) {
        super(props);
    }

    formHandleSubmit = () => {
        const {sendProcess} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if ("PASS" != values.flow&&"agree" != values.flow && (values.description == null || values.description.length == 0)) {
                    this.props.form.setFields({description: {errors: [new Error('请填写驳回原因、审批意见!')]}});
                } else {
                    sendProcess(values);
                    this.props.form.resetFields();
                }

            }
        });
    };

    getIsOperationAuthority=(operationAuthority)=>{
        console.info("operationAuthority",operationAuthority);
        const {commonState} = this.props;
        let IsOperationAuthority=false;
        if(operationAuthority==true){//直接传递true,代表此节点不参与操作权限验证
            IsOperationAuthority=true
        }else if(operationAuthority!=null&&operationAuthority!=undefined&&commonState!=undefined){//如果多个人，请将人员Id以逗号隔开的形式传递
            let p=operationAuthority.split(",");
            for(let att in p){
               if(p[att]==commonState.personId) {
                   IsOperationAuthority=true;
               }
            }
        }else{
            //传递的参数等于空，不参与流程验证
            IsOperationAuthority=true;
            console.info("权限验证数据为null或者undefined")
        }
        if(!IsOperationAuthority){
            message.warning('无权限操作此工单流程节点');
        }
     return IsOperationAuthority;
    }


    render() {

        const {getFieldDecorator} = this.props.form;
        const {status, data, visible,
            sendProcessHide,processDescription,
            processOptionExplain,operationAuthority,commonState,description} = this.props;

//
        let operation=[];
        let isFirstNode;
        let isLastNode;
        if (data != null && data != undefined) {
            for (let i=0;i<data.length;i++){
                if(data[i].statusName==status){
                    operation=data[i].operation;
                    isFirstNode=data[i].isFirstNode?data[i].isFirstNode:false;
                    isLastNode=data[i].isLastNode?data[i].isLastNode:false;
                    break;
                }
            }
        }
        let defaultValue=operation.length?operation[0].value?operation[0].value:null:null;
        const display=isFirstNode?'none':"block"
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
            fontSize: 14,
            display:display
        };

        let IsOperationAuthority=true;
       // IsOperationAuthority=this.getIsOperationAuthority(operationAuthority)


        return IsOperationAuthority?
            (<Modal
                title='发送流程'
                onCancel={sendProcessHide}
                visible={visible}
                //afterClose={() => { this.startGetList = true }}
                onOk={this.formHandleSubmit}
            >
                <div className="">
                    <p style={{display:display}}><Icon type="info-circle-o"/>请选择任务分支</p>
                    <Form>
                        {
                            isFirstNode ? (
                                    <div>
                                        <p className="send-process-title"><Icon type="smile-o"/>是否启动任务流程?</p>
                                        <p className="send-process-text">&nbsp;&nbsp;&nbsp;任务将会推送到 <span
                                            className="blue">&lt;{processOptionExplain?processOptionExplain.length?processOptionExplain[0]:[]:[]}{operation?operation.length?operation[0].type?operation[0].type:null:null:null}&gt;</span> 进行处理。通过记录中“执行记录”进行实时查看！</p>
                                    </div>
                                ) : (
                                    <div></div>
                                )
                        }
                        <FormItem
                            label=""
                        >
                            {
                                getFieldDecorator('flow', {
                                    initialValue: defaultValue,
                                    rules: [{
                                        required: true,
                                        message: '请选择任务分支！'
                                    }]
                                })(
                                    <RadioGroup   size="large" style={{width: '100%'}} onChange={this.onchange}>
                                        <div>
                                            {operation ? operation.map((item, idx) => {
                                                    return   (
                                                        <div>
                                                            <Radio key={idx} style={radioStyle}value={item.value}>{item.description}</Radio>
                                                            {
                                                                (()=>{
                                                                    if( item.processType=="PASS"){
                                                                        if(isLastNode){//
                                                                            return (
                                                                                <p className="send-process-text">&nbsp;&nbsp;&nbsp;任务流程结束，通过记录中“执行记录”进行实时查看 </p>
                                                                            )
                                                                        }else{
                                                                            if(!isFirstNode){
                                                                                return (
                                                                                    <p className="send-process-text">&nbsp;&nbsp;&nbsp;任务将会推送到 <span
                                                                                        className="blue">&lt;{processOptionExplain.length?processOptionExplain[idx]:null}{operation?operation.length?operation[0].type?operation[0].type:null:null:null}&gt;</span> 进行处理。通过记录中“执行记录”进行实时查看！</p>
                                                                                )
                                                                            }

                                                                        }
                                                                    }else if(item.processType=="REJECT"){
                                                                        return (
                                                                            <p className="send-process-text">&nbsp;&nbsp;&nbsp;驳回到 <span
                                                                                className="blue">&lt;{processOptionExplain.length?processOptionExplain[idx]:null}{operation?operation.length?operation[0].type?operation[0].type:null:null:null}&gt;</span> 重新处理！</p>
                                                                        )
                                                                    }else if(item.processType=="CANCEL"){//取消
                                                                        return (
                                                                            <p className="send-process-text">&nbsp;&nbsp;&nbsp;工单即将取消！</p>
                                                                        )
                                                                    }
                                                                })()
                                                            }
                                                        </div>
                                                    )

                                                }) : []}

                                        </div>
                                    </RadioGroup>
                                )
                            }
                        </FormItem>

                        <FormItem
                            label={isFirstNode?null:"备注说明：（填写驳回原因、审批意见等）"}
                        >
                            {
                                getFieldDecorator('description', {
                                    initialValue: description?description:'',
                                    rules: [
                                        {max: 255, message: '备注说明超出最大长度'},
                                    ],
                                })(
                                    <Input style={{display:display}} type= {isFirstNode?"hidden":'textarea'} rows={4}/>
                                )
                            }
                        </FormItem>


                    </Form>
                </div>

            </Modal>):null

    }
}
export default Form.create()(SendProcess)
// function mapStateToProps(state) {
//     return {
//         state: state.common
//     }
// }

// function buildActionDispatcher(dispatch) {
//     return {
//         actions: bindActionCreators(actions, dispatch),
//     }
// }

// export default connect(mapStateToProps, buildActionDispatcher)(SendProcess);
