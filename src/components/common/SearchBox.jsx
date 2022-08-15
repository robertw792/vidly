import React from "react";

const SearchBox = ({ value, onChange }) => {
  return (
    <input
      name="query"
      type="text"
      className="form-control my-3"
      placeholder="Please Type Something..."
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
};

export default SearchBox;
