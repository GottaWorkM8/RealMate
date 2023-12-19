import React from "react";

function Home() {
  return (
    <div className="wrapper flex">
      <div className="h-panel flex flex-col w-1/4 border-r border-secondary-3"></div>
      <div className="h-panel flex flex-col w-1/2 text-text-1">Home</div>
      <div className="h-panel flex flex-col w-1/4 border-l border-secondary-3"></div>
    </div>
  );
}

export default Home;
