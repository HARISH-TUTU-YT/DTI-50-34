import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  const getModel = () => (genAI as any).getGenerativeModel({ model: "gemini-1.5-flash" });

  // API Routes
  app.post("/api/predict", async (req, res) => {
    try {
      const { symptoms, animalType, language } = req.body;
      const model = getModel();

      const prompt = `
        You are a highly experienced veterinary assistant AI.
        Analysis request:
        - Animal: ${animalType}
        - Symptoms: ${symptoms}
        - Preferred Language: ${language}

        Please provide a detailed report including:
        1. Possible Diseases (ranked by probability with confidence scores)
        2. Priority Level (Low, Medium, High, EMERGENCY)
        3. Immediate First-Aid Steps (if non-critical)
        4. Safety Disclaimer: Emphasize that this is NOT a replacement for a professional veterinarian.

        If the symptoms suggest an emergency (e.g., bleeding, respiratory distress, collapse), mark clearly as EMERGENCY.
        
        Respond in ${language} if possible, otherwise in English.
        Format the response as JSON with keys: "diseases", "severity", "firstAid", "disclaimer", "isEmergency".
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Attempt to parse JSON from Markdown if LLM wraps it
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Failed to parse AI response", raw: text };

      res.json(data);
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to process symptoms" });
    }
  });

  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLanguage } = req.body;
      const model = getModel();
      const prompt = `Translate the following veterinary medical text to ${targetLanguage}: "${text}". Maintain professional tone.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      res.json({ translatedText: response.text() });
    } catch (error) {
      res.status(500).json({ error: "Translation failed" });
    }
  });

  app.get("/api/local-model", (req, res) => {
    // In a real app, this could be fetched from a database or a file
    res.json({
      'fever': { disease: 'Viral Infection', firstAid: 'Shade and fresh water.', severity: 'Medium' },
      'cough': { disease: 'Respiratory Distress', firstAid: 'Isolate animal.', severity: 'Medium' },
      'bleeding': { disease: 'Critical Injury', firstAid: 'Pressure bandage.', severity: 'EMERGENCY' },
      'diarrhea': { disease: 'GI Infection', firstAid: 'Electrolytes.', severity: 'High' },
      'swelling': { disease: 'Inflammation/Edema', firstAid: 'Reduce exercise.', severity: 'Medium' }
    });
  });

  app.get("/api/diet-plans", (req, res) => {
    res.json([
      { animalType: 'Cow', planName: 'Yield Optimizer', description: 'High-protein diet for dairy cows.', nutritionalInfo: '18% Protein, 4% Fat' },
      { animalType: 'Goat', planName: 'Standard Growth', description: 'Balanced forage and grain.', nutritionalInfo: '14% Protein' },
      { animalType: 'Poultry', planName: 'Layer Mix', description: 'Calcium-rich for egg layers.', nutritionalInfo: 'Calcium 3.5%' }
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
