import React, { createContext, useContext, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, useLocation } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserRegistration from "./pages/UserRegistration";
import MainNavigation from "./component/MainNavigation";
import Welcome from "./pages/Welcome";
import { useAuth } from "./hooks/auth-hook";
import AuthContext from "./context/AuthContext";


function App() {
  const data=JSON.parse(localStorage.getItem('token'))
  const [state, setstate] = useState({
    token: null,
    userName: null,
    expiration:null
  });
 
  const login = (token, userId, userName) => {
    setstate({ token: token, userId: userId, userName: userName });
    
  };

  const logout = () => {
    setstate({ token: null, userId: null, userName: null });
  };
  let routes;
  if (state.token) {
    routes = (
      <Switch>
        <Route path="/welcome" component={Welcome} />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" component={UserLogin} exact />
        <Route path="/login" component={UserLogin} />
        <Route path="/registration" component={UserRegistration} />
      </Switch>
    );
  }
  console.log('<<<Appp---');
  return (
    <div className="App">
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: state.token,
              userName:state.userName,
              expiration:state.expiration,
              login: login,
              logout: logout,
            }}
          >
            <MainNavigation />
            <main className="main-content"> 
           {routes}
  </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    </div>
  );
}

export default App;
