import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import App from './App';
import { allMessages } from './i18n/messages';
import './index.css';

const locale = 'en';

/**
 * Converts messages from defineMessages format to flat object for IntlProvider
 */
const convertMessagesForIntl = (
  messages: Record<string, MessageDescriptor>
): Record<string, string> => {
  return Object.keys(messages).reduce(
    (acc, key) => {
      const message = messages[key as keyof typeof messages];
      const defaultMessage =
        typeof message.defaultMessage === 'string' ? message.defaultMessage : '';
      acc[key] = defaultMessage;
      return acc;
    },
    {} as Record<string, string>
  );
};

const messages = convertMessagesForIntl(
  allMessages[locale as keyof typeof allMessages] as Record<string, MessageDescriptor>
);

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
