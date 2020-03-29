import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import New from "./pages/New";

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/cadastro" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/gerenciar" component={Dashboard} />
        <Route path="/novo" component={New} />
      </Switch>
    </BrowserRouter>
  );
}
