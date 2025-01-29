import React from "react";
import PropmptSuggestionButton from "./PropmptSuggestionButton";

const PropmptSuggestionsRow = ({ onClick }: { onClick: (text: string) => void }) => {
  const prompts = ["1", "2", "3", "4"];

  return (
    <div className="prompt-suggestion-row">
      {prompts.map((prompt, index) => (
        <PropmptSuggestionButton key={index} prompt={prompt} onClick={() => onClick(prompt)} />
      ))}
    </div>
  );
};

export default PropmptSuggestionsRow;
