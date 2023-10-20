import { IoMdCloseCircle, IoMdClose } from "react-icons/io";
import "../css/success.css";

export const SuccessMsg = (props) => {
    const successMsg = [];
   function formatError(msg){
    msg.forEach((item, i) => successMsg.push(<li key={''+i}>{''+item}</li>)); 
   }  
   formatError(props.successMessages);

    return ( 
        <section className="success-field">
            <span>
                <IoMdCloseCircle />
            </span>
            <section>           
            <ul>{successMsg}</ul>
            </section>
            <span className="close-success" onClick={() => props.onClick()}>
                <IoMdClose />
            </span>
        </section>
    )
}