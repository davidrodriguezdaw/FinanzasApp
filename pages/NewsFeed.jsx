import React, { useState } from 'react';
import { MarketSentiment } from '../types.js';
import { analyzeNews, fetchAITopicNews, translateNews } from '../services/gemini.js';

const NewsFeed = ({ news: initialNews }) => {
  const [news, setNews] = useState(initialNews);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [translatingId, setTranslatingId] = useState(null);
  const [searchTopic, setSearchTopic] = useState('');
  const [searching, setSearching] = useState(false);

  const handleAnalyze = async (item) => {
    setAnalyzingId(item.id);
    const result = await analyzeNews(item.title, item.summary, item.asset);
    if (result) {
      setNews((prev) =>
        prev.map((n) =>
          n.id === item.id
            ? {
                ...n,
                analyzed: true,
                sentiment: result.sentiment,
                confidence: result.confidence,
                impact: result.impact,
              }
            : n,
        ),
      );
    }
    setAnalyzingId(null);
  };

  const handleTranslate = async (item) => {
    if (item.isSpanish) {
      setNews((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isSpanish: false } : n)),
      );
      return;
    }
    if (item.translatedTitle) {
      setNews((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isSpanish: true } : n)),
      );
      return;
    }
    setTranslatingId(item.id);
    const result = await translateNews(item.title, item.summary, item.impact);
    if (result) {
      setNews((prev) =>
        prev.map((n) =>
          n.id === item.id
            ? {
                ...n,
                translatedTitle: result.translatedTitle,
                translatedSummary: result.translatedSummary,
                translatedImpact: result.translatedImpact,
                isSpanish: true,
              }
            : n,
        ),
      );
    }
    setTranslatingId(null);
  };

  const handleSearchNews = async () => {
    if (!searchTopic.trim()) return;
    setSearching(true);
    const aiNews = await fetchAITopicNews(searchTopic);
    const formatted = aiNews.map((n, i) => ({
      ...n,
      id: `ai-${Date.now()}-${i}`,
      analyzed: false,
    }));
    setNews((prev) => [...formatted, ...prev]);
    setSearching(false);
  };

  return (
    <div className="newsfeed-page p-8 space-y-8 max-w-[1000px] mx-auto pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter">
            News <span className="text-primary italic">IA</span>
          </h2>
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-2">
            Monitoreo Global de Sentimiento
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTopic}
            onChange={(e) => setSearchTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchNews()}
            placeholder="Buscar noticias de..."
            className="bg-surface border border-white/10 rounded-xl py-2 px-4 text-xs text-white focus:border-primary/50 outline-none w-48 font-bold uppercase"
          />
          <button
            onClick={handleSearchNews}
            disabled={searching}
            className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all hover:bg-primary/20"
          >
            {searching ? 'Cargando...' : 'Generar'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {news.map((item) => {
          const title = item.isSpanish ? item.translatedTitle : item.title;
          const summary = item.isSpanish ? item.translatedSummary : item.summary;
          const impact = item.isSpanish ? item.translatedImpact || item.impact : item.impact;
          const radius = 40;
          const circum = 2 * Math.PI * radius;
          const offset = circum - ((item.confidence || 0) / 100) * circum;

          return (
            <article
              key={item.id}
              className="bg-surface/60 border border-white/5 rounded-[2.5rem] p-10 glass group relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {item.source}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 uppercase">
                        {item.timestamp}
                      </span>
                    </div>
                    <button
                      onClick={() => handleTranslate(item)}
                      disabled={translatingId === item.id}
                      className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg border transition-all ${
                        item.isSpanish
                          ? 'bg-primary/20 border-primary/40 text-primary'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {translatingId === item.id
                        ? 'Sincronizando...'
                        : item.isSpanish
                        ? 'Original (EN)'
                        : 'Traducir (ES)'}
                    </button>
                  </div>

                  <h3 className="text-2xl font-black text-white italic tracking-tight mb-6 leading-tight group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium italic">
                    "{summary}"
                  </p>

                  <div className="flex flex-wrap items-center gap-6">
                    <div className="px-4 py-1.5 bg-background rounded-xl border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                      Instrumento: <span className="text-white ml-2">{item.asset}</span>
                    </div>

                    {!item.analyzed ? (
                      <button
                        onClick={() => handleAnalyze(item)}
                        disabled={analyzingId === item.id}
                        className="bg-primary/10 text-primary border border-primary/30 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-background transition-all"
                      >
                        {analyzingId === item.id ? 'Analizando...' : 'Analizar con IA'}
                      </button>
                    ) : (
                      <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                        <div
                          className={`px-4 py-1.5 rounded-xl border-2 font-black text-xs uppercase italic tracking-widest flex items-center gap-2 ${
                            item.sentiment === MarketSentiment.BULLISH
                              ? 'bg-primary/5 text-primary border-primary/30'
                              : 'bg-danger/5 text-danger border-danger/30'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {item.sentiment === MarketSentiment.BULLISH
                              ? 'trending_up'
                              : 'trending_down'}
                          </span>
                          {item.sentiment}
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase">
                          Impacto: <span className="text-white italic">{impact}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {item.analyzed && (
                  <div className="lg:w-64 flex flex-col items-center justify-center p-10 bg-background/50 rounded-3xl border border-white/5 animate-in zoom-in duration-700">
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-6 tracking-widest">
                      Confianza IA
                    </p>
                    <div className="relative size-36 flex items-center justify-center">
                      <svg className="size-full transform -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r={radius}
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="transparent"
                          className="text-white/5"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r={radius}
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={circum}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                          className={`transition-all duration-1000 ease-out ${
                            item.sentiment === MarketSentiment.BULLISH
                              ? 'text-primary'
                              : 'text-danger'
                          }`}
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-black text-white italic">
                          {item.confidence}
                        </span>
                        <span className="text-[10px] font-black text-slate-600">%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default NewsFeed;

