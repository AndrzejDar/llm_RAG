"use client";

import Image from "next/Image";

import { useChat } from "ai/react";
import { Message } from "ai";
import LoadingBubble from "./components/LoadingBubble";
import PropmptSuggestionsRow from "./components/PropmptSuggestionsRow";
import Bubble from "./components/Bubble";

const Home = () => {
  const { input, handleInputChange, handleSubmit, append, isLoading, messages } = useChat();
  const noMessages = !messages || messages.length === 0;

  const handlePropmptSelect = (text: string) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      content: text,
      role: "user",
    };
    append(msg);
  };

  return (
    <main>
      <Image src={""} width={"250"} alt={"logo"} />
      <section className={noMessages ? "" : " populated"}>
        {noMessages ? (
          <>
            <p className="starter-text">starter test</p>
            <br />
            <PropmptSuggestionsRow onClick={handlePropmptSelect} />
          </>
        ) : (
          <>
            {messages.map((msg, index) => (
              <Bubble key={`message-${index}`} msg={msg} />
            ))}
            {isLoading && <LoadingBubble />}
          </>
        )}
      </section>
      <form onSubmit={handleSubmit}>
        <input className="question-box" onChange={handleInputChange} value={input} placeholder="Ask smth" />
        <input type="submit" />
      </form>
    </main>
  );
};

export default Home;
