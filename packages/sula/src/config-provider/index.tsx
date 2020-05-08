import React from 'react';
import { SulaConfigConsumer, SulaConfigContext, SulaConfigConsumerProps } from './context';

export interface SulaConfigProviderProps extends SulaConfigConsumerProps {
  children: React.ReactNode;
}

export default class SulaConfigProvider extends React.Component<SulaConfigConsumerProps> {
  renderProvider = (context: SulaConfigConsumerProps) => {
    const { theme, locale, history, children } = this.props;

    const finalTheme = theme || context.theme;
    const finalLocale = locale || context.locale;

    return (
      <SulaConfigContext.Provider value={{ theme: finalTheme, locale: finalLocale, history }}>
        {children}
      </SulaConfigContext.Provider>
    );
  };

  render() {
    return <SulaConfigConsumer>{(context) => this.renderProvider(context)}</SulaConfigConsumer>;
  }
}
