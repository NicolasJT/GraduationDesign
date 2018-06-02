import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Dashboard from '../components/dashboard/Dashboard';
import Management from '../components/management';
import Purchase from '../components/purchase';
import Distribute from '../components/distribute';
import Login from '../components/pages/Login';
import Home from '../components/home';

export default class CRouter extends Component {
    requireAuth = (permission, component) => {
        const { auth } = this.props;
        const { permissions } = auth.data;
        console.log('--', auth);
        if (!permissions || !permissions.includes(permission)){
            console.log('@@@@@@@@@@');
            return <Redirect to = "/login" />;
        } 
        return component;
    };
    render() {
        return (
            <Switch>
                
                <Route exact path="/app/dashboard/index" component = {Dashboard} />
                <Route exact path="/app/management" 
                    component = {
                        props => this.requireAuth('/app/dashboard/index', <Management {...props} />)
                    } 
                />
                <Route exact path="/app/purchase" component = {Purchase} />
                <Route exact path="/app/distribute" component = {Distribute} />
                <Route exact path="/app/home" component = {Home} />
                <Route render={() => <Redirect to="/404" />} />
            </Switch>
        )
    }
}