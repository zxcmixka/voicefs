import { useEffect } from 'react';

declare global {
  interface Window {
    YaAuthSuggest: {
      init: (
        config: YaAuthConfig,
        origin: string
      ) => Promise<{
        handler: () => Promise<YaAuthData>;
      }>;
    };
  }
}

interface YaAuthConfig {
  client_id: string;
  response_type: 'token' | 'code';
  redirect_uri: string;
}

interface YaAuthData {
  access_token: string;
  expires_in: number;
  token_type: string;
}

const YandexAuth = () => {
  useEffect(() => {
    const initYandexAuth = async () => {
      try {
        await loadScript('https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js');

        const { handler } = await window.YaAuthSuggest.init(
          {
            client_id: '188cdd4f3ace439a8ecb7478ba41d30f', // Вынесите в .env!
            response_type: 'token',
            redirect_uri: 'https://voicess.netlify.app/',
          },
          'https://voicess.netlify.app/'
        );

        const data = await handler();
        console.log('Токен получен:', data.access_token);
        // Здесь можно передать токен в Zustand/Redux или на бэкенд
      } catch (error) {
        console.error('Ошибка авторизации:', error);
      }
    };

    initYandexAuth();
  }, []);

  return <div>Идёт авторизация через Яндекс...</div>;
};

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
};

export default YandexAuth;