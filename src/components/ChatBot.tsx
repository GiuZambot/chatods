import { CSSProperties, useEffect, useRef, useState } from "react";
import botAvatar from "../assets/fol.png";
import userAvatar from "../assets/user.png";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Olá! O que gostaria de saber sobre sustentabilidade hoje?",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getDisfluency = () => {
    const disfluencies = ["Hum...", "Er...", "Ahn...", "Ééé..."];
    return disfluencies[Math.floor(Math.random() * disfluencies.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const toBody = [...messages, { sender: "user", text: userMessage }];
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setMessages((prev) => [...prev, { sender: "bot", text: getDisfluency() }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: toBody }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: "bot",
          text: data.reply || "Não consegui processar sua solicitação.",
        },
      ]);
    } catch (error) {
      console.error("Erro ao buscar resposta:", error);

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: "bot",
          text:
            "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.",
        },
      ]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>ChatODS</h2>
      </div>

      <div style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageContainer,
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.sender === "bot" && (
              <img src={botAvatar} alt="bot" style={styles.avatar} />
            )}
            <div
              style={{
                ...styles.message,
                backgroundColor: msg.sender === "user" ? "#6b5b95" : "#e0e0e0",
                color: msg.sender === "user" ? "#fff" : "#000",
              }}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && (
              <img src={userAvatar} alt="user" style={styles.avatar} />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escreva sua mensagem..."
        />
        <button style={styles.button} onClick={handleSend}>
          Enviar
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    maxWidth: "min(100%, 500px)",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ccc",
    borderRadius: "8px",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#6b5b95",
    padding: "10px",
    color: "#fff",
    textAlign: "center",
  },
  headerTitle: {
    margin: 0,
    fontSize: "18px",
  },
  chatWindow: {
    flex: 1,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
    maxHeight: "400px",
    minHeight: "400px",
    backgroundColor: "#f5f8fb",
  },
  messageContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },
  message: {
    maxWidth: "70%",
    padding: "10px",
    borderRadius: "15px",
    fontSize: "14px",
  },
  inputContainer: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ccc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    marginRight: "10px",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#6b5b95",
    color: "#fff",
    cursor: "pointer",
  },
};

export default ChatBot;
