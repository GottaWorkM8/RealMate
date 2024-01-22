import { ArrowPathIcon } from "@heroicons/react/24/solid";
import React from "react";

const LoadIndicator = () => {
  return (
    <div className="flex flex-1 p-4 justify-center">
      <ArrowPathIcon className="h-7 w-7 text-text-1 animate-spin" />
    </div>
  );
};

export default LoadIndicator;
