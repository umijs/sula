import React from 'react';
import cx from 'classnames';
import omit from 'lodash/omit';
import { Steps, Result, Spin } from 'antd';
import Memorize from './memorize';
import { Form, FieldGroup, FormProps, FieldGroupProps, FormAction } from '../form';
import { RequestConfig } from '../types/request';
import LocaleReceiver, { Locale } from '../localereceiver';
import { transformSubmit } from '../template-create-form/CreateForm';
import './style/step-form.less';

const { Step } = Steps;

const MemorizeItem = Memorize.Item;

export interface StepProps extends Omit<FieldGroupProps, 'name'> {
  title: string;
  subTitle?: string;
  description?: string;
  fetch?: RequestConfig;
}

export type StepType = 'first' | 'middle' | 'submit' | 'result';

export interface StepFormProps extends FormProps {
  result?: {
    title: string;
    subTitle: string;
  };
  steps: StepProps[];
  submit: RequestConfig;
  direction?: 'vertical' | 'horizontal';
  stepsStyle?: React.CSSProperties;
  formStyle?: React.CSSProperties;
}

interface StepFormState {
  current: number;
  loading: boolean;
}

export default class StepForm extends React.Component<StepFormProps, StepFormState> {
  static defaultProps = {
    direction: 'horizontal',
    mode: 'create',
  };

  state = {
    current: 0,
    loading: false,
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

  // 校验 step 是否需要发起请求
  checkStepFetch = (step: StepProps, cb: Function) => {
      if (step.fetch) {
        return [...transformSubmit(step.fetch, cb)]
      } else {
        return cb
      }
  };

  renderStepActions = (stepType: StepType, locale: Locale) => {
    const { mode, submit, result, steps } = this.props;
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
        this.checkStepFetch(steps[current], this.nextStep),
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

  renderStepForm = (locale: Locale) => {
    const { steps, result, direction, stepsStyle, formStyle, ...restFormProps } = this.props;
    const { loading } = this.state;

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
          <Spin spinning={loading}>
            <Form
              {...formProps}
              onRemoteValuesStart={() => {
                this.setState({
                  loading: true,
                });
              }}
              onRemoteValuesEnd={() => {
                this.setState({
                  loading: false,
                });
              }}
            >
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
                    <MemorizeItem
                      visible={current === stepIndex}
                      key={stepIndex}
                      memoId={stepIndex}
                    >
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
                      title={result.title || locale.successText}
                      subTitle={result.subTitle}
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
          </Spin>
        </div>
      </div>
    );
  };

  render() {
    return <LocaleReceiver>{this.renderStepForm}</LocaleReceiver>;
  }
}
