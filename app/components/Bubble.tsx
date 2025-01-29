import { Message } from "ai";
import React from "react";

const Bubble = ({ msg }: { msg: Message }) => {
  const { content, role } = msg;

  return <div className={`${role} bubble`}>{content}</div>;
};

export default Bubble;
