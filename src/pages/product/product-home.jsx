import React, { Component } from 'react'
import { Card,Select,Input,Button,Icon,Table,message} from 'antd'

import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import memoryUtils from '../../untils/memoryUtils'
import { PAGE_SIZE } from '../../untils/constants'

const Option = Select.Option

export default class ProductHome extends Component {
  state = {
    products:[],
    loading:false,
    total:0,
    searchType: 'productName',//搜索类型，默认productName
    searchName:''
  }
  //初始化Table所有列的columns
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: price => `￥${price}`
      },
      {
        width:100,
        title: '状态',
        render: (product) => {
          let btnText = '下架'
          let text = '在售'
          if (product.status === 2){
            btnText = '上架'
            text = '已下架'
          }
          const status = product.status===1 ? 2 : 1
          const productId = product._id
            return (
              <span>
                <Button 
                  type='primary'
                  onClick={() => { this.updateStatus(productId, status )}}
                >{btnText}</Button>
                <span>{text}</span>
              </span>
            )
        }
      },
      {
        width: 100,
        title: '操作',
        render:product => (
          <span>
            <LinkButton 
              onClick={() => {
                memoryUtils.product = product
                this.props.history.push(`/product/detail/${product._id}`)
              }}
            >
             详情
            </LinkButton>
            <LinkButton 
              onClick={() => {
                this.props.history.push('/product/addupdate', product)
              }}
            >
              修改
            </LinkButton>
          </span>
        )
      },
    ]
  }
  //获取分页信息
  getProducts = async (pageNum) => {
    //保存pageNum
    this.pageNum = pageNum
    //刚进来，显示loading
    this.setState({
      loading: true,
    })
    const { searchType, searchName } = this.state
    let result
    if (searchName && this.isSearch){
      result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchType, searchName })
    }else{
      result = await reqProducts(pageNum, PAGE_SIZE)
    }
    this.setState({
      loading: false,
    })
    //判断
    if(result.status === 0){
      const {total,list} = result.data
      //更新状态
      this.setState({
        products: list,
        total
      })
    }
  }
  //改变上架、下架的状态
  updateStatus = async (productId, status) => {
    console.log(status)
    const result = await reqUpdateStatus(productId, status)
    if (result.status === 0){
      message.success('更新商品状态成功')
      //回到当前页
      this.getProducts(this.pageNum)
    }
  }

  componentWillMount(){
    this.initColumns()
  }

  componentDidMount(){
    this.getProducts(1)
  }
  render() {
    const { products, total, loading, searchType, searchName } = this.state
    const title = (
      <span>
        <Select 
          value={searchType} 
          style={{ width: 200 }}
          onChange={(value) => this.setState({ searchType: value}) }
        >
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input 
          type='text' 
          value={searchName} 
          style={{width:200,margin:'0 20px'}} 
          placeholder='关键字'
          onChange={(event) => this.setState({ searchName: event.target.value })}
        >
        </Input>
        <Button 
          type='primary'
          onClick={() => {
            //保存搜索的标记
            this.isSearch = true
            this.getProducts(this.pageNum)
          } }
        >
          搜索
        </Button>
      </span>
    )
    const extra = (
    <Button 
      type='primary' 
      onClick={() => {
        this.props.history.push('/product/addupdate')
      }}>
      <Icon type='plus'></Icon>
      添加商品
    </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey="_id"
          loading={loading}
          dataSource={products}
          columns={this.columns}
          pagination={{
            pageSize: PAGE_SIZE,
            total,
            onChange:this.getProducts,
            showQuickJumper: true
          }}
        ></Table>
      </Card>
    )
  }
}
