import React from "react";
import Markdown from "react-markdown";
import ReactMarkdown from "react-markdown";

const SummeryBox = ({ summery }) => {
  console.log(summery);
  return (
    <div className="h-[60vh] overflow-auto">
      <div className="text-base/8">
        <Markdown>{summery}</Markdown>
      </div>
    </div>
  );
};

export default SummeryBox;
