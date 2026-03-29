import { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  Thermometer,
  Droplets,
  Waves,
  Power,
  RefreshCw,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Wifi,
  X,
  Edit3,
  Plus,
  Trash2,
  Sun,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { rtdb } from '../lib/firebase';
import { ref, onValue, set, get } from 'firebase/database';

// 3D Chip Visual Anchor
const Chip3D = () => {
  return (
    <div className="absolute top-8 right-8 w-32 h-32 hidden md:flex items-center justify-center pointer-events-none z-0" style={{ perspective: '800px' }}>
      <motion.div
        animate={{
          rotateY: [0, 15, 0, -15, 0],
          rotateX: [45, 50, 45, 40, 45],
          y: [0, -10, 0, 10, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-20 h-20"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(45deg)' }}
      >
        {/* Chip Base */}
        <div className="absolute inset-0 bg-stone-800 dark:bg-stone-900 rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.5)] border-2 border-stone-700 flex items-center justify-center" style={{ transform: 'translateZ(0px)' }}>
          <div className="w-12 h-12 border border-stone-600 rounded flex items-center justify-center">
            <Cpu className="w-6 h-6 text-[#86EFAC]" />
          </div>
        </div>

        {/* Pins */}
        {[...Array(4)].map((_, i) => (
          <div key={`top-${i}`} className="absolute -top-2 w-2 h-4 bg-yellow-600 rounded-t-sm" style={{ left: `${20 + i * 20}%`, transform: 'translateZ(-2px)' }} />
        ))}
        {[...Array(4)].map((_, i) => (
          <div key={`bottom-${i}`} className="absolute -bottom-2 w-2 h-4 bg-yellow-600 rounded-b-sm" style={{ left: `${20 + i * 20}%`, transform: 'translateZ(-2px)' }} />
        ))}
        {[...Array(4)].map((_, i) => (
          <div key={`left-${i}`} className="absolute -left-2 w-4 h-2 bg-yellow-600 rounded-l-sm" style={{ top: `${20 + i * 20}%`, transform: 'translateZ(-2px)' }} />
        ))}
        {[...Array(4)].map((_, i) => (
          <div key={`right-${i}`} className="absolute -right-2 w-4 h-2 bg-yellow-600 rounded-r-sm" style={{ top: `${20 + i * 20}%`, transform: 'translateZ(-2px)' }} />
        ))}

        {/* Glowing Core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#86EFAC] rounded-full blur-xl opacity-50" style={{ transform: 'translateZ(10px)' }} />
      </motion.div>
    </div>
  );
};

interface IoTData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  nutrients: number;
  sunIntensity: number;
  motorStatus: boolean;
}

interface RangeConfig {
  id: string;
  label: string;
  minVal: number;
  maxVal: number;
  color: string;
}

interface SensorConfig {
  min: number;
  max: number;
  ranges: RangeConfig[];
  autoTurnOnBelow?: number;
  autoTurnOffAbove?: number;
}

type AllThresholds = Record<string, SensorConfig>;

const defaultThresholds: AllThresholds = {
  temperature: {
    min: 0, max: 50,
    ranges: [
      { id: 't1', label: 'Cold', minVal: 0, maxVal: 18, color: '#3b82f6' },
      { id: 't2', label: 'Good', minVal: 18, maxVal: 28, color: '#10b981' },
      { id: 't3', label: 'Hot', minVal: 28, maxVal: 50, color: '#ef4444' },
    ]
  },
  humidity: {
    min: 0, max: 100,
    ranges: [
      { id: 'h1', label: 'Dry', minVal: 0, maxVal: 40, color: '#f59e0b' },
      { id: 'h2', label: 'Good', minVal: 40, maxVal: 60, color: '#10b981' },
      { id: 'h3', label: 'Humid', minVal: 60, maxVal: 100, color: '#3b82f6' },
    ]
  },
  soilMoisture: {
    min: 0, max: 100,
    autoTurnOnBelow: 40,
    autoTurnOffAbove: 70,
    ranges: [
      { id: 's1', label: 'Dry (Needs Water)', minVal: 0, maxVal: 40, color: '#f59e0b' },
      { id: 's2', label: 'Good', minVal: 40, maxVal: 70, color: '#10b981' },
      { id: 's3', label: 'Too Wet', minVal: 70, maxVal: 100, color: '#3b82f6' },
    ]
  },
  nutrients: {
    min: 0, max: 5,
    ranges: [
      { id: 'n1', label: 'Low', minVal: 0, maxVal: 1.5, color: '#f59e0b' },
      { id: 'n2', label: 'Good', minVal: 1.5, maxVal: 2.5, color: '#10b981' },
      { id: 'n3', label: 'High', minVal: 2.5, maxVal: 5, color: '#ef4444' },
    ]
  },
  sunIntensity: {
    min: 0, max: 100,
    ranges: [
      { id: 'l1', label: 'Dark', minVal: 0, maxVal: 30, color: '#64748b' },
      { id: 'l2', label: 'Cloudy', minVal: 30, maxVal: 70, color: '#fbbf24' },
      { id: 'l3', label: 'Sunny', minVal: 70, maxVal: 100, color: '#f59e0b' },
    ]
  }
};

const SemiCircleGauge = ({
  value,
  config,
  unit,
  onEdit
}: {
  value: number;
  config: SensorConfig;
  unit: string;
  onEdit: () => void;
}) => {
  const percentage = Math.min(Math.max((value - config.min) / (config.max - config.min), 0), 1);

  // Find matching range
  const currentRange = config.ranges.find(r => value >= r.minVal && value <= r.maxVal)
    || config.ranges[config.ranges.length - 1]
    || { label: 'Unknown', color: '#9ca3af' };

  const arcLength = 125.66; // Math.PI * 40
  const strokeDashoffset = arcLength - percentage * arcLength;

  return (
    <div className="flex flex-col items-center relative w-full pt-2">
      <button onClick={onEdit} className="absolute -top-2 -right-2 p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-colors z-10">
        <Edit3 className="w-4 h-4" />
      </button>

      <div className="relative w-full flex justify-center mt-2">
        <svg className="w-40 h-24" viewBox="0 0 100 55">
          <path
            d="M 10 45 A 40 40 0 0 1 90 45"
            fill="none"
            stroke="#f5f5f4"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 10 45 A 40 40 0 0 1 90 45"
            fill="none"
            stroke={currentRange.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute bottom-0 flex flex-col items-center">
          <span className="text-3xl font-bold text-stone-900 dark:text-stone-100">{value.toFixed(1)}</span>
          <span className="text-xs font-medium text-stone-400">{unit}</span>
        </div>
      </div>
      <div
        className="mt-3 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-stone-50 dark:bg-stone-800"
        style={{ color: currentRange.color }}
      >
        {currentRange.label}
      </div>
    </div>
  );
};

function EditThresholdsModal({
  metricKey,
  config,
  onSave,
  onClose
}: {
  metricKey: string;
  config: SensorConfig;
  onSave: (newConfig: SensorConfig) => void;
  onClose: () => void;
}) {
  const [localConfig, setLocalConfig] = useState<SensorConfig>(JSON.parse(JSON.stringify(config)));

  const addRange = () => {
    setLocalConfig(prev => ({
      ...prev,
      ranges: [...prev.ranges, { id: Math.random().toString(), label: 'New Range', minVal: 0, maxVal: 100, color: '#10b981' }]
    }));
  };

  const updateRange = (id: string, field: keyof RangeConfig, value: any) => {
    setLocalConfig(prev => ({
      ...prev,
      ranges: prev.ranges.map(r => r.id === id ? { ...r, [field]: value } : r)
    }));
  };

  const removeRange = (id: string) => {
    setLocalConfig(prev => ({
      ...prev,
      ranges: prev.ranges.filter(r => r.id !== id)
    }));
  };

  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white dark:bg-stone-900 rounded-3xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 capitalize">
            Edit {metricKey.replace(/([A-Z])/g, ' $1').trim()} Settings
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Auto Motor Settings (only for soil moisture) */}
          {metricKey === 'soilMoisture' && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 space-y-3">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-400 text-sm flex items-center gap-2">
                <Power className="w-4 h-4" /> Auto-Irrigation Triggers
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-emerald-800 dark:text-emerald-500 mb-1">Turn Motor ON Below (%)</label>
                  <input
                    type="number"
                    value={localConfig.autoTurnOnBelow}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, autoTurnOnBelow: Number(e.target.value) }))}
                    className="w-full bg-white dark:bg-stone-800 border border-emerald-200 dark:border-emerald-900/50 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-emerald-800 dark:text-emerald-500 mb-1">Turn Motor OFF Above (%)</label>
                  <input
                    type="number"
                    value={localConfig.autoTurnOffAbove}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, autoTurnOffAbove: Number(e.target.value) }))}
                    className="w-full bg-white dark:bg-stone-800 border border-emerald-200 dark:border-emerald-900/50 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-stone-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Ranges */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Status Ranges</h4>
              <button
                onClick={addRange}
                className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Range
              </button>
            </div>

            <div className="space-y-3">
              {localConfig.ranges.map((range) => (
                <div key={range.id} className="flex items-center gap-3 bg-stone-50 dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Label</label>
                    <input
                      type="text"
                      value={range.label}
                      onChange={(e) => updateRange(range.id, 'label', e.target.value)}
                      className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-stone-100"
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Min</label>
                    <input
                      type="number"
                      value={range.minVal}
                      onChange={(e) => updateRange(range.id, 'minVal', Number(e.target.value))}
                      className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-stone-100"
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Max</label>
                    <input
                      type="number"
                      value={range.maxVal}
                      onChange={(e) => updateRange(range.id, 'maxVal', Number(e.target.value))}
                      className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-stone-100"
                    />
                  </div>
                  <div className="w-16">
                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Color</label>
                    <input
                      type="color"
                      value={range.color}
                      onChange={(e) => updateRange(range.id, 'color', e.target.value)}
                      className="w-full h-8 p-0 border-0 rounded-lg cursor-pointer bg-transparent"
                    />
                  </div>
                  <div className="pt-4">
                    <button
                      onClick={() => removeRange(range.id)}
                      className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              onClick={() => onSave(localConfig)}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function IoTDashboard() {
  const { t } = useLanguage();
  const [data, setData] = useState<IoTData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [thresholds, setThresholds] = useState<AllThresholds>(defaultThresholds);
  const [editingMetric, setEditingMetric] = useState<keyof AllThresholds | null>(null);
  const [history, setHistory] = useState<(IoTData & { time: string })[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<keyof Omit<IoTData, 'motorStatus'>>('temperature');
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

  const toggleMotor = async () => {
    if (isAutoMode) return; // Prevent manual toggle in auto mode

    if (isSimulating) {
      setData(prev => prev ? { ...prev, motorStatus: !prev.motorStatus } : null);
      return;
    }

    const newState = !data?.motorStatus;
    try {
      await set(ref(rtdb, 'farm/control/motorStatus'), newState);

      // Optimistically update local state
      setData(prev => prev ? { ...prev, motorStatus: newState } : null);
    } catch (err: any) {
      setError('Failed to control motor. Check your Firebase connection.');
      console.error(err);
    }
  };

  // Auto Motor Control Logic
  useEffect(() => {
    if (isAutoMode && data) {
      const { autoTurnOnBelow, autoTurnOffAbove } = thresholds.soilMoisture;
      if (autoTurnOnBelow !== undefined && autoTurnOffAbove !== undefined) {
        if (data.soilMoisture < autoTurnOnBelow && !data.motorStatus) {
          if (isSimulating) {
            setData(prev => prev ? { ...prev, motorStatus: true } : null);
          } else {
            set(ref(rtdb, 'farm/control/motorStatus'), true).catch(console.error);
            setData(prev => prev ? { ...prev, motorStatus: true } : null);
          }
        } else if (data.soilMoisture > autoTurnOffAbove && data.motorStatus) {
          if (isSimulating) {
            setData(prev => prev ? { ...prev, motorStatus: false } : null);
          } else {
            set(ref(rtdb, 'farm/control/motorStatus'), false).catch(console.error);
            setData(prev => prev ? { ...prev, motorStatus: false } : null);
          }
        }
      }
    }
  }, [data?.soilMoisture, isAutoMode, thresholds.soilMoisture, isSimulating, data?.motorStatus]);

  // History Tracking Logic
  useEffect(() => {
    if (data) {
      setHistory(prev => {
        const newPoint = {
          ...data,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        const newHistory = [...prev, newPoint];
        return newHistory.slice(-20); // Keep last 20 data points for the graph
      });
    }
  }, [data]);

  useEffect(() => {
    if (isSimulating) {
      if (!data) {
        setData({
          temperature: +(20 + Math.random() * 15).toFixed(1),
          humidity: +(40 + Math.random() * 40).toFixed(1),
          soilMoisture: +(30 + Math.random() * 50).toFixed(1),
          nutrients: +(1.0 + Math.random() * 2.5).toFixed(2),
          sunIntensity: +(40 + Math.random() * 60).toFixed(1),
          motorStatus: false
        });
      }

      refreshInterval.current = setInterval(() => {
        setData(prev => ({
          temperature: +(20 + Math.random() * 15).toFixed(1),
          humidity: +(40 + Math.random() * 40).toFixed(1),
          soilMoisture: +(30 + Math.random() * 50).toFixed(1),
          nutrients: +(1.0 + Math.random() * 2.5).toFixed(2),
          sunIntensity: +(40 + Math.random() * 60).toFixed(1),
          motorStatus: prev?.motorStatus || false
        }));
      }, 5000);

      return () => {
        if (refreshInterval.current) clearInterval(refreshInterval.current);
      };
    } else {
      setIsLoading(true);

      const fetchInitialData = async () => {
        try {
          const sensorSnapshot = await get(ref(rtdb, 'farm/sensors'));
          const controlSnapshot = await get(ref(rtdb, 'farm/control'));
          const configSnapshot = await get(ref(rtdb, 'farm/config/thresholds'));

          const sensorData = sensorSnapshot.val();
          const controlData = controlSnapshot.val();
          const configData = configSnapshot.val();

          console.log("Initial sensor data:", sensorData);
          console.log("Initial control data:", controlData);

          if (configData) {
            setThresholds(configData);
          }

          const parseVal = (val: any) => {
            if (val === undefined || val === null) return 0;
            const parsed = parseFloat(val);
            return isNaN(parsed) ? 0 : parsed;
          };

          setData({
            temperature: parseVal(sensorData?.temperature ?? sensorData?.Temperature),
            humidity: parseVal(sensorData?.humidity ?? sensorData?.Humidity),
            soilMoisture: parseVal(sensorData?.soil_moisture ?? sensorData?.soilMoisture ?? sensorData?.SoilMoisture),
            nutrients: parseVal(sensorData?.nutrients ?? sensorData?.Nutrients),
            sunIntensity: parseVal(sensorData?.lightIntensity ?? sensorData?.LightIntensity ?? sensorData?.light_intensity ?? sensorData?.sun_intensity ?? sensorData?.sunIntensity ?? sensorData?.SunIntensity),
            motorStatus: controlData?.motor_status ?? controlData?.motorStatus ?? false
          });
          setIsConnected(true);
          setError(null);
        } catch (err: any) {
          console.error("Error fetching IoT data:", err);
          setIsConnected(false);
          setError('Failed to connect to Firebase: ' + err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchInitialData();

      // Subscribe to real-time changes
      const sensorRef = ref(rtdb, 'farm/sensors');
      const unsubscribeSensor = onValue(sensorRef, (snapshot) => {
        const newData = snapshot.val();
        console.log("Real-time sensor data:", newData);
        if (newData) {
          const parseVal = (val: any, fallback: number) => {
            if (val === undefined || val === null) return fallback;
            const parsed = parseFloat(val);
            return isNaN(parsed) ? fallback : parsed;
          };

          setData(prev => ({
            temperature: parseVal(newData.temperature ?? newData.Temperature, prev?.temperature ?? 0),
            humidity: parseVal(newData.humidity ?? newData.Humidity, prev?.humidity ?? 0),
            soilMoisture: parseVal(newData.soil_moisture ?? newData.soilMoisture ?? newData.SoilMoisture, prev?.soilMoisture ?? 0),
            nutrients: parseVal(newData.nutrients ?? newData.Nutrients, prev?.nutrients ?? 0),
            sunIntensity: parseVal(newData.lightIntensity ?? newData.LightIntensity ?? newData.light_intensity ?? newData.sun_intensity ?? newData.sunIntensity ?? newData.SunIntensity, prev?.sunIntensity ?? 0),
            motorStatus: prev?.motorStatus || false
          }));
        }
      }, (error) => {
        console.error("Firebase RTDB Sensor Error:", error);
        setError("Permission denied or connection lost to sensor data. Please check your Realtime Database rules.");
      });

      const controlRef = ref(rtdb, 'farm/control');
      const unsubscribeControl = onValue(controlRef, (snapshot) => {
        const newData = snapshot.val();
        console.log("Real-time control data:", newData);

        const motorStatus = newData?.motor_status ?? newData?.motorStatus;

        if (newData && motorStatus !== undefined) {
          setData(prev => prev ? {
            ...prev,
            motorStatus: motorStatus
          } : {
            temperature: 0,
            humidity: 0,
            soilMoisture: 0,
            nutrients: 0,
            sunIntensity: 0,
            motorStatus: motorStatus
          });
        }
      }, (error) => {
        console.error("Firebase RTDB Control Error:", error);
      });

      const configRef = ref(rtdb, 'farm/config/thresholds');
      const unsubscribeConfig = onValue(configRef, (snapshot) => {
        const newData = snapshot.val();
        if (newData) {
          setThresholds(newData);
        }
      }, (error) => {
        console.error("Firebase RTDB Config Error:", error);
      });

      return () => {
        unsubscribeSensor();
        unsubscribeControl();
        unsubscribeConfig();
      };
    }
  }, [isSimulating]);

  return (
    <div className="space-y-8 relative">
      <Chip3D />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-4xl font-bold text-[#00332C] dark:text-[#86EFAC]">IoT Dashboard</h1>
          <p className="text-[#00332C]/60 dark:text-white/60 italic">Monitor and control your farm in real-time via Firebase</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-sm backdrop-blur-md ${isConnected ? 'bg-[#86EFAC]/20 text-[#00332C] dark:text-[#86EFAC] border border-[#86EFAC]/30' : 'bg-white/10 text-stone-500 border border-white/20'}`}>
            <Wifi className={`w-4 h-4 ${isConnected ? 'text-[#00332C] dark:text-[#86EFAC]' : 'text-stone-400'}`} />
            {isConnected ? 'Firebase Connected' : 'Connecting...'}
          </div>
        </div>
      </div>

      {!isConnected && !isSimulating && !error && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-amber-900">Waiting for Data</h3>
            <p className="text-amber-700 text-sm">
              Connecting to Firebase Database. Make sure your ESP32 is powered on and connected to Wi-Fi.
              Alternatively, you can enable <strong>Simulation Mode</strong> below to test the dashboard.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center gap-3 text-rose-700 text-sm">
          <AlertTriangle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 relative z-10">
        {/* Temperature Card */}
        <motion.div whileHover={{ y: -5 }} className="bg-white/40 dark:bg-[#00332C]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/40 dark:border-[#86EFAC]/20 shadow-lg relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00332C]/60 dark:text-white/60">Temperature</span>
          </div>
          <SemiCircleGauge
            value={data?.temperature || 0}
            config={thresholds.temperature}
            unit="°C"
            onEdit={() => setEditingMetric('temperature')}
          />
        </motion.div>

        {/* Humidity Card */}
        <motion.div whileHover={{ y: -5 }} className="bg-white/40 dark:bg-[#00332C]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/40 dark:border-[#86EFAC]/20 shadow-lg relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00332C]/60 dark:text-white/60">Humidity</span>
          </div>
          <SemiCircleGauge
            value={data?.humidity || 0}
            config={thresholds.humidity}
            unit="%"
            onEdit={() => setEditingMetric('humidity')}
          />
        </motion.div>

        {/* Soil Moisture Card */}
        <motion.div whileHover={{ y: -5 }} className="bg-white/40 dark:bg-[#00332C]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/40 dark:border-[#86EFAC]/20 shadow-lg relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#86EFAC]/20 rounded-xl flex items-center justify-center">
              <Waves className="w-5 h-5 text-[#00332C] dark:text-[#86EFAC]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00332C]/60 dark:text-white/60">Soil Moisture</span>
          </div>
          <SemiCircleGauge
            value={data?.soilMoisture || 0}
            config={thresholds.soilMoisture}
            unit="%"
            onEdit={() => setEditingMetric('soilMoisture')}
          />
        </motion.div>

        {/* Nutrients Card */}
        <motion.div whileHover={{ y: -5 }} className="bg-white/40 dark:bg-[#00332C]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/40 dark:border-[#86EFAC]/20 shadow-lg relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00332C]/60 dark:text-white/60">Nutrients (EC)</span>
          </div>
          <SemiCircleGauge
            value={data?.nutrients || 0}
            config={thresholds.nutrients}
            unit="mS/cm"
            onEdit={() => setEditingMetric('nutrients')}
          />
        </motion.div>

        {/* Sun Intensity Card */}
        <motion.div whileHover={{ y: -5 }} className="bg-white/40 dark:bg-[#00332C]/40 backdrop-blur-xl p-6 rounded-3xl border border-white/40 dark:border-[#86EFAC]/20 shadow-lg relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Sun className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00332C]/60 dark:text-white/60">Sun Intensity</span>
          </div>
          <SemiCircleGauge
            value={data?.sunIntensity || 0}
            config={thresholds.sunIntensity}
            unit="%"
            onEdit={() => setEditingMetric('sunIntensity')}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Motor Control */}
        <div className="bg-white/40 dark:bg-[#00332C]/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/40 dark:border-[#86EFAC]/20 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#00332C] dark:text-[#86EFAC]">Irrigation Control</h2>
              <p className="text-[#00332C]/60 dark:text-white/60 text-sm">Control your water pump</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/50 dark:bg-white/10 p-1 rounded-xl border border-white/20 dark:border-transparent">
                <button
                  onClick={() => setIsAutoMode(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${!isAutoMode ? 'bg-white dark:bg-[#00332C] text-[#00332C] dark:text-[#86EFAC] shadow-sm' : 'text-[#00332C]/60 dark:text-white/60 hover:text-[#00332C] dark:hover:text-white'}`}
                >
                  MANUAL
                </button>
                <button
                  onClick={() => setIsAutoMode(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isAutoMode ? 'bg-[#00332C] dark:bg-[#86EFAC] text-white dark:text-[#00332C] shadow-sm' : 'text-[#00332C]/60 dark:text-white/60 hover:text-[#00332C] dark:hover:text-white'}`}
                >
                  AUTO
                </button>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${data?.motorStatus ? 'bg-[#86EFAC]/20 text-[#00332C] dark:text-[#86EFAC]' : 'bg-white/50 dark:bg-white/10 text-[#00332C]/40 dark:text-white/40'}`}>
                <Power className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-[#00332C]/10 dark:border-[#86EFAC]/20 rounded-3xl relative bg-white/20 dark:bg-white/5">
            <button
              onClick={toggleMotor}
              disabled={!data || isAutoMode}
              className={`w-32 h-32 rounded-full flex flex-col items-center justify-center gap-2 transition-all shadow-xl ${data?.motorStatus
                  ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30'
                  : 'bg-[#00332C] dark:bg-[#86EFAC] hover:bg-[#004d43] dark:hover:bg-[#6ee7b7] shadow-[#00332C]/30 dark:shadow-[#86EFAC]/30'
                } text-white dark:text-[#00332C] disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Power className="w-10 h-10" />
              <span className="font-bold uppercase tracking-widest text-[10px]">
                {data?.motorStatus ? 'Turn Off' : 'Turn On'}
              </span>
            </button>
            <p className="mt-6 text-sm font-medium text-[#00332C]/60 dark:text-white/60">
              Status: <span className={data?.motorStatus ? 'text-[#00332C] dark:text-[#86EFAC] font-bold' : 'text-[#00332C]/40 dark:text-white/40'}>
                {data ? (data.motorStatus ? 'Running' : 'Stopped') : 'Disconnected'}
              </span>
            </p>
            {isAutoMode && (
              <div className="absolute bottom-4 bg-[#86EFAC]/20 text-[#00332C] dark:text-[#86EFAC] px-4 py-2 rounded-xl text-xs font-medium text-center border border-[#86EFAC]/30 backdrop-blur-md">
                Auto mode enabled. Motor turns ON below {thresholds.soilMoisture.autoTurnOnBelow}% and OFF above {thresholds.soilMoisture.autoTurnOffAbove}%.
              </div>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-gradient-to-br from-[#00332C] to-[#004d43] text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#86EFAC]/10 blur-3xl -mr-32 -mt-32" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Cpu className="w-6 h-6 text-[#86EFAC]" />
              <h2 className="text-2xl font-bold">System Status</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`w-5 h-5 ${isConnected ? 'text-[#86EFAC]' : 'text-white/40'}`} />
                  <span className="text-sm font-medium">Firebase Connection</span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${isSimulating ? 'bg-purple-500/20 text-purple-400' : isConnected ? 'bg-[#86EFAC]/20 text-[#86EFAC]' : 'bg-white/10 text-white/50'}`}>
                  {isSimulating ? 'SIMULATING' : isConnected ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Zap className={`w-5 h-5 ${isSimulating ? 'text-purple-400' : 'text-white/40'}`} />
                  <span className="text-sm font-medium">Simulation Mode</span>
                </div>
                <button
                  onClick={() => {
                    setIsSimulating(!isSimulating);
                    if (isSimulating) setData(null);
                  }}
                  className={`w-12 h-6 rounded-full relative transition-colors ${isSimulating ? 'bg-purple-500' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isSimulating ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="p-4 bg-[#86EFAC]/10 rounded-2xl border border-[#86EFAC]/20 backdrop-blur-md">
                <p className="text-xs text-white/70 leading-relaxed">
                  The system uses Firebase to communicate with your ESP32 securely over the internet.
                  No local network configuration or IP addresses are required!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Data Chart */}
      <div className="bg-white/40 dark:bg-[#00332C]/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/40 dark:border-[#86EFAC]/20 shadow-lg relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#00332C] dark:text-[#86EFAC] flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-[#00332C] dark:text-[#86EFAC]" />
              Historical Data
            </h2>
            <p className="text-[#00332C]/60 dark:text-white/60 text-sm">Real-time sensor trends</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['temperature', 'humidity', 'soilMoisture', 'nutrients', 'sunIntensity'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors capitalize ${selectedMetric === metric
                    ? 'bg-[#00332C] dark:bg-[#86EFAC] text-white dark:text-[#00332C]'
                    : 'bg-white/50 dark:bg-white/10 text-[#00332C]/60 dark:text-white/60 hover:bg-white/80 dark:hover:bg-white/20'
                  }`}
              >
                {metric.replace(/([A-Z])/g, ' $1').trim()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(134, 239, 172, 0.2)" vertical={false} />
              <XAxis dataKey="time" stroke="#86EFAC" fontSize={12} tickMargin={10} />
              <YAxis stroke="#86EFAC" fontSize={12} tickMargin={10} />
              <Tooltip
                contentStyle={{ borderRadius: '1rem', border: '1px solid rgba(134, 239, 172, 0.3)', background: 'rgba(0, 51, 44, 0.9)', color: '#fff', backdropFilter: 'blur(8px)' }}
                itemStyle={{ color: '#86EFAC' }}
              />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke="#86EFAC"
                strokeWidth={3}
                dot={{ fill: '#00332C', strokeWidth: 2, stroke: '#86EFAC', r: 4 }}
                activeDot={{ r: 6, fill: '#86EFAC', stroke: '#00332C' }}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Thresholds Edit Modal */}
      <AnimatePresence>
        {editingMetric && (
          <EditThresholdsModal
            metricKey={editingMetric}
            config={thresholds[editingMetric]}
            onSave={async (newConfig) => {
              const newThresholds = { ...thresholds, [editingMetric]: newConfig };
              setThresholds(newThresholds);
              setEditingMetric(null);
              if (!isSimulating) {
                try {
                  await set(ref(rtdb, 'farm/config/thresholds'), newThresholds);
                } catch (err) {
                  console.error("Failed to save thresholds to Firebase", err);
                }
              }
            }}
            onClose={() => setEditingMetric(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
