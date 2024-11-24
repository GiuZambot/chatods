import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Apenas POST é permitido." });
    return;
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    res
      .status(500)
      .json({ error: "API Key do Gemini não configurada no ambiente." });
    return;
  }

  const { prompt } = req.body;
  console.log("prompt", prompt);

  if (!prompt) {
    res.status(400).json({ error: "O campo 'prompt' é obrigatório." });
    return;
  }

  try {
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

    const requestData = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await axios.post(GEMINI_URL, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("API");

    const generatedText =
      response.data?.candidates[0]?.content?.parts[0]?.text ||
      "Não consegui gerar uma resposta.";

    res.status(200).json({ reply: generatedText.trim() });
  } catch (error) {
    console.error("Erro na API Gemini:", error.response?.data || error.message);

    if (error.response?.status === 429) {
      res.status(429).json({
        reply: "Muitos usuários no momento, tente novamente mais tarde.",
      });
    } else {
      res.status(500).json({
        reply:
          "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.",
      });
    }
  }
}
