
import { useState } from "react";
import "../css/search.css"

export const Search = (props) => {
    const [searchParams, setSearchParams] = useState("");
    return (
       
        <div className="inner-search"> 
        
            <input id="search" type={"text"} className="form-control" placeholder="Search..." value={searchParams} onChange={e => setSearchParams(e.target.value)} />
            <button type="button"  className="btn inner-search-btn" onClick={() => props.onClick(searchParams)}>Search</button>
 
        </div>

    );
};
export default Search;