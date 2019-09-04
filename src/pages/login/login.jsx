import React, { Component } from 'react'
import {connect} from 'react-redux'
import { Form, Icon, Input, Button } from 'antd'
import {Redirect} from 'react-router-dom'

import { login } from '../../redux/actions'

import './login.less'
import logo from '../../assets/images/logo.png'
const Item = Form.Item

class Login extends Component {

    handleSubmit = event => {
        event.preventDefault();
        //进行表单统一验证
        this.props.form.validateFields(async (err,values) => {
            if(!err){
                this.props.login(values.username,values.password)
            }
        })
      
    };
    validatePwd = (rule, value, callback) => {
        // console.log(rule, value)
        const length = value && value.length
        const pwdReg = /^[a-zA-Z0-9_]+$/
        value = value.trim()
        if (!value) {
          // callback如果不传参代表校验成功，如果传参代表校验失败，并且会提示错误
            callback('必须输入密码')
        } else if (length < 4) {
            callback('密码必须大于4位')
        } else if (length > 12) {
            callback('密码必须小于12位')
        } else if (!pwdReg.test(value)) {
            callback('密码必须是英文、数组或下划线组成')
        } else {
            callback() // 必须调用callback
        }
    }
    render() {
        // 如果当前用户已经登陆, 自动跳转到admin
        const user = this.props.user
        if (user._id) {
            return <Redirect to="/" />
        }
        const { getFieldDecorator } = this.props.form
        return (
            <div className="login">
                <div className={user.msg ? 'error-msg show' : 'error-msg'}>{user.msg}</div>
                <div className="login-header">
                    <img src={logo} alt="login" />
                    <h1>后台管理系统</h1>
                </div>
                <div className="login-content">
                    <h1>用户登录</h1>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {getFieldDecorator('username', {
                                initialValue: 'admin',
                                rules: [
                                    { required: true, whitespace: true, message: 'Please input your username!' },
                                    { min: 4, message: '用户名不能小于4位' },
                                    { max: 12, message: '用户名不能大于12位' },
                                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' }
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                />,
                            )}
                        </Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                initialValue: '',
                                rules: [
                                    // { required: true, message: 'Please input your Password!' },
                                    { validator: this.validatePwd },
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
     
}
const WrappedLoginForm = Form.create()(Login);
export default  connect(
    state => ({
        user:state.user
    }),
    { login }
)(WrappedLoginForm)