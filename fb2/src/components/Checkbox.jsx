import React from "react";
import PropTypes from "prop-types";

const Checkbox = ({ label, checked, disabled, required }) => {
  return (
    <div className="inline-flex items-center">
      <label className="relative flex items-center px-2 rounded-full cursor-pointer">
        <input
          type="checkbox"
          className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-md border border-secondary2 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-secondary2 before:opacity-0 before:transition-opacity checked:border-primary1 checked:bg-primary1 checked:before:bg-primary1 hover:before:opacity-10"
          checked={checked}
          disabled={disabled}
          required={required}
        />
        <div className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            stroke="currentColor"
            stroke-width="1"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
      </label>
      <label className="mt-px text-sm font-light font-body text-text1 cursor-pointer select-none">
        {label}
      </label>
    </div>
  );
};

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

export default Checkbox;
