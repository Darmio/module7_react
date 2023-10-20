
import React, { useState, useContext, useCallback } from "react";
import Select from "react-select";
import { API_URL_TAGS } from '../services/ApiService';
import { AuthContext } from '../services/AuthService';
import { useEffect } from "react";

function TagsSelectSimple(props) {
  const { sendGetRequest, errorLocal, resultData } = useContext(AuthContext);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fill();
    props.setReloadTags(false);
    props.selected.length = 0;
    if (props.tags && props.tags.length > 0) {
      props.tags.forEach((tag, i) => props.selected.push({ label: '' + `${tag.name}`, value: '' + `${tag.id}` }));
      props.setSelected(props.selected);
      onChange(props.selected);
    }
  }, [])

  const fillSelected = () => {
    if (props.firstLoad) {
      console.log("LOADADD");
      props.selected.length = 0;
      if (props.tags && props.tags.length > 0) {
        props.tags.forEach((tag, i) => props.selected.push({ label: '' + `${tag.name}`, value: '' + `${tag.id}` }));
        props.setSelected(props.selected);
      }
      props.setFirstLoad(false);
    }
  }

  const fill = useCallback(async () => {
    let url = `${API_URL_TAGS}`; console.log("REFRESG");
    sendGetRequest(url, 1, 40, null, null, "tags");
    let tags = await JSON.parse(localStorage.getItem("tags"));
    if (tags && Array.isArray(tags.tags)) {
      options.length = 0;
      tags.tags.forEach((tag, i) => options.push({ label: '' + `${tag.name}`, value: '' + `${tag.id}` }));
    };
    props.setReloadTags(false);
  }, [])

  useEffect(() => {
    fill()
  }, [fill, props.reloadTags === true])

  const onChange = (e) => {
    props.setSelected(e);
  }
  return (
    <>

      {
        fillSelected()

      }
      <Select
        isMulti
        options={options}
        value={props.selected}
        onChange={onChange}
      />
    </>
  );
}
export default TagsSelectSimple;

