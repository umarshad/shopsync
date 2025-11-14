import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface BarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
}

export default function BarcodeScanner({ onBarcodeScanned }: BarcodeScannerProps) {
  const { t } = useTranslation();
  const [barcode, setBarcode] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Auto-focus on barcode input when visible
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    // Handle keyboard input (barcode scanners often send data as keyboard input)
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check if it's a barcode scanner input (usually ends with Enter)
      if (e.key === 'Enter' && barcode.length > 0) {
        e.preventDefault();
        onBarcodeScanned(barcode);
        setBarcode('');
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
          setBarcode('');
        }, 100);
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Accumulate characters (barcode scanners type fast)
        setBarcode(prev => prev + e.key);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
          setBarcode('');
        }, 100);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [barcode, onBarcodeScanned]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && barcode.length > 0) {
      e.preventDefault();
      onBarcodeScanned(barcode);
      setBarcode('');
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 bg-primary-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary-700 z-50"
        title={t('pos.scanBarcode')}
      >
        📷
      </button>

      {/* Barcode Input */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 min-w-[300px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('pos.scanBarcode')}
          </label>
          <input
            ref={inputRef}
            type="text"
            value={barcode}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder={t('pos.scanBarcode')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
          />
          <p className="mt-2 text-xs text-gray-500">
            {t('pos.scanBarcode')} or type barcode manually
          </p>
        </div>
      )}
    </>
  );
}

