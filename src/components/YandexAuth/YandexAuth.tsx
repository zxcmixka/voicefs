// YandexAuth/YandexAuth.tsx
import React from 'react';

interface YandexAuthProps {
  onSuccess: (token: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const YandexAuth: React.FC<YandexAuthProps> = ({ 
  onSuccess, 
  onError,
  className 
}) => {
  const handleAuth = () => {
    try {
      // Ваша логика авторизации
      const mockToken = "test_token_123"; // Замените реальной логикой
      onSuccess(mockToken);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Auth failed');
    }
  };

  return (
    <button 
      onClick={handleAuth}
      className={className}
    >
      Войти через Яндекс
    </button>
  );
};