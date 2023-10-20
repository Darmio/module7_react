import "../css/home.css";
import { useState, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { ErrorMsg } from '../components/ErrorMsg';


function Home() {
    const [errorMsg, setErrorMsg] = useState([]);
    return (
        <div className="bg">
            {errorMsg.length > 0 ?
                <ErrorMsg errorMessages={errorMsg} onClick={() => setErrorMsg([])} /> : null}
        </div>

    );
};

export default Home;