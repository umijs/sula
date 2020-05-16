import Card from './card';
import Text from './text';
// import Icon from './icon';
import Icon, { IconPlugin } from './icon';
import { Tag, Badge, Progress, Input } from 'antd';
import Button, { ButtonPlugin, LinkPlugin } from './button';

// only plugin
import RowSelection from './rowSelection';
import { registerRenderPlugin } from './plugin';

function registerRenderPlugins() {
  registerRenderPlugin('card')(Card);
  registerRenderPlugin('div')('div');
  registerRenderPlugin('inputgroup')(Input.Group);
  registerRenderPlugin('text')(Text);
  registerRenderPlugin('button', ['autoLoading'])(ButtonPlugin, true);
  registerRenderPlugin('link', ['autoLoading'])(LinkPlugin, true);
  registerRenderPlugin('icon', ['autoLoading'])(IconPlugin, true);

  registerRenderPlugin('rowSelection')(RowSelection, true);
  registerRenderPlugin('tag')(Tag);
  registerRenderPlugin('badge')(Badge);
  registerRenderPlugin('progress')(Progress);
}

export { Card, Text, Icon, Button, registerRenderPlugins, registerRenderPlugin };
