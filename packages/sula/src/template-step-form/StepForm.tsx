import React from 'react';
import cx from 'classnames';
import omit from 'lodash/omit';
import isFunction from 'lodash/isFunction';
import assign from 'lodash/assign';
import { Steps, Result, Spin } from 'antd';
import Memorize from './memorize';
import { Form, FieldGroup, FormProps, FieldGroupProps, FormAction, FormInstance } from '../form';
import { RequestConfig } from '../types/request';
import LocaleReceiver from '../localereceiver';
import { transformSubmit } from '../template-create-form/CreateForm';
import './style/step-form.less';
import { ActionPlugin } from '../types/plugin';

const { Step } = Steps;

const MemorizeItem = Memorize.Item;

export interface StepProps extends Omit<FieldGroupProps, 'name'> {
  title: string;
  subTitle?: string;
  description?: string;
}

export type StepType = 'first' | 'middle' | 'submit' | 'result';

export interface StepFormProps extends FormProps {
  result?: {
    title: string;
    subTitle: string;
  };
  steps: StepProps[];
  back?: ActionPlugin;
  submit: RequestConfig;
  save?: RequestConfig;
  direction?: 'vertical' | 'horizontal';
  stepsStyle?: React.CSSProperties;
  formStyle?: React.CSSProperties;
}

type StepStatus = 'success' | 'error';

interface StepFormState {
  current: number;
  loading: boolean;
  stepsStatus: Array<StepStatus>;
}

export default class StepForm extends React.Component<StepFormProps, StepFormState> {
  static defaultProps = {
    direction: 'horizontal',
    mode: 'create',
  };

  state = {
    current: 0,
    loading: false,
    stepsStatus: [] as Array<StepStatus>,
  };

  validateStep = (
    form: FormInstance,
    stepIndex: number,
    stepsStatus: Array<StepStatus>,
  ): Promise<any> => {
    return form
      .validateGroupFields(this.getStepName(stepIndex))
      .then(
        () => {
          stepsStatus.push('success');
        },
        () => {
          stepsStatus.push('error');
        },
      )
      .then(() => {
        if (stepIndex === this.props.steps.length - 1) {
          return;
        } else {
          return this.validateStep(form, stepIndex + 1, stepsStatus);
        }
      });
  };

  validateSteps = (form: FormInstance) => {
    const stepsStatus = [] as Array<StepStatus>;
    return new Promise((resolve, reject) => {
      this.validateStep(form, 0, stepsStatus).then(() => {
        if (stepsStatus.indexOf('error') > -1) {
          /** 如果存在校验错误，不再执行后续action */
          reject();
        } else {
          resolve(stepsStatus);
        }
        this.setState({
          stepsStatus,
        });
      });
    });
  };

  getStepName = (stepIndex: number) => {
    return `@@step${stepIndex}`;
  };

  nextStep = () => {
    this.setState({
      current: this.state.current + 1,
    });

    this.clearStepErrorStatus(this.state.current + 1);
  };

  previousStep = () => {
    this.setState({
      current: this.state.current - 1,
    });

    this.clearStepErrorStatus(this.state.current - 1);
  };

  /** save 才会开启 */
  handleChange = (current: number) => {
    this.setState({ current });
    this.clearStepErrorStatus(current);
  };

  clearStepErrorStatus = (stepIndex: number) => {
    const { save } = this.props;
    const { stepsStatus } = this.state;
    if (save && stepsStatus[stepIndex] === 'error') {
      const newStepsStatus = [...stepsStatus];
      newStepsStatus[stepIndex] = 'success' as StepStatus;
      this.setState({
        stepsStatus: newStepsStatus,
      });
    }
  };

  renderStepActions = (stepType, locale) => {
    const { mode, submit, back = 'back', result, save } = this.props;
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
      action: back,
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
        type: save && !isView ? 'default' : 'primary',
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

    /**
     * 仅提交不校验
     */
    const saveAction = save && {
      type: 'button',
      props: {
        type: stepType === 'submit' ? 'default' : 'primary',
        children: locale.stageText,
      },
      action: [
        {
          type: 'getFieldsValue',
          resultPropName: '$fieldsValue',
        },
        ...transformSubmit(
          isFunction(save) ? save : assign({ successMessage: locale.stageText }, save),
        ),
      ],
    };

    /**
     * 校验并提交
     */
    const submitAction = {
      type: 'button',
      props: {
        type: 'primary',
        children: mode === 'create' ? locale.submitText : locale.updateText,
      },
      action: [
        /** 如果是暂存模式，先对各step做校验，如果有校验不过的就不走后面的action */
        ...(save
          ? [
              {
                type: (ctx: {form: FormInstance}) => {
                  return this.validateSteps(ctx.form);
                },
              },
            ]
          : []),
        {
          type: 'validateFields',
          resultPropName: '$fieldsValue',
        },
        ...transformSubmit(submit, result ? this.nextStep : 'back'),
      ],
    };

    if (stepType === 'first') {
      return [
        ...(isView
          ? [nextAction]
          : save
          ? [saveAction, nextAction]
          : [validateFieldsAndNextAction]),
        cancelAction,
      ];
    } else if (stepType === 'middle') {
      return [
        ...(isView
          ? [nextAction]
          : save
          ? [saveAction, nextAction]
          : [validateFieldsAndNextAction]),
        previousAction,
        cancelAction,
      ];
    } else if (stepType === 'submit') {
      return [
        ...(isView ? [] : [submitAction, ...(save ? [saveAction] : [])]),
        previousAction,
        cancelAction,
      ];
    } else {
      // result
      return [okAction];
    }
  };

  renderStepForm = (locale) => {
    const { steps, result, direction, stepsStyle, formStyle, save, ...restFormProps } = this.props;
    const { loading, stepsStatus } = this.state;

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
            {...(save ? { onChange: this.handleChange } : {})}
          >
            {steps.map((step, stepIndex) => {
              const { title, subTitle, description } = step;
              return (
                <Step
                  title={title}
                  subTitle={subTitle}
                  description={description}
                  {...(save
                    ? { status: stepsStatus[stepIndex] !== 'error' ? undefined : 'error' }
                    : {})}
                  key={stepIndex}
                />
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
