import { createContext, useState } from "react";
import { isTokenExpired } from "../hooks/isTokenExpired";
import { URL_REFRESH_TOKEN, URL_LOGIN, API_URL_CERTIFICATES } from "./ApiService";
import axios from "axios";
import { buildUrlRequest } from '../services/ApiService';

export const AuthContext = createContext("");

function AuthService({ children }) {

    const [token, setToken] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [error, setError] = useState("");
    const [errorLocal, setErrorLocal] = useState("");
    const [resultData, setResultData] = useState(null);

    const headers = {
        'Content-Type': 'application/json'
    };

    const setErrorModal = (err) => {
        setErrorLocal(err);
    }


    const getTokenByRefreshToken = async (refreshToken) => {
        try {
            const response = await fetch(`${URL_REFRESH_TOKEN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken
                })
            });

            if (!response.ok) {
                throw new Error('Refresh token failed');
            }

            const data = await response.json();
            setIsAuthorized(true);
            setToken(data.token);
            localStorage.setItem('token', data.token);
            localStorage.setItem('refresh_token', data.refresh_token);
        } catch (err) {
            setError('Refresh token failed');
            localStorage.clear();
            return;
        }
    }

    const getToken = async () => {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refresh_token');

        if (isTokenExpired(token)) {
            if (!isTokenExpired(refreshToken)) {
                await getTokenByRefreshToken(refreshToken);
                return localStorage.getItem('token');
            } else {
                setError('refresh token expired, need to re-login');
                localStorage.clear();
                return null;
            }
        }
        return token;
    }

    const auth = (email, password) => {
        axios.post(URL_LOGIN, {
            email: email,
            password: password
        }, { headers })
            .then((response) => {
                if (response.status != 200) {
                    if (response.status == 404 || response.status == 401) {
                        throw new Error('Inccorrect login or password');
                    } else {
                        throw new Error('Error authorization!');
                    }
                }
                setIsAuthorized(true);
                setToken(response.data.token);
                localStorage.setItem('isAuth', 'true');
                localStorage.setItem('userName', email);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refresh_token', response.data.refresh_token);
                setErrorLocal('');
                return null;
            })
            .catch((error) => {
                localStorage.clear();
                localStorage.setItem('isAuth', 'false');
                setIsAuthorized(false);
                setErrorLocal("Error " + error.message);
                return error;
            });
    }


    const sendGetRequest = async (url, page, rowsPerPage, searchParam, sortParams, resultData) => {
        let urlRequest = buildUrlRequest(url, page, rowsPerPage, searchParam, sortParams);
        let promise = axios.get(urlRequest);
        promise.then((result) => {
            if (result.data && result.data._embedded) {
                setResultData(result.data._embedded);
                localStorage.setItem(resultData, JSON.stringify(result.data._embedded));
            }

            return null;
        }).catch(error => {
            setErrorLocal(error.message);
            return error.message;
        });
    }


    const sendPostRequest = async (url, requestBody) => {
        return await new Promise((resolve, reject) => {
            const token = getToken();

            if (token === null && token === undefined) {
                clearAuthorization();
                return "Incorrect token";
            }

            const promise = axios.post(url,
                JSON.stringify(requestBody), {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            },

            );
            promise.then((response) => {
                if (response.status !== 201) {
                    throwError(response);
                }
            })
                .then(() => resolve(true))
                .catch(
                    error => { reject(error.response.data.errorMessage) }
                );
        });
    }

    const sendPatchRequest = async (url, requestData) => {
        return await new Promise((resolve, reject) => {

            const token = getToken();

            if (token === null && token === undefined) {
                clearAuthorization();
                return "Incorrect token";
            }

            const requestBody = {
                name: requestData.name,
                description: requestData.description,
                price: parseFloat(requestData.price),
                duration: parseInt(requestData.duration),
                tagsId: requestData.tags
            };
            const promise = axios.patch(url,
                JSON.stringify(requestBody),
                {
                    headers:
                    {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }

            );
            promise.then((response) => {
                if (response.status !== 200) {
                    throwError(response);
                }
            })
                .then(() => resolve(true))
                .catch(
                    error => reject(error.response.data.errorMessage)
                );
        });
    }

    const clearAuthorization = () => {
        localStorage.clear();
        setIsAuthorized(false);
    }

    const sendDeleteRequest = async (url) => {
        return await new Promise((resolve, reject) => {
            const token = getToken();

            if (token === null && token === undefined) {
                clearAuthorization();
                return "Incorrect token";
            }

            let promise = axios.delete(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            promise.then((response) => {
                if (response.status != 204) {
                    throwError(response);
                }
            })
                .then(() => resolve(true))
                .catch(
                    error => {
                        reject(error.response.data.errorMessage);
                    }
                );


        });
    }

    function throwError(response) {
        console.log("status " + response.status); console.log("isAuthorized " + isAuthorized);
        if (response.status === 401) {
            clearAuthorization();
            throw new Error("User not authorize or have not permition!");
        } else if (response.status >= 500) {
            throw new Error("Internal error, contact with administrator!");
        } else {
            const err = '';
            try {
                err = response.json();
            } catch (error) {
                err = '';
            }
            throw new Error("Error " + response.status + " - " + err ? JSON.stringify(err.message) : "");
        }
    }

    const isAuth = () => {
        if (localStorage.getItem('isAuth') !== undefined && localStorage.getItem('isAuth') !== null) {
            if (localStorage.getItem('isAuth') === "true") {
                return true;
            }
        }
        return false;
    }

    return (
        <AuthContext.Provider value={{
            isAuthorized: isAuthorized, token: token, error: error, errorLocal: errorLocal, resultData: resultData,
            setErrorModal, auth, isAuth, getToken, sendPostRequest, sendGetRequest, sendDeleteRequest, sendPatchRequest
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthService;
