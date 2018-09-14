import React, { Component } from 'react';
import './App.css';
import App from './App';
import TableColumn from './TableColumn';
import TableColumnResize from './TableColumnResize';
import Menu from './Menu';
import {
    BrowserRouter as Router,Route,Redirect,HashRouter
}from "react-router-dom";
class RouteDom extends Component {
    render() {
        return (
            <HashRouter>
                <div>
                    <Route path="/" component={Menu} exact/>
                    <Route path="/sort" component={App} exact/>
                    <Route path="/table" component={TableColumn} exact/>
                    <Route path="/table-resize" component={TableColumnResize} exact/>
                </div>
            </HashRouter>
        );
    }
}

export default RouteDom;
