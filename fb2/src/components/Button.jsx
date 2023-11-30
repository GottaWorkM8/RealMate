import React from "react";
import PropTypes from "prop-types";

const Button = ({ type, label, disabled }) => {
  return (
    <button
      type={type}
      className="middle none center rounded-lg bg-primary1 w-full py-3 px-6 font-body font-bold text-white shadow-md shadow-primary1/20 transition-all hover:shadow-lg hover:shadow-primary1/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      disabled={disabled}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default Button;
