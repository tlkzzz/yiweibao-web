/**
 * 个人信息form 
 */
import React from 'react';

import { Form, Input, Select, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import { runActionsMethod } from '../../../tools/';

class UserInfoForm extends React.Component {
    constructor(props) {
        super(props);
        this.formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };

        this.tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };
    }
    changeAccount = () => {
        const { form, actions, state } = this.props;
    
        form.validateFields((err, values) => {
            if (err) return;
            values.userId = state.userId;
            values.personId = state.personId;
            runActionsMethod(actions, 'changeAccount', values);
        });
    }
    checkNumber = (rule, value, callback) => {
        if(value && !(/^1[34578]\d{9}$/.test(value))) {
            callback('手机号格式错误');
        } else {
            callback();
        }
    }
    render () {
        const { form, data } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form>
                <FormItem
                    {...this.formItemLayout}
                    label="手机"
                >
                    {
                        getFieldDecorator('mobile', {
                            validateTrigger: 'onBlur',
                            initialValue: data ? data.mobile : '',
                            rules: [
                                { required: true, message: '手机号不能为空' },
                                { validator: this.checkNumber }
                            ],
                        })(
                            <Input autoComplete="off" style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="邮箱"
                >
                    {
                        getFieldDecorator('email', {
                            validateTrigger: 'onBlur',
                            initialValue: data ? data.email : '',
                            rules: [
                                {type: 'email', message: '输入的邮箱格式错误'},
                                {required: true, message: '邮箱不能为空' }
                            ],

                        })(
                            <Input autoComplete="off" style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="职位"
                >
                    {
                        getFieldDecorator('position', {
                            validateTrigger: 'onBlur',
                            // initialValue: data ? data.position : '',
                            rules: [{ required: true, message: '职位不能为空' }],
                        })(
                            <Input autoComplete="off" style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.tailFormItemLayout}
                >
                    <Button type="primary" size="large" className="pull-right" onClick={this.changeAccount}>保存</Button>
                </FormItem>
            </Form>
        )
    }
}
export const NewUserInfoForm = Form.create()(UserInfoForm);

class ChangePasswordForm extends React.Component {
    constructor(props) {
        super(props);
        this.formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };

        this.tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };
    }
    changePassword = () => {
        const { form, actions, state } = this.props;

        form.validateFields((err, values) => {
            if (err) return;
            values.loginName = state.loginName;
            runActionsMethod(actions, 'changePassword', values);
        })
    }

    // **** 校验 ****
    // 原密码触发新密码验证
    checkNewPassword = (rule, value, callback) => {
        const form = this.props.form;

        if (form.getFieldValue('newPasswd')) {
            form.validateFields(['newPasswd'], { force: true }); // 触发newpasswd 验证
        }
        callback();
    }
    // 检查新密码和原密码是否不同 | 检查新密码和确认密码是否相同
    checkOldAndConfirm = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value === form.getFieldValue('oldPasswd')) {
            callback('新密码不能与旧密码一样!');
        } else {
            if (form.getFieldValue('confirmNewPassword')) {
                form.validateFields(['confirmNewPassword'], { force: true });
            }
            callback();
        }
    }
    // 检查确认新密码和新密码是否一样
    checkPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('newPasswd')) {
            callback('两次密码输入不一致!');
        } else {
            callback();
        }
    }
    render () {
        const { form, data } = this.props;
        const { getFieldDecorator } = form;

        return (
            <Form>
                <FormItem
                    {...this.formItemLayout}
                    label="原密码"
                >
                    {
                        getFieldDecorator('oldPasswd', {
                            validateTrigger: 'onBlur',
                            rules: [
                                { required: true, message: '原密码不能为空' },
                                { validator: this.checkNewPassword }
                            ],
                        })(
                            <Input autoComplete="off" type="password" style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="新密码"
                >
                    {
                        getFieldDecorator('newPasswd', {
                            validateTrigger: 'onBlur',
                            rules: [
                                { required: true, message: '新密码不能为空' },
                                { validator: this.checkOldAndConfirm },
                                { min: 6, message: '新密码最小长度6位' },
                                { max: 16, message: '新密码最大长度16位' },
                            ]
                        })(
                            <Input autoComplete="off" type="password" style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.formItemLayout}
                    label="确认新密码"
                >
                    {
                        getFieldDecorator('confirmNewPassword', {
                            validateTrigger: 'onBlur',
                            rules: [
                                { required: true, message: '确认新密码不能为空' },
                                { validator: this.checkPassword }
                            ]
                        })(
                            <Input autoComplete="off" onBlur={this.confirmBlur} type="password" style={{ width: '100%' }} />
                        )
                    }
                </FormItem>
                <FormItem
                    {...this.tailFormItemLayout}
                >
                    <Button type="primary" size="large" className="pull-right" onClick={this.changePassword}>保存</Button>
                </FormItem>
            </Form>
        )
    }
}
export const NewChangePasswordForm = Form.create()(ChangePasswordForm);