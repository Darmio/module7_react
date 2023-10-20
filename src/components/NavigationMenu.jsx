import '../App.css';
import { useContext, useState, useEffect } from "react";
import React from "react";
import { BrowserRouter, Routes, Route, Link, Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Header from '../components/Header';
import { ErrorMsg } from '../components/ErrorMsg';
import Main from '../pages/Main';
import LoginPage from '../pages/LoginPage';
import Home from '../pages/Home';
import { Navigate } from "react-router-dom";
import { AuthContext } from '../services/AuthService';

function NavigationMenu() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [userCredentials, setUserCredentials] = useState({ userName: "guest" });
  const { isAuthorized, token, error } = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState([]);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {

    if (localStorage.getItem('isAuth') !== undefined && localStorage.getItem('isAuth') !== null) {
      if (localStorage.getItem('isAuth') == 'true') {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
      console.log("set=" + isAuth);
    }

  }, []);

  useEffect(() => {
    setShowLoginForm(!isAuth);
  }, [isAuth]);

  return (
    <>
      <BrowserRouter>
        <Header userName={localStorage.getItem('userName')} showLoginForm={(e) => setShowLoginForm(e)}
          setUserCredentials={(e) => setUserCredentials(e)} />


        <LoginPage show={showLoginForm} onHide={() => setShowLoginForm(false)}
          setUserCredentials={(e) => { setUserCredentials(e) }} setIsAuth={(e) => { setIsAuth(e) }} />

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage show={showLoginForm} onHide={() => setShowLoginForm(false)} setUserCredentials={(e) => { setUserCredentials(e) }} setIsAuth={(e) => { setIsAuth(e) }} />} />

          <Route path='/certificates' element={localStorage.getItem('isAuth') === 'true' ? <Main /> : <Navigate to='/login' />} />
        </Routes>

      </BrowserRouter>

      {errorMsg.length ?
        <ErrorMsg errorMessages={errorMsg} onClick={() => setErrorMsg([])} /> : null}
    </>
  )
};

export default NavigationMenu;
