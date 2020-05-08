import { Icon } from './packages/sula/src/index';
import { TabletFilled, AppstoreOutlined } from '@ant-design/icons';

// umi-plugin-sula 承载
// registerFieldPlugins();
// registerRenderPlugins();
// registerActionPlugin();

Icon.iconRegister({
  tablet: {
    filled: TabletFilled,
  },
  appstore: {
    outlined: AppstoreOutlined,
  },
});
