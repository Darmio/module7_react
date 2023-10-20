import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Link } from "react-router-dom";
import LoginPage from '../pages/LoginPage';

export function useLogout() {
   // const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
     
return <>   <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage show={true} onHide={()=>{}} setUserCredentials={()=>{}} setIsAuth = {()=>{}}/>} />
      </Routes>
    </BrowserRouter>  </>
    //return <LoginPage show={true} onHide={()=>{}} setUserCredentials={()=>{}} setIsAuth = {()=>{}}/>
  }
        
    return logout;
}