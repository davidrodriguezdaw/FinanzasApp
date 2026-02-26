import { GoogleGenAI, Type } from '@google/genai';

export const fetchAssets = async () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents:
        'URGENTE: Proporciona los precios REALES ACTUALES de mercado para BTC, ETH, NVDA, AAPL, TSLA, AMZN, MSFT y GOOGL en USD. Incluye el porcentaje de cambio en las últimas 24h. Formato: JSON array de objetos con symbol, name, price (number), change24h (number).',
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              symbol: { type: Type.STRING },
              name: { type: Type.STRING },
              price: { type: Type.NUMBER },
              change24h: { type: Type.NUMBER },
            },
            required: ['symbol', 'name', 'price', 'change24h'],
          },
        },
      },
    });

    const data = JSON.parse(response.text || '[]');
    return data.map((item, index) => ({
      ...item,
      id: String(index + 1),
      icon: item.symbol.toLowerCase() === 'btc' ? 'currency_bitcoin' : 'monitoring',
    }));
  } catch (error) {
    console.error('Error fetching live assets:', error);
    return [
      { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 65420.1, change24h: 1.5, icon: 'currency_bitcoin' },
      { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3512.45, change24h: -0.2, icon: 'monitoring' },
      { id: '3', name: 'NVIDIA', symbol: 'NVDA', price: 924.15, change24h: 3.2, icon: 'memory' },
    ];
  }
};

export const fetchNews = async () => {
  return [
    {
      id: 'n1',
      title: 'NVIDIA hits new all-time high as AI chip demand surges globally',
      summary:
        'Market analysts point to unprecedented orders from hyperscalers for the new Blackwell architecture.',
      source: 'Financial Times',
      timestamp: '5m ago',
      asset: 'NVIDIA',
      analyzed: false,
    },
    {
      id: 'n2',
      title: 'Bitcoin institutional inflows reach record $2.4B in weekly volume',
      summary:
        'Spot ETFs continue to drive massive liquidity into the primary digital asset, stabilizing the $65k support level.',
      source: 'CoinDesk',
      timestamp: '45m ago',
      asset: 'Bitcoin',
      analyzed: false,
    },
    {
      id: 'n3',
      title: 'Apple announces new AI-integrated features for upcoming OS release',
      summary:
        'Tim Cook emphasizes "privacy-first" AI as the differentiator in the crowded generative AI market.',
      source: 'TechCrunch',
      timestamp: '2h ago',
      asset: 'Apple',
      analyzed: false,
    },
  ];
};

