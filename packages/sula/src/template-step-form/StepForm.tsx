import React from 'react';
import cx from 'classnames';
import omit from 'lodash/omit';
import { Steps, Result } from 'antd';
import Memorize from './memorize';
import { Form, FieldGroup, FormProps, FieldGroupProps, FormAction } from '../form';
import { RequestConfig } from '../types/request';
import LocaleReceiver from '../localereceiver';
import { transformSubmit } from '../template-create-form/CreateForm';
import './style/step-form.less';

const { Step } = Steps;

const MemorizeItem = Memorize.Item;

export interface StepProps extends Exclude<FieldGroupProps, 'name'> {
  title: string;
  subTitle?: string;
  description?: string;
}

export type StepType = 'first' | 'middle' | 'submit' | 'result';

export interface StepFormProps extends FormProps {
  result?: {
    successMessage: string;
    successDescription: string;
  };
  steps: StepProps[];
  submit: RequestConfig;
  direction?: 'vertical' | 'horizontal';
}

interface StepFormState {
  current: number;
}

export default class StepForm extends React.Component<StepFormProps, StepFormState> {
  static defaultProps = {
    direction: 'vertical',
    mode: 'create',
  };

  state = {
    current: 0,
  };

  getStepName = (stepIndex: number) => {
    return `@@step${stepIndex}`;
  };

  nextStep = () => {
    this.setState({
      current: this.state.current + 1,
    });
  };

  previousStep = () => {
    this.setState({
      current: this.state.current - 1,
    });
  };

  renderStepActions = (stepType, locale) => {
    const { mode, submit, result } = this.props;
    const isView = mode === 'view';
    const { current } = this.state;
    // 取消或者返回
    const cancelAction = {
      type: 'button',
      props: {
        children: mode === 'create' ? locale.cancelText : locale.backText,
      },
      action: 'back',
    };

    const okAction = {
      type: 'button',
      props: {
        children: locale.backText,
      },
      action: 'back',
    };

    // 上一步
    const previousAction = {
      type: 'button',
      props: {
        children: locale.previousText,
      },
      action: [this.previousStep],
    };

    // 下一步
    const nextAction = {
      type: 'button',
      props: {
        type: 'primary',
        children: locale.nextText,
      },
      action: [this.nextStep],
    };

    // 校验且下一步
    const validateFieldsAndNextAction = {
      type: 'button',
      props: {
        type: 'primary',
        children: locale.nextText,
      },
      action: [
        {
          type: 'validateGroupFields',
          args: [this.getStepName(current)],
        },
        this.nextStep,
      ],
    };

    const submitAction = {
      type: 'button',
      props: {
        type: 'primary',
        children: mode === 'create' ? locale.submitText : locale.updateText,
      },
      action: [
        {
          type: 'validateFields',
          resultPropName: '$fieldsValue',
        },
        ...transformSubmit(submit, result ? this.nextStep : 'back'),
      ],
    };

    if (stepType === 'first') {
      return [isView ? nextAction : validateFieldsAndNextAction, cancelAction];
    } else if (stepType === 'middle') {
      return [isView ? nextAction : validateFieldsAndNextAction, previousAction, cancelAction];
    } else if (stepType === 'submit') {
      return [...(isView ? [] : [submitAction]), previousAction, cancelAction];
    } else {
      // result
      return [okAction];
    }
  };

  renderStepForm = (locale) => {
    const { steps, result, direction, stepsStyle, formStyle, ...restFormProps } = this.props;

    const formProps = omit(restFormProps, ['submit', 'back']);

    const { current } = this.state;
    const isView = restFormProps.mode === 'view';

    const containerCls = cx('sula-template-step-form', `sula-template-step-form-${direction}`);

    return (
      <div className={containerCls}>
        <div className={`sula-template-step-form-${direction}-steps`} style={stepsStyle}>
          <Steps
            direction={direction}
            size={direction === 'vertical' ? 'small' : 'default'}
            current={current}
          >
            {steps.map((step, stepIndex) => {
              const { title, subTitle, description } = step;
              return (
                <Step title={title} subTitle={subTitle} description={description} key={stepIndex} />
              );
            })}
          </Steps>
        </div>
        <div className={`sula-template-step-form-${direction}-form`} style={formStyle}>
          <Form {...formProps}>
            <Memorize>
              {steps.map((step, stepIndex) => {
                const isFirstStep = stepIndex === 0;
                const isSubmitStep = stepIndex === steps.length - 1;

                let stepType: StepType;
                if (isFirstStep) {
                  stepType = 'first';
                } else if (isSubmitStep) {
                  stepType = 'submit';
                } else {
                  stepType = 'middle';
                }

                const actionsRender = this.renderStepActions(stepType, locale);

                const fieldGroupProps = omit(step, ['name', 'title', 'subTitle', 'description']);

                return (
                  <MemorizeItem visible={current === stepIndex} key={stepIndex} memoId={stepIndex}>
                    <FieldGroup
                      name={this.getStepName(stepIndex)}
                      actionsRender={actionsRender}
                      {...fieldGroupProps}
                    />
                  </MemorizeItem>
                );
              })}
              {result && !isView ? (
                <MemorizeItem visible={current === steps.length} memoId={steps.length}>
                  <Result
                    className={`sula-template-step-form-${direction}-result`}
                    status="success"
                    title={locale.successText}
                    extra={
                      <FormAction
                        actionsPosition="center"
                        actionsRender={this.renderStepActions('result', locale)}
                      />
                    }
                  />
                </MemorizeItem>
              ) : null}
            </Memorize>
          </Form>
        </div>
      </div>
    );
  };

  render() {
    return <LocaleReceiver>{this.renderStepForm}</LocaleReceiver>;
  }
}
