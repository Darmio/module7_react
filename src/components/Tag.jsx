import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { ErrorMsg } from '../components/ErrorMsg';

function Tag(props) {
    const [errorMsgModal, setErrorMsgModal] = useState([]);

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
            }
        }
    }, [localStorage.getItem("errorMsgModal")]);

    return (
        <Modal show={props.show} onHide={() => { props.onHide() }} size="sm"
            centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Tag
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    localStorage.getItem("errorMsgModal") !== undefined && localStorage.getItem("errorMsgModal") !== '[]' &&
                        localStorage.getItem("errorMsgModal") !== null && localStorage.getItem("errorMsgModal").length > 0 ?
                        <ErrorMsg errorMessages={JSON.parse(localStorage.getItem("errorMsgModal"))} onClick={() => { localStorage.removeItem("errorMsgModal"); errorMsgModal.length = 0; }} /> : null}
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Name</label>
                    <input onChange={(e) => { props.tag.name = e.target.value }}
                        type="text"
                        className="form-control"
                        id="title"
                        defaultValue={props.tag.name} />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onSubmit}>Submit</Button>
                <Button onClick={props.onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Tag;
