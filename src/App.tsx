import "./App.css";
import CustomChatBot from "./components/ChatBot";

const App: React.FC = () => {
  return (
    <div>
      <CustomChatBot />
      <div className="info">
        <p>Atividade de Extensão - Cruzeiro do Sul</p>
        <p>Giuliana Zambotto Furlan</p>
        <p>Superior de Tecnologia em Inteligência Artificial</p>
      </div>
    </div>
  );
};

export default App;
