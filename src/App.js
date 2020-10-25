import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AddOrder from "./components/Order/AddOrder";
import Order from "./components/Order/Order";
import OrdersList from "./components/Order/OrdersList";

import AddTemplate from "./components/Template/AddTemplate";
import Template from "./components/Template/Template";
import TemplatesList from "./components/Template/TemplatesList";

import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/Orders" className="navbar-brand">
          Mailing Orders
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/Orders"} className="nav-link">
              Orders
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/add"} className="nav-link">
              Add order
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/Templates"} className="nav-link">
              Templates
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/addTemplate"} className="nav-link">
              Add template
            </Link>
          </li>

        </div>
        <div className="navbar-brand">
          Hello {Auth.user.username} 
          </div>
        <div>
        <AmplifySignOut />

        </div>
      </nav>

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/Orders"]} component={OrdersList} />
          <Route exact path="/add" component={AddOrder} />
          <Route path="/Orders/:id" component={Order} />
          <Route exact path={["/", "/Templates"]} component={TemplatesList} />
          <Route exact path="/addTemplate" component={AddTemplate} />
          {/* <Route exact path="/upload" component={Upload} /> */}
          <Route path="/Templates/:id" component={Template} />

        </Switch>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
