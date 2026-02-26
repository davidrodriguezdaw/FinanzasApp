import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeNews = async (title, summary, asset) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza esta noticia para el activo "${asset}":
      Título: ${title}
      Resumen: ${summary}
      
      Determina si es BULLISH, BEARISH o NEUTRAL. Devuelve un porcentaje de confianza (0-100) y un breve impacto estimado.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            impact: { type: Type.STRING },
          },
          required: ['sentiment', 'confidence', 'impact'],
        },
      },
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    return null;
  }
};

export const translateNews = async (title, summary, impact) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Traduce profesionalmente al español de España:
      Título: ${title}
      Resumen: ${summary}
      ${impact ? `Impacto: ${impact}` : ''}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedTitle: { type: Type.STRING },
            translatedSummary: { type: Type.STRING },
            translatedImpact: { type: Type.STRING },
          },
          required: ['translatedTitle', 'translatedSummary'],
        },
      },
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error('Gemini Translation Error:', error);
    return null;
  }
};

export const searchAssetInfo = async (ticker) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Proporciona datos REALES actuales para el ticker ${ticker}. 
      Incluye precio estimado en USD, porcentaje de cambio 24h y una frase de perspectiva estratégica.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            price: { type: Type.NUMBER },
            change: { type: Type.STRING },
            outlook: { type: Type.STRING },
          },
          required: ['price', 'change', 'outlook'],
        },
      },
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error('Gemini Search Error:', error);
    return null;
  }
};

export const fetchAITopicNews = async (topic) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Genera 3 noticias realistas y recientes sobre el activo: ${topic}. Devuelve un array de objetos.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              source: { type: Type.STRING },
              timestamp: { type: Type.STRING },
              asset: { type: Type.STRING },
            },
            required: ['title', 'summary', 'source', 'timestamp', 'asset'],
          },
        },
      },
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error('Gemini News Fetch Error:', error);
    return [];
  }
};

