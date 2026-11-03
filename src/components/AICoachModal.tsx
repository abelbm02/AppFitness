import React, { useState, useRef, useEffect } from 'react';
import { AgentContext, AIAgentService, ChatMessage } from '../services/aiAgent';
import { Sparkles, Send, X, Bot, User, Trash2, ArrowRight } from 'lucide-react';
import { triggerHaptic } from '../services/haptics';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  context: AgentContext;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm-init',
    sender: 'assistant',
    text: `¡Hola! Soy tu **Coach IA Científico**. Estoy conectado en tiempo real a tus métricas (peso, calorías, proteína y volumen de entreno). ¿En qué te ayudo hoy?`,
    timestamp: 'Ahora',
    category: 'science'
  }
];

export const AICoachModal: React.FC<Props> = ({ isOpen, onClose, context }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('fitscience_ai_chat');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_MESSAGES;
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const dynamicSuggestions = AIAgentService.getDynamicSuggestions(context);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('fitscience_ai_chat', JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend: string) => {
    const query = textToSend.trim();
    if (!query) return;

    triggerHaptic('light');
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await AIAgentService.askAgent(query, context);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: 'Hubo un error al procesar tu consulta. Inténtalo de nuevo.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
      triggerHaptic('medium');
    }
  };

  const handleClearHistory = () => {
    triggerHaptic('warning');
    if (confirm('¿Vaciar la conversación con el Coach IA?')) {
      setMessages(INITIAL_MESSAGES);
      localStorage.removeItem('fitscience_ai_chat');
    }
  };

  const renderFormattedText = (text: string) => {
    // Basic formatting for **bold** and bullet points
    return text.split('\n').map((line, idx) => {
      let formattedLine = line;
      // Bold tags
      const parts = formattedLine.split(/(\*\*.*?\*\*)/g);

      return (
        <p key={idx} className={line.startsWith('* ') || line.startsWith('- ') ? 'pl-2 my-0.5' : 'my-1'}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="text-white font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg h-[88vh] sm:h-[650px] bg-[#18181a] border border-white/10 sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Cabecera del Agente IA */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#202024] border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-blue-600 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-500/20">
                <div className="w-full h-full bg-[#18181a] rounded-[14px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-300" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#18181a] rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black tracking-tight text-white">Coach IA Científico</h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  AGENTE
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                En vivo • Conectado a tus {context.user.weight}kg & objetivo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearHistory}
              title="Borrar chat"
              className="p-2 text-zinc-400 hover:text-red-400 rounded-full hover:bg-white/5 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mensajes del Chat con Scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-end justify-end'}`}
              >
                {isBot && (
                  <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] text-xs leading-relaxed p-3.5 rounded-2xl ${
                    isBot
                      ? 'bg-[#222226] text-zinc-200 border border-white/5 rounded-tl-sm shadow-sm'
                      : 'bg-blue-600 text-white rounded-br-sm shadow-md shadow-blue-600/20 font-medium'
                  }`}
                >
                  {renderFormattedText(msg.text)}
                  <div className={`text-[9px] mt-1.5 opacity-60 text-right ${isBot ? 'text-zinc-400' : 'text-blue-100'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-7 h-7 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0 mb-1">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2.5 items-center">
              <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              </div>
              <div className="bg-[#222226] text-zinc-400 text-xs px-4 py-2.5 rounded-2xl border border-white/5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] ml-1 text-zinc-400">Analizando métricas...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Píldoras de Preguntas Frecuentes Sugeridas */}
        <div className="px-4 py-2 border-t border-white/5 bg-[#1b1b1e] overflow-x-auto scrollbar-none flex gap-2 flex-shrink-0">
          {dynamicSuggestions.map((sug, sIdx) => (
            <button
              key={sIdx}
              onClick={() => handleSendMessage(sug)}
              className="text-[11px] bg-white/5 hover:bg-purple-950/40 hover:border-purple-500/30 text-zinc-300 hover:text-purple-200 border border-white/10 px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 active:scale-95"
            >
              <span>{sug}</span>
              <ArrowRight className="w-3 h-3 text-purple-400 flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Input y Botón de Envío */}
        <div className="p-3 bg-[#1e1e22] border-t border-white/10 flex items-center gap-2 flex-shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(input);
              }
            }}
            placeholder="Pregunta a tu Coach (ej: ¿Qué ceno hoy? o ¿Debo subir peso?)..."
            className="flex-1 bg-black/50 text-white placeholder-zinc-500 text-xs px-4 py-3 rounded-2xl border border-white/10 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={() => handleSendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-40 text-white flex items-center justify-center transition shadow-lg shadow-purple-600/20 active:scale-95 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

