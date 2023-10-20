import './App.css';
import {useState} from "react";
import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import AuthService from './services/AuthService';
import NavigationMenu from './components/NavigationMenu';

function App() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [userCredentials, setUserCredentials] = useState({userName: "guest"});

  return (
    
  <AuthService>
    <NavigationMenu/>
  </AuthService>
  )
};

export default App;
