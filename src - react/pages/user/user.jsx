import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'

import {formateDate} from '../../untils/dateUtils'
import LinkButton from '../../components/link-button'
import { reqUsers, reqAddUser, reqUpdateUser, reqDeleteUser } from '../../api'
import UserForm from './user-form'
import { PAGE_SIZE } from "../../untils/constants"

export default class User extends Component {
    state = {
        users:[],
        roles:[],
        isShow:false,
    }
    //初始Columns数组
    initColumns = () => {
        this.columns = [
            {
                title:'用户名',
                dataIndex:'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: role_id => this.rolesObj[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        &nbsp;&nbsp;
                        <LinkButton onClick={() => this.clickDelete(user)}>删除</LinkButton>
                    </span>
                )
            },
        ]
    }
    /*
  根据角色的数组生成一个包含所有角色名的对象容器
  */
    initRolesObj = (roles) => {
        this.rolesObj = roles.reduce((pre, role) => {
            // pre[role._id] = role
            pre[role._id] = role.name
            return pre
        }, {})
    }
    //获取用户列表
    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0){
            const { users, roles } = result.data
            // 根据roles的数组生成roles的对象容器
            this.initRolesObj(roles)
            this.setState({ users, roles })
        }
    }
    //显示修改用户界面
    showUpdate = (user) => {
        //保存user
        this.user = user
        this.setState({isShow:true})
    }

    //添加/更新用户
    AddOrUpdateUser = async () => {
        //获取表单数据
        const user = this.form.getFieldsValue()
        //重置输入框
        this.form.resetFields()
        if(this.user){
            user._id = this.user._id
        }
        this.setState({isShow:false})
        if (user._id){
            const result = await reqUpdateUser(user)
            if (result.status === 0) {
                this.getUsers()
                // //重置输入框
                // this.form.resetFields()
                message.success('修改成功')
            }
        }else{
            const result = await reqAddUser(user)
            if (result.status === 0) {
                this.getUsers()
                message.success('添加成功')
            }
        }
        
    }

    //删除用户
    clickDelete = (user) => {
        Modal.confirm({
            content: `确定删除${user.username}吗?`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    this.getUsers()
                }
            }
        })
    }

    //隐藏输入框
    handleCancel = () => {
        this.setState({
            isShow: false
        })
    }

    componentWillMount(){
        this.initColumns()
    }
    componentDidMount(){
        this.getUsers()
    }
    render() {
        const { users, roles, isShow } = this.state
        const user = this.user || {}
        const title = (
            <Button 
                type='primary' 
                onClick={() => {
                    this.user = null
                    this.setState({  isShow:true })
                }}
            >创建用户</Button>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
                >

                </Table>
                <Modal
                    title={user._id ? '修改用户' : '添加用户'}
                    visible={isShow}
                    onOk={this.AddOrUpdateUser}
                    onCancel={this.handleCancel}
                > 
                    <UserForm 
                        user={user} 
                        roles={roles}
                        setForm={(form) => this.form = form}
                    />
                </Modal>
            </Card>
        )
    }
}
