import React, { useContext } from "react";
import { NavLink, useHistory} from "react-router-dom";

import AuthContext from "../context/AuthContext";
import "./MainNavigation.css";

const MainNavigation = (props) => {
   const context = useContext(AuthContext);

  const history=useHistory();
   const handleLogOut=()=>{
    history.push('/')
    context.logout()
  }
  return (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>Full Stack Task</h1>
          </div>
          <nav className="main-navigation__items">
            <ul>
              {!context.token && (
                 <>
                 {history.push('/')}
                 
                   <li>
                     <NavLink to="/login">User Login</NavLink>
                   </li>
     
                   <li>
                     <NavLink to="/registration">Registration</NavLink>
                   </li>
                 </>
              )}
              
              {context.token && (
                <>
                {
               console.log('welcome with token=',context.token)
               }
                 
                 <li>
                   <button onClick={handleLogOut}>Logout</button>
                 </li>
               </>
              )}
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>)
  
};

export default MainNavigation;
