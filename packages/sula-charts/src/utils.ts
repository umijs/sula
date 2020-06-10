
import isString from 'lodash/isString';

const DEFAULT_WIDTH = 320;
const DEFAULT_HEIGHT = 280;

/** 设置 charts 画布 */
export const setCanvas = (canvasElem) => {
  const parentElem = canvasElem.parentNode;
  const finalWidth = getStyle(canvasElem, 'width') || parentElem.clientWidth || DEFAULT_WIDTH;
  const finalHeight = getStyle(canvasElem, 'height') || parentElem.clientHeight || DEFAULT_HEIGHT;

  canvasElem.style.width = getFinalValue(finalWidth);
  canvasElem.style.height = getFinalValue(finalHeight);
}

function getStyle(elem, prop) {
  const style = elem.style;

  const size = style && style[prop];

  if (size && size.toLowerCase() !== '0px') {
    return size;
  }

  return null;
}

function getFinalValue(value) {
  if (isString(value)) {
    if (value.indexOf('%') > -1 || value.indexOf('px') > -1) {
      return value;
    }
  }
  return `${value}px`;
}
