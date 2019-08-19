import React, { Component } from 'react'
import { Card, Table, Button, Icon, Modal, message } from 'antd'

import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api'
import CategoryForm from './category-form'

export default class Category extends Component {
    state = {
        categorys:[],
        loading:false,
        showStatus:0//0:都不显示，1.添加显示，2.修改显示
    }
    
    //初始化Table所有列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',
            },
            {
                width: 300,
                title: '操作',
                render: (category) => (
                    <LinkButton
                        onClick={() => this.showUpdate(category)}>
                        修改分类
                    </LinkButton>)
            },
        ]
    }
    //获取所有分类信息
    getCategorys = async () => {
        //刚进来，显示loading
        this.setState({
            loading: true,
        })
        const result = await reqCategorys()
        //隐藏loading
        this.setState({
            loading: false,
        })
        if (result.status === 0){
            const categorys = result.data
            //修改状态
            this.setState({ categorys})
        }
    }
    //显示添加分类
    showAdd = () => {
        this.setState({ showStatus:1})
    }
    //显示修改界面
    showUpdate = (category) => {
        //保存category
        this.category = category
        this.setState({ showStatus: 2 })
    }
    //添加分类需要表单验证，需要定义一个方法获取子元素的form对象
    setForm = (form) => {
        this.form = form
    }
    //添加分类
    addCategory = () => {
        //1.进行表单验证
        this.form.validateFields(async (error,values) => {
            if (!error) {
                // 重置输入数据
                this.form.resetFields()
                //隐藏添加界面
                this.setState({showStatus:0})
                //2.获取数据
                const categoryName = values.categoryName
                //3.发送请求
                const result = await reqAddCategory(categoryName)
                //4.根据请求结果做不同的处理
                if (result.status === 0){
                    message.success('添加分类成功 ')
                    //显示最新列表
                    this.getCategorys()
                }else{
                    message.error('添加分类失败 ' + result.msg)
                }
            }
        })
    }
    //修改分类
    updateCategory = () => {
        //1.进行表单验证
        this.form.validateFields(async (error, values) => {
            if (!error) {
                // 重置输入数据
                this.form.resetFields()
                //隐藏修改界面
                this.setState({showStatus:0})
                //2.获取数据
                const categoryId = this.category._id
                const categoryName = values.categoryName
                //3.发送请求
                const result = await reqUpdateCategory(categoryId,categoryName)
                //4.根据请求结果做不同的处理
                if (result.status === 0) {
                    message.success('修改分类成功 ')
                    //显示最新列表
                    this.getCategorys()
                } else {
                    message.error('修改分类失败 ' + result.msg)
                }
            }
        })
    }
    //返回，隐藏对话框
    handleCancel = () => {
        // 重置输入数据
        this.form.resetFields()
        this.setState({showStatus:0})
    }

    componentWillMount() {
        //初始化Table所有列的数组
        this.initColumns()
    }
    componentDidMount() {
        this.getCategorys()
    }
    
    render() {
        const { categorys, loading, showStatus } = this.state
        // 取出当前需要修改的分类
        const category = this.category || {}

        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus' />
                添加
        </Button>
        )
        console.log(category)
        return (
            <Card extra={extra}>
                <Table
                    bordered
                    rowKey="_id"
                    loading={loading}
                    dataSource={categorys}
                    columns={this.columns}
                    pagination={{ pageSize: 3, showQuickJumper:true }}
                />
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <CategoryForm setForm={this.setForm} />
                </Modal>
                <Modal
                    title="修改分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <CategoryForm categoryName={category.name} setForm={this.setForm} />
                </Modal>
            </Card>
        )
    }
}
