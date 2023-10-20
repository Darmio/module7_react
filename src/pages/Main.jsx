import { useState, useEffect, useMemo, useContext } from 'react';
import "../css/styles.css";
import "../css/search.css"
import Row from "react-bootstrap/Row";
import CertificatePage from './CertificatePage';
import { ErrorMsg } from '../components/ErrorMsg';
import { SuccessMsg } from '../components/SuccessMsg';
import Pagination from '../components/Pagination';
import Search from '../components/Search';
import { useLogout } from '../hooks/useLogout';
import { buildUrlRequest, getErrors, API_URL_CERTIFICATES } from '../services/ApiService';
import axios from "axios";
import { AuthContext } from '../services/AuthService';
import Certificate from '../components/Certificate';
import { validate } from '../components/Validation';
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from 'react-router-dom';



function Main() {

  const url = "http://localhost:8080/gift_certificates";
  const [currentPage, setCurrentPage] = useState(sessionStorage.currentPage ? sessionStorage.currentPage : 1);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(5);
  const [currentCertificate, setCurrentCertificate] = useState({ name: '', description: '', duration: '', price: '', tags: [] });
  const [searchParams, setSearchParams] = useState("");
  const [sortParams, setSortParams] = useState(new Map());
  const [totalCount, setTotalCount] = useState(21);
  const [certificatesData, setCertificatesData] = useState(null);
  const [errorMsg, setErrorMsg] = useState([]);
  const [successMsg, setSuccessMsg] = useState([]);
  const [changeSort, setChangeSort] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [reloadPage, setReloadPage] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [errorMsgModal, setErrorMsgModal] = useLocalStorage("errorMsgModal", []);

  const { isAuthorized, token, getToken, sendPostRequest, errorLocal } = useContext(AuthContext);
  let navigate = useNavigate();

  const certificates = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * currentRowsPerPage;
    let result = sendGetRequest(currentPage, currentRowsPerPage, searchParams, sortParams);
    setReloadPage(false);
    return result;
  }, [currentPage, currentRowsPerPage, searchParams, sortParams, changeSort, reloadPage == true]);


  useEffect(() => {
    if (localStorage.getItem('isAuth') !== undefined && localStorage.getItem('isAuth') !== null) {
      if (localStorage.getItem('isAuth') === "true") {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    }
  }, []);

  function sendGetRequest(page, rowsPerPage, searchParam, sortParams) {
    let urlRequest = buildUrlRequest(url, page, rowsPerPage, searchParam, sortParams);
    sortParams.forEach((value, key) => console.log("SORT=" + key + ":" + value));
    let promise = axios.get(urlRequest);
    promise.then((result) => {
      setCertificatesData(result.data);
      setTotalCount(result.data.page.totalElements);
    }).catch(error => {
      getErrors(error, errorMsg, "Error get request!");
      setErrorMsg(errorMsg);
    });
  }

  function onCreateSubmit(e) {
    let error = '';
    successMsg.length = 0;
    setErrorMsgModal([]);
    errorMsgModal.length = 0;
    localStorage.removeItem("errorMsgModal");
    error = validate(currentCertificate, errorMsgModal);
    setErrorMsgModal(errorMsgModal);
    localStorage.setItem("errorMsgModal", JSON.stringify(errorMsgModal));
    if (error !== null && error.length > 0) {
      return;
    }

    const tags = [];
    if (currentCertificate.tags) {
      currentCertificate.tags.forEach((tag, i) => tags.push({ 'id': `${tag}`, 'name': '' }));
    }

    const requestBody = {
      name: currentCertificate.name,
      description: currentCertificate.description,
      price: parseFloat(currentCertificate.price),
      duration: parseInt(currentCertificate.duration),
      tags: tags
    };


    sendPostRequest(API_URL_CERTIFICATES, requestBody)
      .then(() => {
        successMsg.push("New cerfiticate " + currentCertificate.name + " create success!");
        setReloadPage(true);
        setShowCreateModal(false);
      })
      .catch(error => {
        errorMsgModal.length = 0;
        let errMsg = error;
        if (!isAuth) {
          navigate("/login");
        } else if (error == undefined) {
          errMsg = "You have not permitions!";
        }
        errorMsg.push(errMsg);
        localStorage.setItem("errorMsgModal", JSON.stringify(errorMsg));
        setErrorMsg(errorMsg);
        setShowCreateModal(false);
      });
  }


  function onCreateBtnClick() {
    errorMsgModal.length = 0;
    setErrorMsgModal([]);
    localStorage.setItem("errorMsgModal", '');
    currentCertificate.name = "";
    currentCertificate.description = "";
    currentCertificate.price = 0;
    currentCertificate.duration = 0;
    currentCertificate.tags = [];
    setShowCreateModal(isAuth);
  }

  function onCloseBtnClick() {
    currentCertificate.name = "";
    currentCertificate.description = "";
    currentCertificate.price = 0;
    currentCertificate.duration = 0;
    currentCertificate.tags = [];
    setErrorMsgModal([]);
    errorMsgModal.length = 0;
    setShowCreateModal(false);
    localStorage.removeItem("errorMsgModal");
  }

  function onSort(param) {
    const tempMap = new Map(sortParams);
    sortParams.clear();
    tempMap.forEach((value, key) => {
      sortParams.set(key, value);
    });
    sortParams.forEach((value, key) => console.log("SORT=" + key + ":" + value));
    setChangeSort(!changeSort);
  }

  function onClearSort() {
    sortParams.clear();
  }

  const clearErrorMsg = () => {
    setErrorMsg([]);
    localStorage.removeItem("errorMsgModal");
  }

  const addSort = (sortKey, sortValue) => {
    sortParams.set(sortKey, sortValue);
  }


  return (<div>
    {errorMsg.length > 0 ?
      <ErrorMsg errorMessages={errorMsg} onClick={() => clearErrorMsg()} /> : null}

    {successMsg.length > 0 ?
      <SuccessMsg successMessages={successMsg} onClick={() => { setSuccessMsg([]); successMsg.length = 0; }} /> : null}
    <Row>
      <div className="outer btn-field">
        <Search className="btn-field inner-search" onClick={(searchParams) => setSearchParams(searchParams)} />
        <div className="inner">
          <label htmlFor="rows-per-page" className="form-label">Rows per page</label>
          <input className="input-numb form-control" onChange={(e) => { setCurrentRowsPerPage(e.target.value) }}
            type="number" min="3" max="20" placeholder="rows per page" id="rows-per-page"
            defaultValue={currentRowsPerPage} />
          <button type="button" className="btn inner" onClick={onSort}>Sort</button>
          <button type="button" className="btn btn-close inner" aria-label="Close" onClick={onClearSort}></button>
          <button type="button" className="btn inner pr-0 pl-3" onClick={onCreateBtnClick}>Create new</button>
        </div>
      </div>
    </Row>

    <Certificate
      title="Create certificate"
      certificate={currentCertificate}
      show={showCreateModal}
      onHide={() => setShowCreateModal(false)}
      onSubmit={onCreateSubmit}
      onClose={onCloseBtnClick}
      error={errorMsgModal}
      successMsg={successMsg}
      setSuccessMsg={(e) => setSuccessMsg(e)}
    />

    <CertificatePage
      data={certificatesData}
      onSortClick={(sortKey, sortValue) => addSort(sortKey, sortValue)}
      setErrorMsg={(e) => setErrorMsg(e)}
      error={errorMsgModal}
      successMsg={successMsg}
      setSuccessMsg={(e) => setSuccessMsg(e)}
      setReloadPage={setReloadPage}
    />
    <Pagination
      className="center"
      currentPage={currentPage}
      totalCount={totalCount}
      pageSize={currentRowsPerPage}
      onPageChange={page => setCurrentPage(page)}
    />
  </div>
  );
};
export default Main;