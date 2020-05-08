import React from 'react';
import cx from 'classnames';
import assign from 'lodash/assign';
import { RenderPlugin } from '../types/plugin';
import FieldGroupContext, { HOOK_MARK } from './FieldGroupContext';
import { triggerRenderPlugin } from '../rope/triggerPlugin';
import Field from './Field';
import './style/form-action.less';
import { SulaConfigContext } from '../config-provider/context';

export type ActionsPosition = 'default' | 'bottom' | 'right' | 'center';

export interface FormActinProps {
  actionsPosition?: ActionsPosition;
  actionsRender?: RenderPlugin | RenderPlugin[];
  children?: React.ReactElement;
}

export default class FormAction extends React.Component<FormActinProps> {
  static contextType = FieldGroupContext;
  static defaultProps = {
    actionsPosition: 'default',
  };

  render() {
    const { actionsPosition, actionsRender, style, className, children } = this.props;

    const { formContext, layout, itemLayout } = this.context;

    const { getCtx } = formContext.getInternalHooks(HOOK_MARK);

    return (
      <SulaConfigContext.Consumer>
        {(configContext) => {
          const ctx = getCtx({
            history: configContext.history,
          });

          const cls = cx(className, actionsPosition && `sula-form-action-${actionsPosition}`);

          const actionsElem = children || triggerRenderPlugin(ctx, actionsRender);
          const actionsContainer = (
            <div style={style} className={cls}>
              {actionsElem}
            </div>
          );

          // 默认位置
          if (actionsPosition === 'default' && layout !== 'inline') {
            const wrapperCol =
              layout === 'horizontal'
                ? assign({ offset: itemLayout.labelCol.span }, itemLayout.wrapperCol)
                : itemLayout.wrapperCol;
            return (
              <Field
                style={{ marginBottom: 0 }}
                wrapperCol={wrapperCol}
                itemLayout={this.props.itemLayout}
              >
                {actionsContainer}
              </Field>
            );
          } else {
            return actionsContainer;
          }
        }}
      </SulaConfigContext.Consumer>
    );
  }
}
