import { GoogleGenAI, Type, Modality } from "@google/genai";

let _ai: GoogleGenAI | null = null;

// Grok API key as fallback (injected at build time via Vite)
const GROK_API_KEY = process.env.GROK_API_KEY || "";
const GROK_API_URL = "https://api.x.ai/v1/chat/completions";

function getAI(): GoogleGenAI | null {
  if (!_ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Will use Grok API as fallback.");
      return null;
    }
    _ai = new GoogleGenAI({ apiKey });
  }
  return _ai;
}

// Grok fallback: calls the xAI OpenAI-compatible chat completions endpoint
async function grokChat(prompt: string, systemInstruction?: string): Promise<string> {
  const messages: { role: string; content: string }[] = [];
  if (systemInstruction) {
    messages.push({ role: "system", content: systemInstruction });
  }
  messages.push({ role: "user", content: prompt });

  const response = await fetch(GROK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "grok-3-mini-fast",
      messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Grok API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// Helper: try Gemini first, fall back to Grok
async function withGrokFallback(
  geminiCall: () => Promise<string>,
  grokPrompt: string,
  grokSystemInstruction?: string
): Promise<string> {
  const ai = getAI();
  if (ai) {
    try {
      return await geminiCall();
    } catch (err) {
      console.warn("Gemini API failed, falling back to Grok:", err);
    }
  }
  return grokChat(grokPrompt, grokSystemInstruction);
}


export interface CropRecommendation {
  cropName: string;
  reason: string;
  plantingTime: string;
  expectedYield: string;
}

export async function getCropRecommendations(soilType: string, region: string, season: string): Promise<CropRecommendation[]> {
  const prompt = `As an agricultural expert, recommend 3 best crops for a farmer with ${soilType} soil in the ${region} region during the ${season} season. Provide specific reasons, ideal planting time, and expected yield. Respond ONLY with a valid JSON array of objects with keys: cropName, reason, plantingTime, expectedYield.`;

  const resultText = await withGrokFallback(
    async () => {
      const response = await getAI()!.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                cropName: { type: Type.STRING },
                reason: { type: Type.STRING },
                plantingTime: { type: Type.STRING },
                expectedYield: { type: Type.STRING },
              },
              required: ["cropName", "reason", "plantingTime", "expectedYield"],
            },
          },
        },
      });
      return response.text || "[]";
    },
    prompt
  );

  try {
    // Extract JSON array from response (handles markdown code blocks)
    const jsonMatch = resultText.match(/\[[\s\S]*\]/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : resultText);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
}

export async function getPestAdvice(crop: string, symptoms: string): Promise<string> {
  const prompt = `A farmer is reporting the following symptoms on their ${crop} crop: "${symptoms}". What is the likely pest or disease, and what are the recommended organic and chemical treatments? Provide a concise response in markdown.`;

  return withGrokFallback(
    async () => {
      const response = await getAI()!.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text || "Sorry, I couldn't generate advice at this time.";
    },
    prompt
  );
}

export async function chatWithGroot(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]): Promise<string> {
  const systemInstruction = "You are Groot, a friendly and knowledgeable agricultural AI assistant for the AgriConnect platform. Your goal is to help farmers with their queries about crops, pests, weather, and market rates in a supportive and professional manner. Keep your responses concise and helpful. If a user asks something unrelated to agriculture, politely steer them back to farming topics.";

  const ai = getAI();
  if (ai) {
    try {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: { systemInstruction },
        history: history,
      });
      const response = await chat.sendMessage({ message });
      return response.text || "I'm sorry, I'm having trouble connecting right now. How else can I help you with your farm?";
    } catch (err) {
      console.warn("Gemini chat failed, falling back to Grok:", err);
    }
  }

  // Grok fallback: build conversation from history
  const messages: { role: string; content: string }[] = [
    { role: "system", content: systemInstruction },
  ];
  for (const entry of history) {
    messages.push({
      role: entry.role === 'model' ? 'assistant' : 'user',
      content: entry.parts.map(p => p.text).join('\n'),
    });
  }
  messages.push({ role: "user", content: message });

  const response = await fetch(GROK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "grok-3-mini-fast",
      messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    return "I'm sorry, I'm having trouble connecting right now. How else can I help you with your farm?";
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "I'm sorry, I'm having trouble connecting right now. How else can I help you with your farm?";
}

