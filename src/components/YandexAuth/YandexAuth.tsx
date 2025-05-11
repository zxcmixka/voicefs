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
      // логика авторизации
      const mockToken = "y0__xCpqZ6WBBje-AYg6_H_iBMwwOymjAiVBKbXyfyG64sDif1nWoH0Ed-t_A";
      onSuccess(mockToken);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Auth failed');
    }
  };

  return (
    <button 
      onClick={handleAuth}
    >
      Войти через Яндекс
    </button>
  );
};