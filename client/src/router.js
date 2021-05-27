import React from 'react';
import { BrowserRouter, Switch, Route } from  'react-router-dom';
import Login from './pages/LoginPage.js';
import CustomerHomePage from './pages/homepage.js';
import CustomerMain from './pages/CustomerMain.js';
import Homepage2 from './pages/HomePage2.js';
import CustomerRate from './pages/CustomerRate.js';
import CustomerProfile from './pages/CustomerProfile.js';
import VendorPark from './pages/VendorPark.js';
// import VendorOrders from './pages/VendorOrders';

class Router extends React.Component{
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={Login}></Route>
                    <Route path="/customer" exact component={CustomerHomePage}></Route>
                    <Route path="/menue" exact component={CustomerMain}></Route>
                    <Route path="/homepage" exact component={Homepage2}></Route>
                    <Route path="/rate" exact component={CustomerRate}></Route>
                    <Route path="/vendor" exact component={VendorPark}></Route>
                    <Route path="/profile" exact component={CustomerProfile}></Route>
                    {/* <Route path="/orders" exact component={VendorOrders}></Route> */}

                </Switch>
            </BrowserRouter>
        )
    }
}

export default Router;
