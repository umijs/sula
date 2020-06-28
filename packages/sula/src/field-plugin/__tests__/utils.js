import moment from 'moment';
import MockDate from 'mockdate';

export function openPicker(wrapper, index = 0) {
  wrapper.find('input').at(index).simulate('mousedown').simulate('focus');
}

export function selectCell(wrapper, text, index = 0) {
  let matchCell;

  wrapper
    .find('table')
    .at(index)
    .find('td')
    .forEach((td) => {
      if (td.text() === String(text) && td.props().className.includes('-in-view')) {
        matchCell = td;
        td.simulate('click');
      }
    });

  return matchCell;
}

export function selectTimeCell(wrapper, text, index = 2) {
  let matchCell;

  wrapper
    .find('ul')
    .at(index)
    .find('li')
    .forEach((td) => {
      if (td.text() === String(text)) {
        matchCell = td;
        td.simulate('click');
      }
    });

  wrapper.find('button').forEach((item) => {
    if (item.text() === 'Ok') {
      item.simulate('click');
    }
  });

  return matchCell;
}

export function closePicker(wrapper, index = 0) {
  wrapper.find('input').at(index).simulate('blur');
}
