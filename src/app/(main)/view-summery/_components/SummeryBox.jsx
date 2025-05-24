import React from "react";
import Markdown from "react-markdown";


const SummeryBox = ({ summery }) => {

  return (
    <div className="h-[60vh] overflow-auto">
      <div className="text-base/8">
        <Markdown>{summery}</Markdown>
      </div>
    </div>
  );
};

export default SummeryBox;
