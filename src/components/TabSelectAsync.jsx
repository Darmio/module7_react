
import AsyncSelect from 'react-select/async';
import React, { useState, useContext, useCallback, useRef } from "react";
import { API_URL_TAGS } from '../services/ApiService';
import { AuthContext } from '../services/AuthService';
import { useEffect } from "react";
import axios from "axios";

function TabSelectAsync(props) {
  const [inputValue, setValue] = useState();
  const [selectedOption, setSelectedOption] = useState([])
  const [options, setOptions] = useState([]);
  const { sendGetRequest, errorLocal, resultData } = useContext(AuthContext);


  useEffect(() => {
    loadOptions();
    props.setReloadTags(false);
    if (props.tags && props.tags.length > 0) {
      props.tags.forEach((tag, i) => props.selected.push({ label: '' + `${tag.name}`, value: '' + `${tag.id}` }));
    }
  }, [])


  const init = () => {
    if (props.tags && props.tags.length > 0) {
      selectedOption.length = 0;
      props.tags.forEach((tag, i) => selectedOption.push({ label: '' + `${tag.name}`, value: '' + `${tag.id}` }));
      props.tags.forEach((tag, i) => handleChange({ label: '' + `${tag.name}`, value: '' + `${tag.id}` }));
    }
  }



  useEffect(() => {
    loadOptions();
  }, [props.reloadTags === true])

  const handleInputChange = value => {
    handleChange({ label: '' + `${value.name}`, value: '' + `${value.id}` });
  };

  // handle selection
  const handleChange = value => {
    props.selected.push(value);
  }

  const fill = useCallback(async () => {
    let url = `${API_URL_TAGS}`;
    sendGetRequest(url, 1, 40, null, null, "tags");
    let tags = await JSON.parse(localStorage.getItem("tags"));
    if (tags && Array.isArray(tags.tags)) {
      options.length = 0;
      tags.tags.forEach((tag, i) => options.push({ label: '' + `${tag.name}`, value: '' + `${tag.id}` }));
    };
  }, []);

  // load options using API call
  const loadOptions = async () => {
    let url = `${API_URL_TAGS}`;
    return axios.get(url)
      .then((result) => {
        options.length = 0; console.log("RELOAD");
        result.data._embedded.tags.forEach((tag, i) => options.push({ label: '' + `${tag.name}`, value: '' + `${tag.id}` }));
        return options;
      })
  };

  const fillSelected = () => {
    props.selected.length = 0;
    if (props.tags && props.tags.length > 0) {
      props.tags.forEach((tag, i) => props.selected.push({ label: '' + `${tag.name}`, value: '' + `${tag.id}` }));
      props.setSelected(props.selected);
    }
  };

  return (
    <>
      {fillSelected()}

      <pre>Input Value: "{props.selected.map((itw) => `${itw.label}, ${itw.value}`).join(',')}"</pre>

      <AsyncSelect
        isMulti
        cacheOptions
        defaultOptions
        value={props.selected.forEach((item) => {
          return {
            value: item.value,
            label: item.label,
          };
        })}
        getOptionLabel={e => e.label}
        getOptionValue={e => e.value}
        loadOptions={loadOptions}
        onChange={handleChange}
      />
    </>
  );
}

export default TabSelectAsync;