import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import App from './App';
import { allMessages } from './i18n/messages';
import './index.css';

const locale = 'en';
const messages = allMessages[locale as keyof typeof allMessages];

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IntlProvider locale={locale} messages={messages}>
      <ChakraProvider value={defaultSystem}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </IntlProvider>
  </StrictMode>
);
