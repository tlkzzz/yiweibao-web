import React from 'react';

import { Modal, Button, Row, Col, Table, Pagination, Tag, Icon, Form, Radio, Input } from 'antd';

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
        const { sendProcess } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if ("PASS" !== values.flow && (values.description == null || values.description.length == 0)) {
                    this.props.form.setFields({description: {errors: [new Error('请填写驳回原因、审批意见!')]}});
                } else {
                    sendProcess(values);
                    this.props.form.resetFields();
                }
            }
        });
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const { status, visible, sendProcessHide, PASS_Message, REJECT_Message, processDescription, defaultProcessSelector } = this.props;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
            fontSize: 14
        };

        let radioStatus;
        switch (status) {
            case 'DTB':
                radioStatus = (
                    <div>
                        <Radio style={radioStyle} value="PASS">提报</Radio>
                        <p
                            style={{marginBottom: 20, textIndent: 22}}
                            className="send-process-text"
                        >
                            任务将会推送到<span className="blue">&lt;{PASS_Message}&gt;</span>进行处理。通过记录中“执行记录”进行实时查看！
                        </p>
                    </div>
                );
                break;
            case 'DFP':
                radioStatus = (
                    <div>
                        <Radio style={radioStyle} value="PASS">分派</Radio>
                        <p
                            style={{marginBottom: 20, textIndent: 22}}
                            className="send-process-text"
                        >
                            任务将会推送到<span className="blue">&lt;{PASS_Message}&gt;</span>进行处理。通过记录中“执行记录”进行实时查看！
                        </p>
                        <Radio style={radioStyle} value="REJECT">驳回</Radio>
                        <p
                            style={{marginBottom: 20, textIndent: 22}}
                            className="send-process-text"
                        >
                            驳回到<span className="blue">&lt;{REJECT_Message}&gt;</span>重新处理。
                        </p>
                        <Radio style={radioStyle} value="CANCEL">取消</Radio>
                        <p
                            style={{marginBottom: 20, textIndent: 22}}
                            className="send-process-text"
                        >
                            取消后将不可恢复，请慎重操作！
                        </p>
                    </div>
                );
                break;
            case 'DJD':
                radioStatus = (
                    <div>
                        <Radio style={radioStyle} value="PASS">确认接单</Radio>
                        <p
                            style={{marginBottom: 20, textIndent: 22}}
                            className="send-process-text"
                        >
                            任务将会推送到<span className="blue">&lt;{PASS_Message}&gt;</span>进行处理。通过记录中“执行记录”进行实时查看！
                        </p>
                        <Radio style={radioStyle} value="REJECT">驳回</Radio>
                        <p
                            style={{marginBottom: 20, textIndent: 22}}
                            className="send-process-text"
                        >
                            驳回到<span className="blue">&lt;{REJECT_Message}&gt;</span>重新处理。
                        </p>
                    </div>
                );
                break;
            case 'DHB':
                radioStatus = (
                    <div>
                        <Radio style={radioStyle} value="PASS">汇报</Radio>
                        <p
                            style={{marginBottom: 20, textIndent: 22}}
                            className="send-process-text"
                        >
                            任务将会推送到<span className="blue">&lt;{PASS_Message}&gt;</span>进行处理。通过记录中“执行记录”进行实时查看！
                        </p>
                        <Radio style={radioStyle} value="REJECT">挂起</Radio>
                        <p
                            style={{marginBottom: 20, textIndent: 22}}
                            className="send-process-text"
                        >
                            驳回到<span className="blue">&lt;{REJECT_Message}&gt;</span>重新处理。
                        </p>
                    </div>
                );
                break;
            case 'GQ':
                radioStatus = (
                    <div>
                        <Radio style={radioStyle} value="PASS">汇报</Radio>
                        <p
                            style={{marginBottom: 20, textIndent: 22}}
                            className="send-process-text"
                        >
                            任务将会推送到<span className="blue">&lt;{PASS_Message}&gt;</span>进行处理。通过记录中“执行记录”进行实时查看！
                        </p>
                        <Radio style={radioStyle} value="REJECT">驳回</Radio>
                        <p
                            style={{marginBottom: 20, textIndent: 22}}
                            className="send-process-text"
                        >
                            驳回到<span className="blue">&lt;{REJECT_Message}&gt;</span>重新处理。
                        </p>
                    </div>
                );
                break;
            case 'SQGQ':
                radioStatus = (
                    <div>
                        <Radio style={radioStyle} value="PASS">确认挂起</Radio>
                        <p
                            style={{marginBottom: 20, textIndent: 22}}
                            className="send-process-text"
                        >
                            任务将会推送到<span className="blue">&lt;{PASS_Message}&gt;</span>进行处理。通过记录中“执行记录”进行实时查看！
                        </p>
                        <Radio style={radioStyle} value="REJECT">驳回继续执行</Radio>
                        <p
                            style={{marginBottom: 20, textIndent: 22}}
                            className="send-process-text"
                        >
                            驳回到<span className="blue">&lt;{REJECT_Message}&gt;</span>重新处理。
                        </p>
                    </div>
                );
                break;
            case 'DYS':
                radioStatus = (
                    <div>
                        <Radio style={radioStyle} value="PASS">验收</Radio>
                        <p
                            style={{marginBottom: 20, textIndent: 22}}
                            className="send-process-text"
                        >
                            任务将会推送到<span className="blue">&lt;{PASS_Message}&gt;</span>进行处理。通过记录中“执行记录”进行实时查看！
                        </p>
                        <Radio style={radioStyle} value="REJECT">驳回</Radio>
                        <p
                            style={{marginBottom: 20, textIndent: 22}}
                            className="send-process-text"
                        >
                            驳回到<span className="blue">&lt;{REJECT_Message}&gt;</span>重新处理。
                        </p>
                    </div>
                );
                break;
            case 'YSDQR':
                radioStatus = (
                    <div>
                        <Radio style={radioStyle} value="PASS">验收确认</Radio>
                        <p
                            style={{marginBottom: 20, textIndent: 22}}
                            className="send-process-text"
                        >
                            流程结束。
                        </p>
                        <Radio style={radioStyle} value="REJECT">驳回重新验收</Radio>
                        <p
                            style={{marginBottom: 20, textIndent: 22}}
                            className="send-process-text"
                        >
                            驳回到<span className="blue">&lt;{REJECT_Message}&gt;</span>重新处理。
                        </p>
                    </div>
                );
                break;
            case 'GB':
                break;
            case 'QX':
                break;
        }

        return (
            <Modal
                title='发送流程'
                onCancel={sendProcessHide}
                visible={visible}
                onOk={this.formHandleSubmit}
                width={this.props.width || 520}
                className={this.props.className}
            >
                <div className="">
                    <Form onSubmit={this.formHandleSubmit}>
                        <FormItem
                            style={{marginBottom: 0}}
                            label=""
                        >
                            {
                                getFieldDecorator('flow', {
                                    initialValue: defaultProcessSelector ? defaultProcessSelector : 'PASS',
                                    rules: [{
                                        required: true,
                                        message: '请选择任务分支！'
                                    }]
                                })(
                                    <RadioGroup size="large" style={{ width: '100%' }}>
                                        {radioStatus}
                                    </RadioGroup>
                                )
                            }
                        </FormItem>
                        <FormItem
                            style={{marginBottom: 0}}
                            label=""
                        >
                            <p className="send-process-text">备注说明：（填写驳回原因、审批意见等）</p>
                            {
                                getFieldDecorator('description', {
                                    initialValue: processDescription ? processDescription : '',
                                })(
                                    <Input type="textarea" rows={4} />
                                )
                            }
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        );
    }
}
export default Form.create()(SendProcess)