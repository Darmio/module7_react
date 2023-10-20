import { IoMdCloseCircle, IoMdClose } from "react-icons/io";
import "../css/error.css";

export const ErrorMsg = (props) => {
    const errorsMsg = [];
   function formatError(err){
    if(err===undefined || err===null || !Array.isArray(err)){
        return "";
    }
    err.forEach((item, i) => errorsMsg.push(<li key={''+i}>{''+item}</li>)); 
   }  
   formatError(props.errorMessages);

    return ( 
        <section className="error-field"> 
            <span>
                <IoMdCloseCircle />
            </span>
            <section>              
            <ul>{errorsMsg}</ul>
            </section>
            <span className="close-error" onClick={() => props.onClick()}>
                <IoMdClose />
            </span>
        </section>
    )
}