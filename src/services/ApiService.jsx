import { AuthContext } from './AuthService';
import { useState, useContext, createContext } from "react";

export const API_URL_CERTIFICATES = "http://localhost:8080/gift_certificates";
export const URL_LOGIN = "http://localhost:8080/auth/login";
export const URL_REFRESH_TOKEN = "http://localhost:8080/auth/login";
export const API_URL_TAGS = "http://localhost:8080/tags";
//const API_URL = 'http://localhost:8080';

export const ApiContext = createContext("");

function ApiService({ children }) {
    const [error, setError] = useState("");
    const { getToken } = useContext(AuthContext);

    const sendPostRequest = async (requestData) => {
        const url = API_URL_CERTIFICATES;
        const token = getToken();

        if (token === null && token === undefined) {
            localStorage.clear();
            return "Incorrect token";
        }

        const requestBody = {
            name: requestData.name,
            description: requestData.description,
            price: parseFloat(requestData.price),
            duration: parseInt(requestData.duration),
            tagsId: []
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                const error = await response.json();
                if (response.status >= 500) {
                    throw new Error("Internal error, contact with administrator!");
                } else {
                    throw new Error("HTTP error " + response.status + " - " + JSON.stringify(error));
                }
            }
            return null;
        } catch (error) {
            return error.message;
        }
    }


    return (
        <ApiContext.Provider value={{ error: error, sendPostRequest }}>
            {children}
        </ApiContext.Provider>
    );
};

export default ApiService;

export const buildUrlRequest = (url, page, limit, searchParams, sortParams) => {
    let resultUrl = url;
    if (page) {
        resultUrl = resultUrl + "?page=" + (page - 1);
    }

    if (limit) {
        resultUrl = resultUrl + "&size=" + limit;
    }

    if (searchParams && searchParams.length > 0) {
        resultUrl = resultUrl + "&" + "part=" + searchParams;
    }

    if (sortParams !== null) {
        sortParams.forEach((value, key) => {
            resultUrl = resultUrl + "&" + "sort=" + key + "," + value;
        });
    };

    return resultUrl;
};

export const getErrors = (error, errors) => {
    if (error.response) {
        if (error.response.status >= 500) {
            errors.push("Server cann't execute request. Write to administrator!");
        } else {
            errors.push(error.response.data.errorMessage);
        }
    } else {
        errors.push(error);
    }
};



