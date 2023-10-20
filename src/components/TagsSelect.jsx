import React, { useState, useContext, useCallback, useRef } from "react";
import { MultiSelect } from "react-multi-select-component";
import "../css/multi-select.css";
import {API_URL_TAGS} from '../services/ApiService';
import {AuthContext} from '../services/AuthService';
import { useEffect } from "react";

function TagsSelect(props) {
    const {sendGetRequest, errorLocal, resultData} = useContext(AuthContext);
    const [options, setOptions] = useState([]);
    const ref = useRef();

useEffect(()=>{
  fill();
  props.setReloadTags(false);
  props.selected.length = 0;
  if(props.tags && props.tags.length>0){
  props.tags.forEach((tag, i)=>props.selected.push({ label: ''+`${tag.name}`, value: ''+`${tag.id}` }));
  }
}, [])

const fill = useCallback(async()=> {
  let url = `${API_URL_TAGS}`;
  sendGetRequest(url,1,40,null,null,"tags"); 
  let tags = await JSON.parse(localStorage.getItem("tags"));
    if(tags && Array.isArray(tags.tags)){
      options.length = 0;
      tags.tags.forEach((tag, i) => options.push( { label: ''+`${tag.name}`, value: ''+`${tag.id}` } ));    
      };
       props.setReloadTags(false); 
}, [])


useEffect(() => {
  fill()
}, [fill, props.reloadTags===true])


  function getTags() {
    let url = `${API_URL_TAGS}`;
    sendGetRequest(url,1,40,null,null,"tags");  
 }

 function onChange(e){

 }

 function onSelectedHandle(e){
   console.log("WWWWWgfghd");
 }
  
  return (
    <>
      <MultiSelect 
        ref={ref}
        options={options}
        value={props.selected}
        onChange={props.setSelected}
        labelledBy={"Select tags"}
        isCreatable={true}
        className="w-full md:w-18rem"
        onClick = {onSelectedHandle}
        loadOptions={onChange}
      />
</>
  
  );
};

export default TagsSelect;