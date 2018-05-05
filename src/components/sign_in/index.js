/**
 * 用户登录 
 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions/sign_in.js';

import { Form, Icon, Input, Button, Checkbox, Carousel,Tooltip ,message} from 'antd';
 
const FormItem = Form.Item;
import logo from '../../images/logo.png';
import footerLogo from '../../images/footer_logo.png';
import androidQrcode from '../../images/android-qrcode.png';
import IOSQrcode from '../../images/IOS-qrcode.png';
import logoActiveImg from '../../images/logo-active.png';

import Today from '../../components/common/today.js';



class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code:'',
            loading:false,
        }
    }
    signIn = (e) => {
        e.preventDefault();
        let { actions } = this.props;
        console.log(actions);
        this.props.form.validateFields((err, values) => {
            if (!err){
             this.setState({loading:true});
             actions.signIn(values, (data) => {
             this.setState({loading:false});
                   if(data.code==200){
                     message.success('登陆成功');
                     localStorage.setItem('token', data.result.token);//token
                     localStorage.setItem('uInfo', data.result.uInfo);//登陆用户信息
                     localStorage.setItem('LEVEL', 'SITE_LEVEL');//初始化站点信息
                     location.href = '/main/dashboard';
                   }else{
                      message.error(data.msg);
                   } 
            });   
            } 
        });
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.signIn}>
                <FormItem>
                    {
                        getFieldDecorator('loginName', {
                             initialValue: '13755131066',
                            rules: [{ required: true, message: '请输入用户名' }],
                        })(
                            <Input addonBefore={<Icon type="user" style={{ fontSize: 20 }} />} placeholder="用户名" />
                        )
                    }
                </FormItem>
                <FormItem>
                    {
                        getFieldDecorator('password', {
                            initialValue: '123456',
                            rules: [{ required: true, message: '请输入密码' }],
                        })(
                            <Input addonBefore={<Icon type="lock" style={{ fontSize: 20 }} />} type="password" placeholder="Password" />
                        )
                    }
                </FormItem>
                <FormItem>
                    <a className="login-form-forgot" href="#">忘记密码?</a>
                    <Button loading={this.state.loading} htmlType="submit"  className="login-form-button" onClick={this.signIn}>
                        登录
                    </Button>
                </FormItem>
            </Form>
        );
    }
}
const NewFormComponent = Form.create()(FormComponent);

class LoginComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render () {

        const { actions } = this.props;

        return (
            <div className="sign-in-wrap">
                <div className="sign-in-content">
                    <div className="sign-in-form">
                        <ol>
                            <li><img src="https://wx.qlogo.cn/mmhead/Q3auHgzwzM5K3xibNkYRYUDR7cibVBUu3lEKTcW0TXw3Tibb6flEzNzOg/0" alt="" /></li>
                            <li>轻量级运维过程管理系统</li>
                        </ol>
                        <NewFormComponent actions={actions} />
                        <dl>
                            <dt>
                                易维保 V1.0
                            </dt>
                            <dd><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></dd>
                            <dd><a href="#"><Icon type="question-circle-o" /> 操作帮助</a></dd>
                        </dl>
                    </div>
                    <div className="carousel">
                        <Carousel autoplay>
                            <div className="item item-1">
                                <div className="text">
                                    <h2>从现在起，移动化管理你的团队</h2>
                                    <p>管理员派单，工人手机接单，客户查单。帮助报修人和维修方实时追踪维修进度， 并实现快速协作。</p>
                                </div>
                            </div>
                            <div className="item item-2">
                                <div className="text">
                                    <h2>从现在起，移动化管理你的团队</h2>
                                    <p>管理员派单，工人手机接单，客户查单。帮助报修人和维修方实时追踪维修进度， 并实现快速协作。</p>
                                </div>
                            </div>
                            <div className="item item-3">
                                <div className="text">
                                   <h2>从现在起，移动化管理你的团队</h2>
                                    <p>管理员派单，工人手机接单，客户查单。帮助报修人和维修方实时追踪维修进度， 并实现快速协作。</p>
                                </div>
                            </div>
                            <div className="item item-4">
                                <div className="text">
                                    <h2>从现在起，移动化管理你的团队</h2>
                                    <p>管理员派单，工人手机接单，客户查单。帮助报修人和维修方实时追踪维修进度， 并实现快速协作。</p>
                                </div>
                            </div>
                        </Carousel>
                    </div>
                </div>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        state: state.signIn
    }
}

function buildActionDispatcher(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, buildActionDispatcher)(LoginComponent);
