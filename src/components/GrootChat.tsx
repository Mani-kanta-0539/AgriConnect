import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chatWithGroot, speakWithGroot } from '../services/geminiService';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const GROOT_IMAGE_URL = '/data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8QDw8QDxAODxAPDw8ODxAPDw8NEA8QFREXFxYRFRUYHSggGBonHRUVITUhJSkrLi4uFyIzODMtNygtMCsBCgoKDg0OGhAQGi0lHSUtLS8vKy0tLS0tLS01LS0tKystLS0tLSsrLS0rLS01LS0tLS0tLS0tLS0tLS0rLS0tLf/AABEIAKgBLAMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAABAgADBQQGB//EADkQAAIBAwMCBAUBBwMFAQEAAAECAAMRIQQSMQVBIlFhcQYTgZGhMiNCUrHB0fAUYqIzQ3KC4dIV/8QAGgEAAgMBAQAAAAAAAAAAAAAAAQIAAwQFBv/EACoRAAICAQMCBQQDAQAAAAAAAAABAhEDBCExEkEFIlFhcUKBscETMtEj/9oADAMBAAIRAxEAPwD6QvSrSs6NgccT0BXEr2CaVlZV0IwxoSZVU6Xcz0GIQoh/laJ0IxH6IgXjM87qaO1iPKe9qZEx9X0pXv5+csxZmn5hJ474PKQider0TUznjznJNqafBnaoN4bxLyXhAWXiPBugYwUEqaLC0WWCjQqLxqdMEXZlXyGWJ+gmb1nWijQqvu8QXatud5FgB6/2lcsqSYVFszes9Wqj5yUrAUsMR+orYbrHsckfSd3QtTupGxBfcqgnJyL8nnj8zzXT0c02vnfTqPctckBTY++635nf0xhYKOLi/bgg4+xzPNZs05z67fO3sdPHBKKQnRWY/OSoFcmtXQ3sb1VbJt2zj6zu6XXcLU3Y8Qu9jcLTsNo8sAfecmhpFa9bAC1NWWt/5LZj92v95rUUCVdco8Q+ewUNmylUY28uZRlt2y5KkkbWnqXRWyAVBF+y2xOPQdZp1mcJlV2kN5qcbvvicPVde1LTMw2hlXbY2IsRYcd7X+07X6dTpOWprtWptAC4tYjcPY3H2mrHrpwwRjHlfgolp1KbbNZTGE5dFU3J3xg3tz5TpE7uHKsuNTXcwTg4SaY4jiIIwlgpYIwiCOIpBhGEURhFCOIwiCMIAjiGKIwihCIYBDIEMkkkBD0rGceorWxOlnnHWF8zFFGplQrGUajXFROlBfEZ9AG5EsTS5Epi6CvvFzOpnE500eweGZep1LI9jIo9T2I3S3NLW0FZTPIaqjtYibn/APUHBnFrGVszRh6ovcqyVIyDAZY6yozWigBMUmExTGAcmq19KmwV2sxG61icSaTXUqtxTcMVtcWII+8858SofnsR/AMD0Qn+kw31FTTVCUba6ta4yrKQtwR5Tly1s45mn/VM0RwqUfc9Z8S64oEpKbfMuWIwduBb8n7TzNOpeqy3BG3aoYBgpb9R9OOYlXWPWJaoSzFeeLc2AHlF0C3qFlspLADm4GbN/nlMmfK8s2+3Y0YsfSjX6QpCBBmoRWDWN8hCLD6m/rtllCsi06rMNpQXBI5UrkDte5/IlNGi9CqDfAZnDfpUkruYe+CJXV3/ACKqEAXpahR2JdBvU+42E/SZHFWaIrY79DUa5ZgFZK1fcP022ksPvi03NPUDvXYopWpUTb4+SaCIwvjOFz6zE6XWBKu38KGovhKv4MlhzexWbmpqkOQFQK7UWWygbV22IFuMjiJNbstStI5erpvqi4uiaGoat/FvdwUVrHyDPz5TR6XUapR05Ym/yqe85HYXHvcEXiuiEa61zu0/yrk3BG13ufX9oPrLPh8BkLfpICIaRwVANifv2iyW1ES3slDDUdvDtUYgG+GBOfrNITj22FI8BWVb2PiXa/J7ZYTrE7HhT/5yXuc/WLzIsEcRFjidMyDiMIojiKQYQiAQxRhhHEQRhAQcRhFEYQBDDBDAEMkkkBDXqNHQAzkNcESn/W2NhMvSzRaNelSAl059NUuAZfeVsZEaY+v0AqG5muxnDqq9o0G09gSp8nmtZ09k4yJxNcT0Z1KtzODqNNdtxabYZHwzPKC5RisZWYzmIZpRSKYDCYpjAPM9fH7V7c7N3F8bLf3njuouSMcjvwcWFj+J7T4pXaVqYyhU3/esRj3sfxPIVKe70sRcgAdwJwdRGs0vk6OHeCLtLSY8W9Cb23bcD6/0mjp9ONpZeVp78gC4F8H7H1lemfYqgWzuYnBsBm/v/ec2q1aoSOS1u9zbb9hKq2LO562pp6ddCiglaqqoN7BagXsexwReZ1F7UaysLhwT/wCJGHH3DTG0HXXpkH9pYGmWyLMEP45E0NF1Cm9LUKRYNqFaw42MKl8/U/eUuLRcpJmvqNESNynbhaTi4tdmte3HcD/29JoVkD1UII8NKkrXt+os/bvgi/8A8mH0/UlqXn4dzAGwuoDAW/8AUfcTUrVsK4wx3XxewQAg+h8R+8VodM6XrH5lgv6lZDjsV5I4Pn9JqdKdQQLhtwZza1wb3G63GB+BPK6nqPy1qgh7Fsbbt/28D05i9L+LKYLbvmJc43DwW4sSOMLb68wdLI2j2mtFwduQXG37/wBzaQSylVDDcNrjaNrIPCwvziV9zOn4X9a+P2YNb9P3/Q4jiViOJ1WYSwRxEEYRQjiMIgjCAI4jCKIwisIwjCKIwgCMIRFEYQEDJBDAEAJirRJYGXosC33SuyyjU01WwtLzVnJQp9zGqG0oaVlqOkteZ+vpEiO+p2zl1GvBFo0Yu9gNoyKuDOes5PJlld8kzld5uijNJlNSV3ljmVGXIqZIphgMJDM+IaAeg1+VKkc9yBbHne08WaFwp4FgzA/7S39As+gaynupuo5Km3vyJ4vXU/0DFmV+M2Xdb82nL18amn7GzTS8tGdVUikrDzI9LBR29yJwVGwD37knm/v6TsrcIvPLHscjAmTrGG8rcXU7STY8H8TGo2aLovSp2GQccg4ve38p2aKpcgean2ORz6/3nPUp0mRGoqysiWr3dWWoxY+JRYWFtosb5jaI3dLcXNz6Hv8A55RZKthvdHoOn1QtAOAbujh8ixJTm3abVJSxVb3BSsR3wGW4+yj7ieZ0JY0tg8wPsvHp+kT1ej0zMKJT93528mwNiyW++38ymexbDgxuv1TTpNTUZqMAeLqFwx9ri31nmhUBNiQBccWa3+f1mj8aa1wyUf07gXc25INgo9OT9ROLRJpKtNKYWqupJYCqjqUdiy7QUIBAA39zc2luOD6bK5tdVHuvgWu1Oo+lLMaTKteg37tsb09OQbDzM9S3J9zPJ/AYtuRxtqUXawBuCduT7ZU/Uz1Z5PvNnhy80/t+zPq/6xGEcRBHE6ZhHEcSsRxAwjiMIojCKEYRxFEYQMIwhEAhihGEIgEIgIEQwCGQIUqS+m8yPnS+lqrCI4DqRu0aoi13WYp1p7TlfVNfmIsLsZ5Ea+sK7ZhVKmYaldj3nKzTRjx0VSnZazTmYwlohMuSKmwGKYSYpjgAYLyQQgJPIdRoKtcLwBuGeAodXH4Jnr5g9boq1QqR+pVe/GQbc+wmLXRuCfozRpnUqPNCl4CeBY39ksCf+X4mfW6QKhLLVUXtcEZJ87f2vNWqhsVPYMTyPIX+4/MGkqNTIIC3ABvtub3BHPfE5Pwbl7nHS6OyLtUNU3ZZkDdjwcYHM6aHTSpO5SLFVzcEXORbz/tNqh1RbsDu4pOMAHeSCfbiA1g5uMlqlMlTnDKx/kPzE6n3HaRTotDsB5YfP2kr5Lxb8f4Z6Ppng3t4dpsgzYXsD/MGcOnqi6qtrkpUsRfB2m1vQiddJcM4a2adSxAIyxUrf2YSqW5bEz/iXoC1lDkMabH5ivT2/MpMcEbThl8NsZwObXmF034ep0agcOajqRs37aIX/cRm8+h0NT4SptkMLcXawIIPbK/mU7FcMxUEXIW+TgXAB7YJz6RVJpUHa7aD0LRKr/NO1qhADst7Yxex9+fQTuEv0W35V1/g8gMcfzvKFnW8NW0n8HP1r3SLBGAgWXU1nSbMYoEsVTH2xwREbDRXaERjBAQIjiIIwgCOIRFEYQBGEIgEIgIEQwCGQJjbod8rgvLqEsu3xGaJeKTIkSxiZW0hMBjIURhEMsMrMZABBDBCQEEMloQCzK65SzTY/p8dNj5bx4T9xb6zVMo1unFWmyH94Y9CMg/cCV5odcHEfHLpkmeO1dOxGQSQxPOLWv8A3nE9z3FxcD6ZmjXW5YnDIWDDPYAMPsPxM8AA4HKsO3IGD6n+08+9mdRFdU2tznbnjzzOr/UEOCuNpBItYDam3+pnMTcgdsDOb82/nKdR1BEY3IyLG/nzxIQ3ul6lA67icGx7YKkAf8JtrUBdhtsoViAcq18+xFk/nPng6wo3WJyCOPUzs0/xQV4N/wBIyDawW1vtf7xJQb4HjKuT3derZ6bqL8jNuLBjcf0nRS1hyB3GRc2H6gf5Tx6fEBqsL82FrZuTb/8AM9DpBwvf97sbY/GTKnFos6kz0egP7P8A9bD2viWqJz6ci2OOB7DvOlTO3oMfThv13OZqpdWSvQdZaplIMcGa2Zy8NCJWDGBi0EeGLeEQEGEYRRGEgRhGEUQiAgwjCKIwihCI0AhkCefvJeCCaCoN4DJBIQkEMEJARSI8BkAVGLLCIhjEJJBJCQBghkkAYfWentuNannH7VQLkj+Ieft6TzRW3iXs245FmABxn0/E+gTy3xHolo/tUwlRwrp2Dnhh5XyPr6zm6zTc5I/f/TXp830swnAViQf4bH2N5k9R6aHJdWsxzY8E9/zNQgFeLkEqP6fztKnW64xhh9wf6zmo2GJR6HqXICIrE8AVKdz9L3nbQ+D+osyj5GwN/wBx2VaanyJ5vxi00CfER/C1wcAjGJu9I6pWLAXO0FWN89+fsD+IJSa4JFKyuh8PU9NUpJuaqdw3E2Ava5tYcYM9DpaNmFrbnJJ9F87/AHnJRW7g3Jt9c4/PP3m/p0tcnBbt/COyx9Np5Z578LkmbKscduToQWx5S1ZUJYs79JKkcpu9ywR1iCOIrIWCMIgjCKEcQiKIwgCMI4iCOIGEYRhFEYRSDCEQCMBAEIjASKsvWnFbGSPKmCNBNRSCSGSQgskMEICQQwSEFMUiWERSISFcEciLGALJDEq1FUEsQoHJYgASEDMn4nphtK9yBtKOL/7WDW/Er6n8S0KNgA1Qm36bBc97n+k8t1brVXUA3Kimcolj4cZJPc3B+8x6jUwUXFbtmjFilaZnVKuweaki1uQDn8G4+kuFYc3BJz7+0zkrXJDkbTwfX28otRyqEHsQwPk3II9/6es45uTO/d4yTfi/mOJpdKo1KrolG3ibbdjtS4W5W/sD6xvg3pX+p1dIOt6IJd84baLhfXO281fh/o4q6eqCQoqvUqAOpVqdQEcd+CCDzk+8rnOti2MbN/pvTvk2D5q+o22H+0d/f+U0VmfptTqQiUaymo1NArvU2i7DhjnONp3KT97zu0+8puem1IhiCpYVBbswYcjtnOJ0dDrE6xSVeldzJqdM1507LlliypY6zqswFojiViOIoSwRhEEcRWEcRhFEcRWEYRhFEYQBGEYRQJYqxWEdFloWBFlyiVtjpERZcBFAjiVtjo8dBHtBabzKLJGtBaQgLQWjWktIQSSNaS0JBYCI1oCJAFZEUiWERSIxDk6hq1oUnqvwovbux7ATwnUtdVrBqtUjwhSiX8KX9OL5XJzN/wCMjuFKnzc3235PAJ9BPOatgFKgAg+E+xyT9gfxORr9S1LoRoxVGvVmRrKpbwi9yL3OTb/7zHpUyEW/b0BwBJoaV3AN+Tfvkc/mdep3Hdmw7kWsM/S35mU2GeRd7fqJNgBjmdOn0DPv3JUejTFM1XpoxCIMfqIyfWd/TdA1QbrbVJKhiDx3awzwf8tPW9L0tKmhFGo7EfqCL4Wx+k5z9ZTOdcFkIdXJxN1JNHSpPRVnofI1FLcFt+1uhRixHODf3PpN7oLFaNOob1G2K5uAfGRzfn0/GLTA1PT1o0hp6pcafVrUCvVZSErEeBtottt/K8v+GKjNpaSuWqeHAuLUhxxjtbJ7G3mJS4quoujzR65S9RTdbWsM8bjzYfvHgXlHU1qUqBqKTupbqwABumy5YH0YAqQfMRi20U6VG4ZjznwqBx+R/gmhSqUiHQ4Qr4+fHcG9+57xboLMjS69atWtS2hKlILVFv01aD5SqvlggEec6VnmtAyt1CuVUBqIqJTZSbGhUO5FI4O1j9L+k9Oy2Pl3Hscid3QahzThJ7r8HM1WJRqS7jCWLK1lgm9mQcRxEEcRWEcRxEEcRQjCWIsrEupxWFF6UpctOClLwZRJstSECxo0RjFCPeS8qDyFpKJZ5q0FpZaTbNtmcrtBaW7YNslkK7QWlloLSWQrtJaPaC0IBLQWjkQQkEIikSy0SowAJJsACSfICGwHjPiTqIWpUD06bAC1J1/63zFzs5/TYMeLfWeVrs11J4exUC4sGANj62tNHq+u+bqG+XbxVFNuRtJzft5mZVWsAVY3Nm3Hza089NXklI6MYqlsUh7O7Em25sXtcBjiW0qqbdzkkjCUwDZiRjHlOPSm7Nv8R5APFz3mhp6DIrVQ1mUMUI5wp4/GZHsi1I6dTrHqPRo79mnFOlZKeGY28QY9vGHM9R0fV7VsCFVFO1ext+8T/h/nPC09K601qEktc7uTbdkXPncn7iaXS6zXuxYnhQMKXxgD95gLe0rlHbYsi9z0/wAQaipW0RLHZsdKvy2CKGN8sp5vn0744m18G9M+VQpjcrGoWqNywUtdrD0API855nrOnFWgpDkMKlK9IHetyQPG3nm/07979Jrv9E2mBZmSqayNRYqFVgRsqBrXFMk5Hp7xKbjXuPaUrPcVyVJZQfD4d+BwLj2z5+U82dRVdqzJVUftEoNTZWZUCq+eQQTu3X4IW4OZ01OqH5YBIs9Q77G5PqLe/PoZk9ZRwKteigHzKD0q3jJDPa1Goq+l9tu+6VDs4+nVAusDAjZql33OWRl8Lop9Cob6jynr+j1ajUU+aNrrupnN77HKg/W0+fdIptXRKasFqApqKBONzKBTq0yfUhTb1HnPplMAAWNxYWOMzqeHpfyv1ow6tt418liywQLT8O7tcgeZNr/aETr3ZzxxLBKxHEVkLBGEURxFCMJYpiCMIrCXq8sWpOcRxEaGTL/mQF5WIYKGsYGG8WGQhkbYLSSS4rJaAiSSEApEFpJIQAtFtJJCQBEFpJIQAM8z8WdUUKaKN4j/ANS3YWuF/IkkmfVTcce3ctwxTkeCS7O7jyIU+Xnb6Y+85q6AgKOwBPt/hkknJXJuF6cm6owAwD7+Qmwi2YX22UWJOVv395JJGMjm1dyURWsn6ntghTkIB6859J36KlTK2ckKosig7SpNzdPXn7mSSVvgfua3QFUUzVqmkKdMs1vCTdLjfbzsCB7+sr+F641Gpr6jUlQrJ8tEazKqXwme1r39yZJIrWzGvdGzU6Pvq/OoOlOm2yktIJ4WC7i1YWOP1W4zt9ZOp9MapSWppwGrqhanvqCkFWlq9zmwwcBRb2kklKZY0ec6ky6eomrp0nbR6h/2qL4W02pAsxU9gwzY4PpYT2fROpJWQbN43eMCqqoxHBZdpIOeR2vxJJLYycWprlMqcbuL4NnSEA3OQS1x/wAcD2Alj0wLWYMDxbB+o7SST0GNbKVnJk96IssUSSR2KOBLBJJFYRxHEkkQYYRhJJAEYQySQBDDBJAQ/9k=';
const FALLBACK_IMAGE_URL = 'data:image/jpeg;base64,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';

