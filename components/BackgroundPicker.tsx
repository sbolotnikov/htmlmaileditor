import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TrashIcon } from './icons';

type BackgroundType = 'solid' | 'linear-gradient';
type GradientStop = {
  id: number;
  color: string;
  position: number;
};

interface BackgroundPickerProps {
  value: string;
  onChange: (value: string) => void;
}

// Helper to check if a string is a valid color
const isColor = (strColor: string) => {
  if (!strColor || typeof strColor !== 'string') return false;
  const s = new Option().style;
  s.color = strColor;
  return s.color !== '';
};

// A much more robust parser for linear-gradient
const parseGradient = (value: string): { angle: number; stops: GradientStop[] } | null => {
    if (!value || !value.startsWith('linear-gradient')) return null;

    try {
        const content = value.substring(value.indexOf('(') + 1, value.lastIndexOf(')'));
        if (!content) return null;

        const parts = content.split(/,(?![^(]*\))/).map(p => p.trim());

        let angle = 180; // Default angle if not specified (top to bottom)
        let colorStopParts = parts;

        const firstPartIsAngle = parts[0].match(/^(-?[\d.]+)deg$/);
        if (firstPartIsAngle) {
            angle = parseFloat(firstPartIsAngle[1]);
            colorStopParts = parts.slice(1);
        }
        
        if (colorStopParts.length < 2) return null; // Need at least two colors for a gradient

        const stops: { id: number; color: string; position: number | null }[] = colorStopParts.map((part, index) => {
            const stopMatch = part.match(/^(.*?)\s+([\d.]+)%$/);
            let color: string;
            let position: number | null = null;

            if (stopMatch && isColor(stopMatch[1].trim())) {
                color = stopMatch[1].trim();
                position = parseFloat(stopMatch[2]);
            } else if (isColor(part)) {
                color = part.trim();
            } else {
                return null; // Invalid color stop
            }
            return { id: Date.now() + index, color, position };
        }).filter(s => s !== null) as { id: number; color: string; position: number | null }[];
        
        if (stops.length < colorStopParts.length) return null; // Some parts failed to parse
        
        // Distribute positions if they are missing
        const stopsWithPosition = stops.filter(s => s.position !== null);
        if (stopsWithPosition.length === 0) { // No positions defined, distribute evenly
            stops.forEach((stop, index) => {
                stop.position = (index / (stops.length - 1)) * 100;
            });
        } else { // Fill in missing positions between defined ones
            let lastDefinedIndex = -1;
            let lastDefinedPosition = 0;

            for(let i=0; i<stops.length; i++) {
                if (stops[i].position !== null) {
                    const currentIndex = i;
                    const currentPosition = stops[i].position!;
                    const itemsBetween = currentIndex - lastDefinedIndex - 1;

                    if (itemsBetween > 0) {
                        const positionStep = (currentPosition - lastDefinedPosition) / (itemsBetween + 1);
                        for (let j = 1; j <= itemsBetween; j++) {
                            stops[lastDefinedIndex + j].position = lastDefinedPosition + j * positionStep;
                        }
                    }
                    lastDefinedIndex = currentIndex;
                    lastDefinedPosition = currentPosition;
                }
            }

            // Handle any stops after the last defined position
            if (lastDefinedIndex < stops.length - 1) {
                 const remainingItems = stops.length - 1 - lastDefinedIndex;
                 const positionStep = (100 - lastDefinedPosition) / (remainingItems + 1);
                 for (let i=1; i<=remainingItems; i++) {
                     stops[lastDefinedIndex + i].position = lastDefinedPosition + i * positionStep;
                 }
            }
        }
        
        return { angle, stops: stops as GradientStop[] };

    } catch (e) {
        console.error("Failed to parse gradient:", e);
        return null;
    }
};

