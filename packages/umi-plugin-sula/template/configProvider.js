import React from 'react';
import { ConfigProvider } from 'sula';
import { history, getLocale } from 'umi';

const baseSeparator = '{{{baseSeparator}}}' || '-';
const formatLangFile = (lang) => lang && lang.replace(baseSeparator, '_');

function getLocaleData() {
  let lang;
  try {
    lang = getLocale();
  } catch (error) {
    lang = '{{{default}}}' || `en${baseSeparator}US`;
  }
  const langFile = formatLangFile(lang);

  let locale;
  try {
    locale = require(`sula/es/localereceiver/${langFile}`);
    locale = locale.default || locale;
  } catch (error) {}
  return locale;
}

export const rootContainer = (container) => {
  return (
    <ConfigProvider locale={getLocaleData()} history={history}>
      {container}
    </ConfigProvider>
  );
};