export function GrootChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [imageError, setImageError] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am Groot, your AgriConnect assistant. How can I help you with your farm today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const playAudio = async (base64Data: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      const binaryString = window.atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBuffer = await ctx.decodeAudioData(bytes.buffer);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const response = await chatWithGroot(userMessage, history);
      setMessages(prev => [...prev, { role: 'model', text: response }]);

      if (isSpeechEnabled) {
        const audioData = await speakWithGroot(response);
        if (audioData) {
          await playAudio(audioData);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 lg:bottom-6 right-6 w-16 h-16 bg-emerald-600 dark:bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-all flex items-center justify-center z-50 group border-4 border-white dark:border-stone-800 overflow-hidden"
      >
        <img 
          src={imageError ? FALLBACK_IMAGE_URL : GROOT_IMAGE_URL} 
          onError={() => setImageError(true)}
          alt="Groot" 
          className="w-full h-full object-cover object-top scale-110 group-hover:scale-125 transition-transform"
          referrerPolicy="no-referrer"
        />
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce shadow-sm">
          Groot
        </span>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[380px] h-[500px] bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-emerald-600 dark:bg-emerald-800 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/20 overflow-hidden">
                  <img 
                    src={imageError ? FALLBACK_IMAGE_URL : GROOT_IMAGE_URL} 
                    onError={() => setImageError(true)}
                    alt="Groot" 
                    className="w-full h-full object-cover object-[center_20%] scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="font-bold">Groot</h3>
                  <p className="text-xs text-emerald-100 dark:text-emerald-200">Agri AI Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                  className={`p-2 rounded-full transition-colors ${isSpeechEnabled ? 'bg-white/20' : 'hover:bg-white/10'}`}
                  title={isSpeechEnabled ? "Disable Voice" : "Enable Voice"}
                >
                  {isSpeechEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50 dark:bg-stone-950">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm font-sans ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 dark:bg-emerald-700 text-white rounded-tr-none'
                        : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <div className="prose prose-sm prose-stone dark:prose-invert max-w-none">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-stone-800 p-3 rounded-2xl border border-stone-200 dark:border-stone-700 rounded-tl-none shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Groot anything about farming..."
                  className="flex-1 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-sans"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-emerald-600 dark:bg-emerald-700 text-white rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