export async function speakWithGroot(text: string): Promise<string | undefined> {
  // TTS is Gemini-only (no Grok equivalent), so we just try Gemini
  const ai = getAI();
  if (!ai) {
    console.warn("Gemini API not available for TTS. Skipping speech generation.");
    return undefined;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (err) {
    console.warn("Gemini TTS failed:", err);
    return undefined;
  }
}

export async function detectCropDisease(imageBase64: string, mimeType: string): Promise<string> {
  const textPrompt = "Analyze this image of a crop. Identify the likely disease or pest problem. Provide a clear 'Problem' section and a 'Solution' section with organic and chemical treatments. Format the response in Markdown.";

  // Try Gemini first (supports image input)
  const ai = getAI();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: {
          parts: [
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType,
              },
            },
            { text: textPrompt },
          ],
        },
      });
      return response.text || "I'm sorry, I couldn't analyze the image at this time.";
    } catch (err) {
      console.warn("Gemini image analysis failed, falling back to Grok:", err);
    }
  }

  // Grok fallback with image via base64 URL in content
  try {
    const response = await fetch(GROK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-2-vision-latest",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${imageBase64}`,
                },
              },
              {
                type: "text",
                text: textPrompt,
              },
            ],
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      return "I'm sorry, I couldn't analyze the image at this time.";
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I'm sorry, I couldn't analyze the image at this time.";
  } catch {
    return "I'm sorry, I couldn't analyze the image at this time.";
  }
}

export async function analyzeSoilAndRecommendCrops(
  data: {
    soilType?: string;
    ph?: string;
    moisture?: string;
    nitrogen?: string;
    phosphorus?: string;
    potassium?: string;
    previousCrop?: string;
    fieldArea?: string;
    imageBase64?: string;
    mimeType?: string;
  }
): Promise<string> {
  const parts: any[] = [];
  let textPrompt: string;

  if (data.imageBase64 && data.mimeType) {
    textPrompt = "Analyze this soil health card. Extract the soil parameters (pH, N, P, K, Moisture, etc.) and provide a detailed soil condition report. Then, recommend the best next crops to plant based on these parameters. Format the response in Markdown with clear headings for 'Soil Condition Analysis' and 'Crop Recommendations'.";
    parts.push({
      inlineData: {
        data: data.imageBase64,
        mimeType: data.mimeType,
      },
    });
    parts.push({ text: textPrompt });
  } else {
    textPrompt = `Analyze the following soil parameters and provide a detailed soil condition report. Then, recommend the best next crops to plant.
      Soil Type: ${data.soilType || 'Not provided'}
      pH: ${data.ph || 'Not provided'}
      Moisture: ${data.moisture ? data.moisture + '%' : 'Not provided'}
      Nitrogen (N): ${data.nitrogen ? data.nitrogen + ' ppm' : 'Not provided'}
      Phosphorus (P): ${data.phosphorus ? data.phosphorus + ' ppm' : 'Not provided'}
      Potassium (K): ${data.potassium ? data.potassium + ' ppm' : 'Not provided'}
      Previous Crop: ${data.previousCrop || 'Not provided'}
      Field Area: ${data.fieldArea || 'Not provided'}
      
      Format the response in Markdown with clear headings for 'Soil Condition Analysis' and 'Crop Recommendations'.`;
    parts.push({ text: textPrompt });
  }

  // Try Gemini first
  const ai = getAI();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts },
      });
      return response.text || "I'm sorry, I couldn't analyze the soil data at this time.";
    } catch (err) {
      console.warn("Gemini soil analysis failed, falling back to Grok:", err);
    }
  }

  // Grok fallback
  if (data.imageBase64 && data.mimeType) {
    // Grok with vision
    try {
      const response = await fetch(GROK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "grok-2-vision-latest",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${data.mimeType};base64,${data.imageBase64}`,
                  },
                },
                { type: "text", text: textPrompt },
              ],
            },
          ],
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result.choices?.[0]?.message?.content || "I'm sorry, I couldn't analyze the soil data at this time.";
      }
    } catch {
      // fall through
    }
  } else {
    return grokChat(textPrompt);
  }

  return "I'm sorry, I couldn't analyze the soil data at this time.";
}

