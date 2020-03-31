import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import New from "./pages/New";

export default function Routes() {
  return (
    <BrowserRouter>
      <Route
        render={({ location }) => (
          <TransitionGroup
            childFactory={child =>
              React.cloneElement(child, {
                classNames: location.state
                  ? location.state.transition
                  : "slide-right",
                timeout: location.state ? location.state.duration : 2000
              })
            }
          >
            <CSSTransition key={location.key}>
              <Switch location={location}>
                <Route path="/" exact component={Home} />
                <Route path="/cadastro" component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/gerenciar" component={Dashboard} />
                <Route path="/novo" component={New} />
                <Route render={() => <div>Not Found</div>} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        )}
      />
    </BrowserRouter>
  );
}
