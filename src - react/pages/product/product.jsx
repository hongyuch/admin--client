import React, { Component } from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'

import ProductHome from './product-home'
import ProductDetails from './product-details'
import ProductAddUpDate from './product-add-update'

import './product.less'

export default class Product extends Component {
    render() {
        return (
            <Switch>
                <Route path='/product' component={ProductHome} exact />
                <Route path='/product/detail/:id' component={ProductDetails} />
                <Route path='/product/addupdate' component={ProductAddUpDate} />
                <Redirect to='product' />
            </Switch>
        )
    }
}