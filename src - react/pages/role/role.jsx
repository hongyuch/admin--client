import React, { Component } from 'react'
import {Card,Button,Table,Modal,message} from 'antd'

import LinkButton from '../../components/link-button'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import memoryUtils from '../../untils/memoryUtils'
import {formateDate} from '../../untils/dateUtils'
import AddForm from './add-form.jsx'
import AuthForm from './auth-form'

export default class Role extends Component {
    constructor(props){
        super(props)
        this.authRef = React.createRef()
    }
    state = {
        roles:[],
        isShowAdd:false,
        isShowUpdate:false
    }
    //初始化columns
    initColumns = () => {
        this.columns = [
            {
                title:'角色名称',
                dataIndex:'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            },
            {
                title: '操作',
                render: role => (
                    <LinkButton
                        onClick={() => {
                            this.role = role
                            this.setState({ isShowUpdate: true })
                        }}
                    >
                        设置授权
                    </LinkButton>)
            },

        ]
    }
    //获取角色列表
    getRoles = async () =>{
        const result = await reqRoles()
        if(result.status === 0){
            const roles = result.data
            this.setState({ roles})
        }
    }
    //创建角色
    addRole = () => {
        //进行表单验证
        this.form.validateFields(async (error,values) => {
            if (!error){
                //重置
                this.form.resetFields()
                //更新状态
                this.setState({ isShowAdd: false })
                const roleName = values.roleName
                const result = await reqAddRole(roleName)
                if (result.status === 0){
                    message.success('添加用户成功')
                    this.getRoles()
                }else{
                    message.error(result.msg)
                }
            }
        })
    }
    //设置权限
    updateRole = async () => {
        this.setState({ isShowUpdate: false})
        //更新role
        const role = this.role
        role.menus = this.authRef.current.getMenus()
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username
        const result = await reqUpdateRole(role)
        if (result.status === 0){
            message.success('设置角色权限成功')
            this.getRoles()
        }else{
            message.error(result.msg)
        }
    }

    //隐藏
    handleCancel = () => {
        this.setState({ isShowAdd: false, isShowUpdate:false})
    }
    componentWillMount(){
        this.initColumns()
    }
    componentDidMount(){
        this.getRoles()
    }
    render() {
        const { roles, isShowAdd, isShowUpdate } = this.state
        const title = (
            <Button 
                type='primary'
                onClick={() => this.setState({ isShowAdd:true})}
            >创建角色
            </Button>
            )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                >
                </Table>
                <Modal 
                    title='添加角色'
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={this.handleCancel}
                >
                    <AddForm setForm={form => this.form = form}/>
                </Modal>
                <Modal
                    title='设置角色权限'
                    visible={isShowUpdate}
                    onOk={this.updateRole}
                    onCancel={this.handleCancel}
                >
                    <AuthForm ref={this.authRef} role={this.role}/>
                </Modal>
            </Card>
        )
    }
}
