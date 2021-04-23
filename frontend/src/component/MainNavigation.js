import React, { useContext } from "react";
import { NavLink, useHistory, useLocation, useParams } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import "./MainNavigation.css";

const MainNavigation = (props) => {
  const context = useContext(AuthContext);
  const history=useHistory();
  // const location = useLocation();
  // console.log('<<Location---', location);

  // React.useEffect(() => {
  //     console.log("on route change");
  // }, [location.pathname]);

  const handleLogOut=()=>{
    history.push('/')
    localStorage.removeItem('token');
    context.logout()
  }

  const data=JSON.parse(localStorage.getItem('token'))
  console.log('<<<Data---', context.token);
  
  const token= data && data.token;
  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>Full Stack Task</h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          {token==null ? (
            
            <>
            {history.push('/')}
            
              <li>
                <NavLink to="/login">User Login</NavLink>
              </li>

              <li>
                <NavLink to="/registration">Registration</NavLink>
              </li>
            </>
          ) : (
            <>
             {
            console.log('welcome with token=',token)
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
};

export default MainNavigation;
