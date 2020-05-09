import Select from './select';
import Upload from './upload';
import Cascader from './cascader';
import CheckboxGroup from './checkboxgroup';
import RadioGroup from './radiogroup';
import DatePicker from './datepicker';
import RangePicker from './rangepicker';
import TimePicker from './timepicker';
import { fieldPlugin } from './plugin';
import { Switch, Checkbox, Input, InputNumber, Rate, Radio, Slider } from 'antd';

function registerFieldPlugins() {
  fieldPlugin('input')(Input);
  fieldPlugin('textarea')(Input.TextArea);
  fieldPlugin('password')(Input.Password);
  fieldPlugin('inputnumber')(InputNumber);
  fieldPlugin('rate')(Rate);
  fieldPlugin('switch')(Switch);
  fieldPlugin('checkbox')(Checkbox);
  fieldPlugin('radio')(Radio);
  fieldPlugin('slider')(Slider);

  fieldPlugin('cascader')(Cascader, true);
  fieldPlugin('datepicker')(DatePicker);
  fieldPlugin('rangepicker')(RangePicker);
  fieldPlugin('timepicker')(TimePicker);
  fieldPlugin('upload')(Upload, false, true);
  fieldPlugin('select')(Select, true);
  fieldPlugin('checkboxgroup')(CheckboxGroup, true);
  fieldPlugin('radiogroup')(RadioGroup, true);
}

export { Select, CheckboxGroup, TimePicker, DatePicker, RangePicker, registerFieldPlugins, Cascader, RadioGroup, Upload };
