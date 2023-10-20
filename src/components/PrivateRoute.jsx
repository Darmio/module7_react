import React from 'react';
import { useState, useEffect, useMemo, useContext } from 'react';
import {AuthService} from '../services/AuthService';
import { Route } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import {AuthContext} from '../services/AuthService';


const PrivateRoute = ({ element: Component, setErrorMsg, ...props }) => {
  const {isAuthorized, token, error} = useContext(AuthContext);

  return (
 
      <>
    
         ({isAuthorized==true}) ? (
          <Component />
       
        ) : ( 
            {setErrorMsg("User not authorizred")}
            {error="User not authorizred"}

            <Navigate to={{ pathname: '/login', state: { from: props.location } }} replace={true} />
   
        )
        
        </>
  );
};

export default PrivateRoute;