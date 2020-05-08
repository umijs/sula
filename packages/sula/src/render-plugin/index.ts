import Card from './card';
import Text from './text';
// import Icon from './icon';
import Icon, { IconPlugin } from './icon';
import { Tag, Badge, Progress, Input } from 'antd';
import Button, { ButtonPlugin } from './button';

// only plugin
import Div from './div';
import RowSelection from './rowSelection';
import { renderPlugin } from './plugin';

function registerRenderPlugins() {
  renderPlugin('card')(Card);
  renderPlugin('div')('div');
  renderPlugin('a')('a');
  renderPlugin('inputgroup')(Input.Group);
  renderPlugin('text')(Text);
  renderPlugin('button', ['autoLoading'])(ButtonPlugin, true);
  renderPlugin('icon', ['autoLoading'])(IconPlugin, true);

  renderPlugin('rowSelection')(RowSelection, true);
  renderPlugin('tag')(Tag);
  renderPlugin('badge')(Badge);
  renderPlugin('progress')(Progress);
}

export { Card, Text, Icon, Button, registerRenderPlugins };
