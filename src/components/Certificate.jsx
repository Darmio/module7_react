import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState, useMemo, useEffect, useContext } from "react";
import { ErrorMsg } from '../components/ErrorMsg';
import TagsSelect from './TagsSelect';
import Tag from './Tag';
import { AuthContext } from '../services/AuthService';
import { API_URL_TAGS } from '../services/ApiService';
import "../css/certificate.css";
import { SuccessMsg } from "./SuccessMsg";
import { useNavigate} from 'react-router-dom';

function Certificate(props) {
    const [isError, setIsError] = useState(false);
    const [tags, setTags] = useState();
    const [firstLoad, setFirstload] = useState(true);
    const [reloadTags, setReloadTags] = useState(false);
    const [errorMsgModal, setErrorMsgModal] = useState([]);
    const [successMsg, setSuccessMsg] = useState([]);
    const [showCreateModalTag, setShowCreateModalTag] = useState(false);
    const [tag, setTag] = useState({ name: '', id: null });
    const [selectedTags, setSelectedTags] = useState([]);
    const { isAuth, sendPostRequest, sendDeleteRequest, errorLocal } = useContext(AuthContext);
  
    let navigate = useNavigate();
    useMemo(() => {
    
    let arr = getTags2();
    arr.forEach((tag,i)=>selectedTags.push(tag));
    setSelectedTags(selectedTags);
    successMsg.length=0;
    setSuccessMsg([]);
    }, []);


    useEffect(() => {
        let arr = getTags2();
        arr.forEach((tag,i)=>selectedTags.push(tag));
        setSelectedTags(selectedTags);
    }, []);


    useEffect(() => {
        if (localStorage.getItem("errorMsgModal")) {
            let err = JSON.parse(localStorage.getItem("errorMsgModal")); 
            if (err !== null && err.length > 0) {
                setErrorMsgModal([]);
                errorMsgModal.length = 0;
                err.forEach((item, i) => errorMsgModal.push(item));
                setErrorMsgModal(errorMsgModal);
            } else {
                setErrorMsgModal([]);
                errorMsgModal.length = 0;
            }
        }

    }, [localStorage.getItem("errorMsgModal")], isError==true);

    function onCreateBtnClick(tag) {
        errorMsgModal.length = 0;
        setTag({ name: "", id: null });
        setShowCreateModalTag(isAuth());
    }

    function onCloseBtnClick(certificate) {
        errorMsgModal.length = 0;
        setShowCreateModalTag(false);
    }

    function changeTags(newTags) {
        setTags(newTags);
        setFirstload(true);
    }

    function onCreateTag() {
        successMsg.length = 0;
        if (tag && tag.name) {
            const requestBody = {
                name: tag.name
            }
            let result = sendPostRequest(`${API_URL_TAGS}`, requestBody)
            .then(() =>
            {  
                successMsg.push("New tag " + tag.name + " create success!");
                setShowCreateModalTag(false);
                setReloadTags(true);
           })
           .catch(error => {  
            errorMsgModal.length = 0;
            let errMsg = error;
            if(!isAuth){
             navigate("/login");
           }else if(error==undefined){
             errMsg = "You have not permitions!";
           }
            errorMsgModal.push(errMsg);   
            localStorage.setItem("errorMsgModal",JSON.stringify(errorMsgModal));
            setIsError(true);
           });
        }else{
            errorMsgModal.push("Name is empty");   
            localStorage.setItem("errorMsgModal",JSON.stringify(errorMsgModal));
        }
    }

    function onCloseTag() {
        errorMsgModal.length = 0;
        successMsg.length = 0;
        setShowCreateModalTag(false);
        localStorage.removeItem("errorMsgModal");
    }


 function onDeleteTag () {
        successMsg.length = 0;
        errorMsgModal.length = 0;
        setIsError(false);
        selectedTags.forEach((label, value) => {
        console.log("Delete "+label.value);
        let result = sendDeleteRequest(`${API_URL_TAGS}/${label.value}`)
        .then(() =>
         {          
         successMsg.push("Tag " + label.name + " with id=" + label.value + " delete success!");
         setReloadTags(true);
        })
        .catch(error => {             
            let errMsg = error;
            if(!isAuth){
             navigate("/login");
           }else if(error==undefined){
             errMsg = "You have not permitions!";
           } 
            errorMsgModal.push("Error delete tad with id " + label.value + ". " + errMsg);  
            localStorage.setItem("errorMsgModal",JSON.stringify(errorMsgModal));
            setIsError(true);
        });
       });
        if(successMsg.length>0){
            setReloadTags(true);
        }      
    }

    function onSubmit(){
        props.certificate.tags = [];
        selectedTags.forEach((label, value) => {
            props.certificate.tags.push(parseInt(label.value));
        });
        setIsError(false) ;
        errorMsgModal.length = 0;
        setErrorMsgModal([]);
        localStorage.setItem("errorMsgModal", '');
        props.onSubmit();
        if(localStorage.getItem("errorMsgModal")){
            setIsError(true); console.log("err");
        }else{
            onClose();
        }

    }

    function getTags(){
        return (props.certificate.tags && props.certificate.tags._embedded && props.certificate.tags._embedded.tags 
        && props.certificate.tags._embedded.tags.length>0) ? props.certificate.tags._embedded.tags : [];
    }
     function getTags2(){
        if(props.certificate.tags && props.certificate.tags._embedded && props.certificate.tags._embedded.tags 
            && props.certificate.tags._embedded.tags.length>0){
                let arr =  props.certificate.tags._embedded.tags;
                let arr2 = [];
                arr.forEach((tag, i)=>arr2.push({ label: ''+`${tag.name}`, value: ''+`${tag.id}` })); 
                return arr2;
            }
            return [];
     }

    function onClose(){
        setTags();
        props.onClose();
    }

    return (
        <Modal show={props.show} onHide={() => { props.onHide() }} size="lg" dialogClassName="modal-edit"
            aria-labelledby="contained-modal-title-vcenter"
            centered backdrop="static">
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            { successMsg.length>0 ?
            <SuccessMsg successMessages={successMsg} onClick={() => {setSuccessMsg([]); successMsg.length = 0}} /> : null }
                {
                     localStorage.getItem("errorMsgModal") !== undefined && localStorage.getItem("errorMsgModal") !== '[]' &&
                         localStorage.getItem("errorMsgModal") !== null && localStorage.getItem("errorMsgModal").length > 0 ?
                         <ErrorMsg errorMessages={localStorage.getItem("errorMsgModal")? JSON.parse(localStorage.getItem("errorMsgModal")) : null} onClick={() => { errorMsgModal.length = 0; setIsError(false);  localStorage.removeItem("errorMsgModal");}} /> : null
                }

                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Name</label>
                    <input onChange={(e) => { props.certificate.name = e.target.value }}
                        type="text"
                        className="form-control"
                        id="title"
                        defaultValue={props.certificate.name} />
                </div>
                {
            
          }
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea onChange={(e) => { props.certificate.description = e.target.value }}
                        className="form-control"
                        id="description"
                        rows="3"
                        defaultValue={props.certificate.description}>
                    </textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="tags" className="form-label">Tags</label>
                    <Row>
                        <Col className="d-flex justify-content-between mb-3 ps-3 pe-3">
                            <div className="row-tag">

                              <TagsSelect tags={tags? tags : getTags()} onClick={(tags) => changeTags(tags)} 
                                reloadTags={reloadTags} setReloadTags = {(e)=>setReloadTags(e)} editable={true} 
                                selected = {selectedTags ? selectedTags : getTags2()} setSelected = {(e)=>{setSelectedTags(e)}}  /> 
                              
                            </div>
                            <Tag
                                show={showCreateModalTag}
                                onHide={() => setShowCreateModalTag(false)}
                                tag={tag}
                                onSubmit={onCreateTag}
                                onClose = {onCloseTag}
                                error={errorMsgModal}
                            />
                            <Button onClick={onCreateBtnClick}>Create</Button>
                            <Button onClick={onDeleteTag}>Delete</Button>
                        </Col>
                    </Row>
                </div>


                <div className="mb-3">
                    <label htmlFor="duration" className="form-label">Duration</label>
                    <input onChange={(e) => { props.certificate.duration = e.target.value }}
                        type="number" min="0"
                        className="form-control"
                        id="duration"
                        defaultValue={props.certificate.duration} />
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input onChange={(e) => { props.certificate.price = e.target.value }}
                        type="number"
                        min="0" step="0.01"
                        className="form-control"
                        id="price"
                        defaultValue={props.certificate.price} />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onSubmit}>Submit</Button>
                <Button onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Certificate;