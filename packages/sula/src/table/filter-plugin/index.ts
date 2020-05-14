import Search from './search';
import { registerFilterPlugin } from './plugin';


function registerFilterPlugins() {
  registerFilterPlugin('search')(Search);
}

export { registerFilterPlugins, registerFilterPlugin };
