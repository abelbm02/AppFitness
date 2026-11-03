import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Smartphone, X, Copy, Check, Share2, Wifi } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const IPhoneConnectModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const localIp = '192.168.1.64';
  const port = '5173';
  const networkUrl = `http://${localIp}:${port}`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(networkUrl, {
        width: 260,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      }).then(setQrUrl).catch(console.error);
    }
  }, [isOpen, networkUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(networkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#1c1c1e] border border-white/10 rounded-3xl p-6 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Pasar a mi iPhone</h3>
            <p className="text-xs text-zinc-400">Instálalo en tu iPhone en 3 pasos</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl my-4 shadow-inner">
          {qrUrl ? (
            <img src={qrUrl} alt="QR Code" className="w-56 h-56 rounded-lg" />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-black font-medium">Generando código QR...</div>
          )}
          <span className="text-xs text-zinc-600 mt-2 font-medium">Escanea con la cámara de tu iPhone</span>
        </div>

        <div className="space-y-3 text-sm text-zinc-300 bg-white/5 p-4 rounded-2xl border border-white/5">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
            <p className="text-xs">
              Asegúrate de que tu iPhone está conectado al <strong>mismo Wi-Fi</strong> de tu casa.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
            <p className="text-xs">
              Abre el enlace en <strong>Safari</strong> de tu iPhone.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
            <p className="text-xs">
              Pulsa el botón de <strong>Compartir</strong> <Share2 className="inline w-3 h-3 text-blue-400 mx-0.5" /> en Safari y pulsa <strong>"Añadir a pantalla de inicio"</strong>. ¡Se abrirá como una App nativa!
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
          <div className="flex-1 font-mono text-xs text-blue-400 truncate pl-1">
            {networkUrl}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </div>
    </div>
  );
};
