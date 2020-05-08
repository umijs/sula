import React from 'react';
import { Locale } from '../localereceiver';

export interface SulaConfigConsumerProps {
  theme?: 'bluebird' | 'default';
  locale?: Locale;
  history?: null;
}

export const SulaConfigContext = React.createContext({
  theme: 'bluebird',
  locale: null,
  history: null,
});

export const SulaConfigConsumer = SulaConfigContext.Consumer;