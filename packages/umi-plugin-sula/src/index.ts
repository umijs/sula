import { join } from 'path';
import { IApi } from 'umi';
import { readFileSync, writeFileSync } from 'fs';

export default function (api: IApi) {
  api.describe({
    key: 'sula',
    config: {
      schema(joi) {
        return joi.object({
          name: joi.string(),
        });
      },
    },
    enableBy: api.EnableBy.config,
  });

  api.onGenerateFiles(() => {
    const { locale = {} } = api.config.sula;
    const configProviderTpl = readFileSync(
      join(__dirname, '../template/configProvider.js'),
      'utf-8',
    );
    const configProviderWrapperPath = join(api.paths.absTmpPath, 'SulaConfigProviderWrapper.js');
    writeFileSync(
      configProviderWrapperPath,
      api.utils.Mustache.render(configProviderTpl, locale),
      'utf-8',
    );
  });

  api.addRuntimePlugin(() => join(api.paths.absTmpPath, './SulaConfigProviderWrapper.js'));

  api.addEntryCodeAhead(() =>
    `
import {registerFieldPlugins, registerRenderPlugins, registerActionPlugin} from 'sula';

registerFieldPlugins();
registerRenderPlugins();
registerActionPlugin();
`.trim(),
  );
}
