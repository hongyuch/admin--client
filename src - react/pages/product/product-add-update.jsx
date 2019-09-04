import React, { Component } from 'react'
import { Card, Icon, Form, Input, Select, Button,message } from 'antd'

import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddUpdateProduct } from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const Item = Form.Item
const Option = Select.Option

class ProductAddUpdate extends Component {
  constructor(props){
    super(props)
    this.pwRef = React.createRef()
    this.editorRef = React.createRef()
  }
  state = {
    categorys:[]
  }
  //验证价格
  validatePrice = (rule, value, callback) => {
    if (value < 0){
      callback('价格不能小于0')
    }else{
      callback()
    }
  }
  //点击提交 
  handleSubmit = (event) => {
    event.preventDefault()
    this.props.form.validateFields(async (err,values) => {
      if(!err){
        const { name,desc,price,categoryId } = values

        const imgs = this.pwRef.current.getImgs()
        const detail = this.editorRef.current.getDetail()
        const product = { name, desc, price, categoryId, imgs, detail}
        if (this.isUpdate){
          product._id = this.product._id
        }
        const result = await reqAddUpdateProduct(product)
        if (result.status === 0){
          message.success(`${this.isUpdate ? '修改' : '添加'}商品成功`)
          this.props.history.replace('/product')
        }else{
          message.error(result.msg)
        }
      }
    })
    // console.log(1)
  }
  //异步获取分类信息
  getCatagorys = async () => {
    const result = await reqCategorys()
    if (result.status === 0){
      const categorys = result.data
      //更新状态
      this.setState({ categorys })
    }
  }

  componentWillMount(){
    const product = this.props.location.state
    this.product = product || {}
    //定义一个标识，判断是否是修改
    this.isUpdate = !!this.product._id
  }
  componentDidMount(){
    this.getCatagorys()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    // console.log(this)
    const {product, isUpdate} = this
    const { categorys } = this.state
    const title = (
      <span>
        <LinkButton onClick={() => { this.props.history.goBack() }}>
          <Icon type="arrow-left"></Icon>
        </LinkButton>
        <span>{isUpdate ? '修改' : '添加'}商品</span>
      </span>
    )
    // 所有表单项的布局
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 12 },
    };
    return (
      <Card title={title}>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Item label="商品名称">
            {
              getFieldDecorator('name',{
                initialValue: product.name,
                rules:[
                  { required: true, message:'商品名称必须输入'}
                ]
              })(
                <Input type="text" placeholder='商品名称'></Input>
              )
            }
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator('desc',{
                initialValue: product.desc,
                rules:[
                  { required: true, message:'商品描述必须输入'}
                ]
              })(
                <Input placeholder='商品描述'></Input>
              )
            }
          </Item>
          <Item label="商品价格">
            {
              getFieldDecorator('price', {
                initialValue: product.price,
                rules: [
                  { required: true, message: '商品价格必须输入' },
                  { validator: this.validatePrice}
                ]
              })(
                <Input type='number' placeholder='商品价格' addonAfter="元"></Input>
              )
            }
          </Item>
          <Item label="商品分类">
            {
              getFieldDecorator('categoryId', {
                initialValue: product.categoryId,
                rules: [
                  { required: true, message: '商品分类必须输入' }
                ]
              })(
                <Select>
                  <Option value=''>未选择</Option>
                  {
                    categorys.map(c => <Option value={c._id} key={c._id}>{c.name}</Option>)
                  }
                </Select>
              )
            }
          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.pwRef} imgs={product.imgs}/>
          </Item>
          <Item label="商品详情">
            <RichTextEditor ref={this.editorRef} detail={product.detail}/>
          </Item>
          <Item>
            <Button type='primary' htmlType="submit">提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}
export default Form.create()(ProductAddUpdate)
