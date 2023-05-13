import React from "react";
import styled from "styled-components";
import "./Search.css";

const SearchBoxStyled = styled.div`
  .search-box {
    background-color: var(--f-mkcy-f);
    border: 1px solid #DDD;
    border-radius: 40px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.2s ease;
    width: 300px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    padding: 10px;
    position: relative;
  }
  .search-box:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const Search = () => {
  return (
    <SearchBoxStyled>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search"
          style={{
            border: "none",
            background: "transparent",
            outline: "none",
            fontSize: "16px",
            width: "90%",
            position: "relative",
            zIndex: "100",
          }}
        />
        <div className="circle-12">
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{"color":"#fff","cursor":"pointer","display":"block","fill":"none","height":"12px","width":"12px","stroke":"currentColor","stroke-width":"5.333333333333333","overflow":"visible"}} aria-hidden="true" role="presentation" focusable="false"><g fill="none"><path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path></g></svg>
      </div>
      </div>
    </SearchBoxStyled>
  );
};

export default Search;
