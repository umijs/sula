import React from 'react';
import assign from 'lodash/assign';
import isObject from 'lodash/isObject';
import { Popconfirm, Tooltip } from 'antd';
import { PopconfirmProps } from 'antd/lib/popconfirm';
import { TooltipProps } from 'antd/lib/tooltip';

export interface RopeContainerProps {
  confirm?: string | PopconfirmProps;
  tooltip?: string | TooltipProps;
  children: React.ReactElement;
  trigger: Function;
  disabled?: boolean;
}

export interface RopeContainerState {
  popconfirmVisible: boolean;
  tooltipVisible: boolean;
}

export default class RopeContainer extends React.Component<RopeContainerProps, RopeContainerState> {
  state = {
    popconfirmVisible: false,
    tooltipVisible: false,
  };

  onTooltipVisibleChange = (visible: boolean) => {
    this.setState({
      tooltipVisible: this.state.popconfirmVisible ? false : visible,
      // tooltipVisible: visible,
    });
  };

  onPopconfirmVisibleChange = (visible: boolean) => {
    this.setState({
      popconfirmVisible: visible,
      tooltipVisible: false,
    });
  };

  renderTriggerElement = () => {
    const disabled = this.props.disabled === true;
    const { confirm, children, trigger } = this.props;

    if (disabled) {
      return React.cloneElement(children, { disabled });
    }

    if (confirm) {
      return children;
    } else {
      return React.cloneElement(children, {
        onClick: trigger,
      });
    }
  };

  renderTooltipElement = (triggerElement: React.ReactElement) => {
    const { tooltipVisible } = this.state;
    const { tooltip } = this.props;

    if (!tooltip) {
      return triggerElement;
    }

    return React.createElement(
      Tooltip,
      assign(transferToObj(tooltip, 'title') as TooltipProps, {
        visible: tooltipVisible,
        onVisibleChange: this.onTooltipVisibleChange,
      }),
      triggerElement,
    );
  };

  renderPopconfirmElement = (tooltipElement: React.ReactElement) => {
    const { popconfirmVisible } = this.state;
    const { confirm, trigger } = this.props;

    const disabled = this.props.disabled === true;
    if (disabled || !confirm) {
      return tooltipElement;
    }

    return React.createElement(
      Popconfirm,
      assign(transferToObj(confirm, 'title') as PopconfirmProps, {
        onConfirm: trigger,
        visible: popconfirmVisible,
        onVisibleChange: this.onPopconfirmVisibleChange,
      }),
      tooltipElement,
    );
  };

  render() {
    const triggerElement = this.renderTriggerElement();

    const tooltipElement = this.renderTooltipElement(triggerElement);

    const popconfirmElement = this.renderPopconfirmElement(tooltipElement);

    return popconfirmElement;
  }
}

function transferToObj(cof: string | Record<string, any>, key: string) {
  return isObject(cof) ? cof : { [key]: cof };
}
