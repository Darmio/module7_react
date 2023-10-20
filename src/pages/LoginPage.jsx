import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useMemo, useEffect, useContext } from "react";
import { AuthContext } from '../services/AuthService';

function LoginPage(props) {
    //  const [userCred, setUserCred] = useState({email: "", password: ""});
    const [errorMsg, setErrorMsg] = useState([]);
    const [err, setErr] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { isAuthorized, auth, errorLocal, setErrorModal } = useContext(AuthContext);

    useEffect(() => {
        errorMsg.push(errorLocal);
        props.setIsAuth(isAuthorized);
    }, [errorLocal, err, isAuthorized]);

    const onSubmit = (e) => {
        e.preventDefault();

        setErrorMsg([])

        const error = auth(email, password);
        props.setIsAuth(isAuthorized);
        if (!isAuthorized) {
            errorMsg.push(errorLocal);
        } else {
            props.setUserCredentials({ userName: email });
        }
    }

    function onClose() {
        setEmail("");
        setPassword("");
        setErrorModal("");
        localStorage.setItem('isAuth', 'false');
        localStorage.setItem("userName", "guest");
        localStorage.setItem("token", "");
        props.onHide();
    }

    return (
        <Modal show={props.show} onHide={() => { props.onHide() }} size="lg" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Login
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column">
                    <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                        <div className="w-50">
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input defaultValue={email} onInput={(e) => { setEmail(e.target.value) }} type="email"
                                    className="form-control" id="email"
                                    aria-describedby="emailHelp"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input value={password} onInput={(e) => { setPassword(e.target.value) }} type="password"
                                    className="form-control" id="password" />
                            </div>
                            <div className="mb-3" hidden={errorLocal === ""}>
                                <p className="text-danger">{errorLocal}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={(e) => onSubmit(e)}>Submit</Button>
                <Button onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default LoginPage;