import React, { Component } from 'react'
import {HashRouter,BrowserRouter,Route,Switch} from 'react-router-dom'
import Login from './pages/login/login'
import Admin from './pages/admin/admin'

export default class App extends Component {
    render() {
        return (
            <div>
                <HashRouter>
                    <Switch>
                        <Route path= "/login" component={Login} />
                        <Route path= "/" component={Admin} />
                    </Switch>
                </HashRouter>
            </div>
        )
    }
}
