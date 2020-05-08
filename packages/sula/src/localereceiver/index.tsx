import React from 'react';
import defaultLocaleData from './en_US';
import { SulaConfigConsumer } from '../config-provider/context';

export type Locale = Record<string, string>;

export interface LocaleReceiverProps {
  children: (locale: Locale) => React.ReactNode;
}

export default class LocaleReceiver extends React.Component<LocaleReceiverProps> {
  getLocale(context) {
    const locale: Locale = context.locale || defaultLocaleData;

    return locale;
  }

  render() {
    return (
      <SulaConfigConsumer>
        {context => this.props.children(this.getLocale(context))}
      </SulaConfigConsumer>
    );
  }
}

const regex = /\{\{([^}]+)\}([^}]*)\}/g;

export const t = (text: string, model = {}) => {
  return text.replace(regex, (match, interp) => {
    const trimedInterp = interp.trim();

    const val = model[trimedInterp];

    if (typeof val === 'undefined') {
      return match;
    }

    return val;
  });
};
