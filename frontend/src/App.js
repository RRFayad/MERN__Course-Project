import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Users from "./users/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./users/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import AuthContext from "./shared/context/auth-context";

const App = () => {
  const authCtx = useContext(AuthContext);

  return (
    <Router>
      <MainNavigation />
      <main>
        <Switch>
          <Route path="/" exact>
            <Users />
          </Route>
          <Route path="/:userId/places" exact>
            <UserPlaces />
          </Route>
          <Route path="/places/new" exact>
            {authCtx.token && <NewPlace />}
            {!authCtx.token && <Redirect to="/" />}
          </Route>
          <Route path="/places/:placeId" exact>
            <UpdatePlace />
          </Route>
          {!authCtx.token && (
            <Route path="/auth" exact>
              <Auth />
            </Route>
          )}
          <Redirect to="/" />
        </Switch>
      </main>
    </Router>
  );
};

export default App;
