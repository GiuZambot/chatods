/// <reference types="vite/client" />

declare module "react-simple-chatbot" {
  import React from "react";

  export interface Step {
    id: string;
    message?: string;
    user?: boolean;
    trigger?: string | ((input: string) => string);
    end?: boolean;
    component?: JSX.Element;
    waitAction?: true;
    asMessage?: boolean;
  }

  export interface ChatBotProps {
    steps: Step[];
    theme?: Record<string, string>;
  }

  const ChatBot: React.FC<ChatBotProps>;
  export default ChatBot;
}
