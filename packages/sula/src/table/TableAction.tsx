import React from 'react';
import './style/table-action.less';
import { triggerRenderPlugin } from '../rope/triggerPlugin';

export default class TableAction extends React.Component {
  renderActions = (actionsRender) => {
    if (!actionsRender) {
      return null;
    }
    return triggerRenderPlugin(this.props.ctx, actionsRender);
  };

  render() {
    const { leftActionsRender, actionsRender } = this.props;

    return (
      <div className="sula-table-action-wrapper">
        <div className="sula-table-action-left">{this.renderActions(leftActionsRender)}</div>
        <div className="sula-table-action-right">{this.renderActions(actionsRender)}</div>
      </div>
    );
  }
}