const BackgroundPicker: React.FC<BackgroundPickerProps> = ({ value, onChange }) => {
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('solid');
  const [solidColor, setSolidColor] = useState('#ffffff');
  const [gradientAngle, setGradientAngle] = useState(90);
  const [gradientStops, setGradientStops] = useState<GradientStop[]>([]);
  const isUpdatingFromProps = useRef(false);

  useEffect(() => {
    isUpdatingFromProps.current = true;

    const parsed = parseGradient(value);
    if (parsed) {
        setBackgroundType('linear-gradient');
        setGradientAngle(parsed.angle);
        setGradientStops(parsed.stops);
    } else if (isColor(value)) {
      setBackgroundType('solid');
      setSolidColor(value);
    } else { // Fallback for invalid values
        setBackgroundType('solid');
        setSolidColor('#ffffff');
    }
    
    const timer = setTimeout(() => {
        isUpdatingFromProps.current = false;
    }, 0);

    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    if (isUpdatingFromProps.current) {
        return;
    }
    
    let newValue = '';
    if (backgroundType === 'solid') {
      newValue = solidColor;
    } else {
      if (gradientStops.length < 2) return;
      const sortedStops = [...gradientStops].sort((a, b) => a.position - b.position);
      const stopsStr = sortedStops.map(s => `${s.color} ${s.position.toFixed(2)}%`).join(', ');
      newValue = `linear-gradient(${gradientAngle}deg, ${stopsStr})`;
    }

    if (newValue && newValue !== value) {
        onChange(newValue);
    }
  }, [backgroundType, solidColor, gradientAngle, gradientStops, onChange, value]);

  const handleStopChange = (id: number, field: 'color' | 'position', val: string | number) => {
    setGradientStops(stops =>
      stops.map(stop => (stop.id === id ? { ...stop, [field]: val } : stop))
    );
  };

  const addStop = () => {
    const newStop: GradientStop = {
      id: Date.now(),
      color: '#000000',
      position: 100
    };
    setGradientStops(stops => [...stops, newStop]);
  };

  const removeStop = (id: number) => {
    if (gradientStops.length <= 2) return; // Must have at least two stops
    setGradientStops(stops => stops.filter(stop => stop.id !== id));
  };
  
  const gradientPreview = useMemo(() => {
    if (backgroundType !== 'linear-gradient' || gradientStops.length < 2) return solidColor;
    const sortedStops = [...gradientStops].sort((a, b) => a.position - b.position);
    const stopsStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');
    return `linear-gradient(${gradientAngle}deg, ${stopsStr})`;
  }, [backgroundType, solidColor, gradientAngle, gradientStops]);

  return (
    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-sm">
      <div className="flex items-center bg-slate-200 rounded-md p-0.5 mb-2">
        {(['solid', 'linear-gradient'] as BackgroundType[]).map(type => (
          <button
            key={type}
            onClick={() => setBackgroundType(type)}
            className={`flex-1 text-xs capitalize py-1 rounded-md transition-colors ${backgroundType === type ? 'bg-white shadow-sm text-slate-800 font-semibold' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            {type.replace('-', ' ')}
          </button>
        ))}
      </div>

      {backgroundType === 'solid' && (
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Color</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={solidColor}
              onChange={e => setSolidColor(e.target.value)}
              className="p-1 border border-slate-300 rounded-md text-sm w-24"
            />
            <input
              type="color"
              value={solidColor}
              onChange={e => setSolidColor(e.target.value)}
              className="w-8 h-7 p-0.5 border border-slate-300 rounded"
            />
          </div>
        </div>
      )}

      {backgroundType === 'linear-gradient' && (
        <div className="space-y-3">
            <div className="h-8 w-full rounded border border-slate-300" style={{ background: gradientPreview }}></div>
            <div className="flex items-center justify-between">
                <label className="text-slate-500">Angle</label>
                <div className="flex items-center gap-2">
                    <input type="range" min="0" max="360" value={gradientAngle} onChange={e => setGradientAngle(parseInt(e.target.value, 10))} className="w-24" />
                    <input type="number" value={gradientAngle} onChange={e => setGradientAngle(parseInt(e.target.value, 10))} className="p-1 border border-slate-300 rounded-md text-sm w-16" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-slate-500 block">Color Stops</label>
                {gradientStops.map(stop => (
                    <div key={stop.id} className="flex items-center gap-2">
                        <input type="color" value={stop.color} onChange={e => handleStopChange(stop.id, 'color', e.target.value)} className="w-8 h-7 p-0.5 border border-slate-300 rounded" />
                        <input type="range" min="0" max="100" value={stop.position} onChange={e => handleStopChange(stop.id, 'position', parseInt(e.target.value, 10))} className="flex-1" />
                        <input type="number" value={stop.position} onChange={e => handleStopChange(stop.id, 'position', parseInt(e.target.value, 10))} className="p-1 border border-slate-300 rounded-md text-sm w-16" />
                        <button onClick={() => removeStop(stop.id)} className="text-red-500 hover:text-red-700 disabled:opacity-50" disabled={gradientStops.length <= 2}>
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
             <button onClick={addStop} className="w-full mt-2 py-1 text-xs text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
                + Add Color Stop
            </button>
        </div>
      )}
    </div>
  );
};

export default BackgroundPicker;
