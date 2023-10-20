import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState } from "react";

function CertificateCreate(props) {

    const [fields, setField] = useState({name:'', description: '', duration: '', price: '', tags:[]});

 return (
        <Modal show={props.show} onHide={()=>{props.onHide()}} size="lg" aria-labelledby="contained-modal-title-vcenter" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                   value =  {"rtetrt"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input onChange={e=>setField({...fields, name: e.target.value})} 
                        type="text" 
                        className="form-control" 
                        id="title" 
                        value={fields.name}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea onChange={e=>setField({...fields, description: e.target.value})}  
                        className="form-control" 
                        id="description" 
                        rows="3" 
                        value={fields.description}>
                    </textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="duration" className="form-label">Duration</label>
                    <input onChange={e=>setField({...fields, duration: e.target.value})}  
                    type="number" min="0" 
                    className="form-control" 
                    id="duration"
                     value={fields.duration}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input onChange={e=>setField({...fields, price: e.target.value})}  
                    type="number" 
                    min="0" step="0.01" 
                    className="form-control" 
                    id="price" 
                    value={fields.price}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="tags" className="form-label">Tags</label>
                    <input onChange={e=>setField({...fields, tags: e.target.value})}  
                    type="text" 
                    className="form-control" 
                    id="tags" 
                    value={fields.tags}/>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onSubmit}>Submit</Button>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CertificateCreate;