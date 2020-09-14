import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AddOrder from "./components/AddOrder";
import Order from "./components/Order";
import OrdersList from "./components/OrdersList";

import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'

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
              Add
            </Link>
          </li>
          <li className="nav-item">
            <AmplifySignOut />
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/Orders"]} component={OrdersList} />
          <Route exact path="/add" component={AddOrder} />
          <Route path="/Orders/:id" component={Order} />
        </Switch>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
