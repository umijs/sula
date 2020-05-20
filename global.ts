import { Icon } from './packages/sula/src/index';
import { TabletFilled, AppstoreOutlined, CarOutlined, CoffeeOutlined } from '@ant-design/icons';

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
  car: {
    outlined: CarOutlined,
  },
  coffee: CoffeeOutlined,
});
