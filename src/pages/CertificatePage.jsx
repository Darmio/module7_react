import { useState, useEffect, useContext } from 'react';
import btnDown from '../img/arrow-down-short.svg';
import btnUp from '../img/arrow-up-short.svg';
import Certificate from '../components/Certificate';
import Button from "react-bootstrap/Button";
import { API_URL_CERTIFICATES, URL_UPDATE_CERTIFICATE } from '../services/ApiService';
import { AuthContext } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';


export const CertificatePage = (props) => {
    const [sortParams, setSortParams] = useState(new Map());
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentCertificate, setCurrentCertificate] = useState({ name: '', description: '', duration: '', price: '', tags: [] });
    const [isAuth, setIsAuth] = useState(false);
    const [errorMsg, setErrorMsg] = useState([]);
    const [successMsg, setSuccessMsg] = useState([]);
    const { sendPatchRequest, sendDeleteRequest, isAuthorized } = useContext(AuthContext);
    let navigate = useNavigate();

    useEffect(() => {

        if (localStorage.getItem('isAuth') !== undefined && localStorage.getItem('isAuth') !== null) {
            if (localStorage.getItem('isAuth') == 'true') {
                setIsAuth(true);
            } else {
                setIsAuth(false);
            }
        }

    }, []);



    function onEditBtnClick(certificate) {
        setShowEditModal(isAuth);
        setCurrentCertificate(certificate);
    }

    function onDeleteBtnClick(item) {
        props.setReloadPage(false);
        props.setSuccessMsg([]);
        props.setErrorMsg([]);
        let result = sendDeleteRequest(`${API_URL_CERTIFICATES}/${item.id}`)
            .then(() => {
                successMsg.push("Certificate " + currentCertificate.name + "  with id=" + item.id + " delete success!");
                setSuccessMsg(props.successMessages);
                props.setSuccessMsg(successMsg);
                props.setReloadPage(true);
            }).catch(error => {
                errorMsg.length = 0;
                let errMsg = error;
                if (!isAuth) {
                    navigate("/login");
                } else if (error == undefined) {
                    errMsg = "You have not permitions!";
                }
                errorMsg.push("Error delete certificate " + item.name + " with id " + item.id + ". " + errMsg);
                localStorage.setItem("errorMsgModal", JSON.stringify(errorMsg));
                props.setErrorMsg(errorMsg);
            });
    }

    function setBtnSort(sortField) {
        var dateBtnSort = document.getElementById(sortField);
        let order = sortParams.get(sortField);
        if (order == null) {
            order = true;
        }

        order = !order;
        if (order) {
            dateBtnSort.src = btnUp;
        } else {
            dateBtnSort.src = btnDown;
        }

        sortParams.set(sortField, order);
        props.onSortClick(sortField, order ? "asc" : "desc");
    }

    function onSubmitEdit() {
        props.setErrorMsg([]);
        props.setSuccessMsg([]);
        props.setReloadPage(false);
        setErrorMsg([]);
        errorMsg.length = 0;
        let url = `${API_URL_CERTIFICATES}/${currentCertificate.id}`;
        let result = sendPatchRequest(url, currentCertificate)
            .then(() => {
                successMsg.push("Certificate " + currentCertificate.name + "  with id=" + currentCertificate.id + " edit success!");
                props.setSuccessMsg(successMsg);
                props.setReloadPage(true);
                setShowEditModal(false);
            })
            .catch(error => {
                errorMsg.length = 0;
                let errMsg = error;
                if (!isAuth) {
                    navigate("/login");
                } else if (error == undefined) {
                    errMsg = "You have not permitions!";
                }

                errorMsg.push("Error edit certificate " + currentCertificate.name + " with id " + currentCertificate.id + ". " + errMsg);
                localStorage.setItem("errorMsgModal", JSON.stringify(errorMsg));
                props.setErrorMsg(errorMsg);
            });

    }

    function onCloseEditModal() {
        setShowEditModal(false);
    }

    function onCloseEditModal() {
        localStorage.removeItem("errorMsgModal");
        setShowEditModal(false);
    }

    function getTagsStr(item) {
        let tagsStr = null;
        if (item.tags && item.tags.length > 0) {
            tagsStr = item.tags.map(tag => tag.name).toString();
        } else if (item.tags._embedded && item.tags._embedded.tags && item.tags._embedded.tags.length > 0) {
            tagsStr = item.tags._embedded.tags.map(tag => tag.name).toString();
        }
        return tagsStr;
    }

    return (
        <div className="col-12">
            <Certificate
                title="Edit certificate"
                certificate={currentCertificate}
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                onSubmit={onSubmitEdit}
                onClose={onCloseEditModal}
                error={errorMsg}
                successMsg={successMsg}
            />

            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th
                            onClick={() => setBtnSort('createDate')}
                            className="clickable">
                            <div
                                className="header-wrapper" >
                                <div className="sorting-icons">
                                    <img id="createDate" src={btnUp} alt="up"
                                    />
                                </div>
                                <span>Date</span>
                            </div>
                        </th>
                        <th
                            onClick={() => setBtnSort('name')}
                            className="clickable">
                            <div className="header-wrapper">
                                <div className="sorting-icons">
                                    <img id="name" src={btnUp} alt="up" />
                                </div>
                                <span>Name</span>
                            </div>
                        </th>
                        <th scope="col">Description</th>
                        <th scope="col">Duration</th>
                        <th scope="col">Price</th>
                        <th scope="col">Tags</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    {console.log("data " + props.data)}
                    {props.data && props.data._embedded && props.data._embedded.giftCertificates && props.data._embedded.giftCertificates.length > 0 ?
                        (
                            props.data._embedded.giftCertificates
                                .map(item => (
                                    <tr className="tableRow" key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{new Date(item.createDate).toLocaleString()}</td>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.duration}</td>
                                        <td>{item.price}</td>
                                        <td>{getTagsStr(item)}</td>
                                        <td>
                                            <Button variant="link" onClick={() => onEditBtnClick(item)}>Edit</Button>
                                            <button type="button" onClick={() => onEditBtnClick(item)} className="btn text-dark">
                                            </button>
                                        </td>
                                        <td>
                                            <Button variant="link" onClick={() => onDeleteBtnClick(item)}>Delete</Button>
                                            <button type="button" onClick={onDeleteBtnClick} className="btn text-dark link"
                                                data-certificate-id={item.id}>
                                                <i className="bi-x-lg"></i>
                                            </button>
                                        </td>

                                    </tr>
                                )
                                )
                        ) : (
                            <tr>
                                <td colSpan="6">No certificates found.</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
};

export default CertificatePage;