import isNumber from 'lodash/isNumber';
import { ItemLayout, Layout, NormalizedItemLayout } from '../FieldGroup';

export function getItemLayout(
  itemLayout: ItemLayout = {},
  layout: Layout,
  matchedPonint,
): NormalizedItemLayout {
  const { offset, gutter, labelCol, wrapperCol } = itemLayout;

  const finalSpan = getItemSpan(itemLayout, matchedPonint);

  let finalOffset = isNumber(offset) ? offset : 0;
  let finalGutter = isNumber(gutter) ? gutter : 24;

  let finalWrapperCol;
  let finalLabelCol;

  if (layout === 'vertical' || layout === 'horizontal') {
    // 只有水平布局需要设置 wrapperCol 和 labelCol
    if (layout === 'horizontal') {
      finalLabelCol = labelCol || { span: 8 };

      finalWrapperCol = wrapperCol || {
        span: finalSpan === 24 ? 12 : 16,
      };
    }
  }

  return {
    wrapperCol: finalWrapperCol,
    labelCol: finalLabelCol,
    span: finalSpan,
    offset: finalOffset,
    gutter: finalGutter,
  };
}

export function getItemSpan(
  itemLayout: ItemLayout = {},
  matchedPonint: string,
  fieldItemLayout?: NormalizedItemLayout,
) {
  if (fieldItemLayout && fieldItemLayout.span) {
    return isNumber(fieldItemLayout.span)
      ? fieldItemLayout.span
      : fieldItemLayout.span[matchedPonint];
  }

  const { cols = 1, span } = itemLayout;
  let finalSpan;

  if (span) {
    finalSpan = isNumber(span) ? span : span[matchedPonint];
  } else {
    const finalCols: number = isNumber(cols) ? cols : cols[matchedPonint];
    finalSpan = 24 / finalCols;
  }

  return finalSpan;
}

export function needWrapCols(span: number) {
  return isNumber(span) && span !== 24;
}
