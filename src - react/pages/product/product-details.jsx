import React, { Component } from 'react'
import {Card,Icon,List} from 'antd'

import LinkButton from '../../components/link-button'
import { reqProduct, reqCategory } from '../../api'
import memoryUtils from '../../untils/memoryUtils'
import { BASE_IMG } from '../../untils/constants'

const Item = List.Item

export default class ProductDetails extends Component {
  state = {
    product:{},
    categoryName:''
  }
  //异步获取商品信息
  getProduct = async () => {
    // 如果状态中的product没有数据, 根据param参数发请求获取
    const product = this.state.product
    if (!product._id){
      const productId = this.props.match.params.id
      const result = await reqProduct(productId)
      if (result.status === 0){
        const product = result.data
        //因为页面需要商品分类，因此得到对象后获取分类显示
        this.getCategory(product.categoryId)
        //更新状态
        this.setState({product})
      }else{// 有商品对象
        const categoryId = this.state.product.categoryId
        this.getCategory(categoryId)
      }
    }
    
  }
  //
  getCategory = async (categoryId) => {
    const result = await reqCategory(categoryId)
    if (result.status === 0){
      const categoryName = result.data.name
      //更新状态
      this.setState({ categoryName})
    }
  }
  //从内存中读取product
  componentWillMount(){
    const product = memoryUtils.product
    if (product._id){
      this.setState({ product})
    }
  }
  componentDidMount(){
    this.getProduct()
  }
  render() {
    const { product,categoryName } = this.state
    const title = (
      <span>
        <LinkButton onClick={() => {this.props.history.goBack()}}>
          <Icon type="arrow-left"></Icon>
        </LinkButton>
        <span>商品详情</span>
      </span>
    )
    return (
      <Card title={title}>
        <List className='product-detail'>
          <Item>
            <span className='product-detail-left'>商品名称:</span>
            <span>{product.name}</span>
          </Item>
          <Item>
            <span className='product-detail-left'>商品描述:</span>
            <span>{product.desc}</span>
          </Item>
          <Item>
            <span className='product-detail-left'>商品价格:</span>
            <span>{product.price}</span>
          </Item>
          <Item>
            <span className='product-detail-left'>商品分类:</span>
            <span>{categoryName}</span>
          </Item>
          <Item>
            <span className='product-detail-left'>商品图片:</span>
            {
              product.imgs && product.imgs.map(img => (
                <img className='product-detail-img' key={product._id} src={BASE_IMG + img} alt="img"/>
              ))
            }
          </Item>
          <Item>
            <span className='product-detail-left'>商品详情:</span>
            <span dangerouslySetInnerHTML={{ __html: product.detail }}></span>
          </Item>
        </List>
      </Card>
    )
  }
}
