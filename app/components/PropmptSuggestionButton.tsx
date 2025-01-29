import React from "react";

const PropmptSuggestionButton = ({ prompt, onClick }: { prompt: string; onClick: () => void }) => {
  return (
    <button className="propmpt-suggestion-button" onClick={onClick}>
      {prompt}
    </button>
  );
};

export default PropmptSuggestionButton;
