import React from "react";
import PropTypes from "prop-types";

const Input = ({ type, label, disabled, required }) => {
  return (
    <div className="relative h-10 w-full flex items-center">
      <input
        type={type}
        className="peer h-full w-full rounded-[7px] bg-primary3 border border-secondary2 border-t-transparent px-3 py-2.5 font-sans text-sm font-normal text-text1 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-secondary2 placeholder-shown:border-t-secondary2 focus:border-2 focus:border-primary1 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-secondary3"
        placeholder=""
        disabled={disabled}
        required={required}
      />
      <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none font-body text-[11px] font-normal leading-tight text-secondary2 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-secondary2 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-secondary2 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-secondary2 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-primary1 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-primary1 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-primary1 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-secondary2">
        {label}
      </label>
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

export default Input;
