//创建store对象
import {createStore,applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import reducer from './reducer'

export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))