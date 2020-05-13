import React from 'react';
import { Steps } from 'antd';
import assign from 'lodash/assign';
import omit from 'lodash/omit';
import Memorize from './memorize';
import { QueryTable, QueryTableProps } from '../template-query-table';
import './style/step-query-table.less';

const { Step } = Steps;

const MemorizeItem = Memorize.Item;

interface StepProps extends QueryTableProps {
  title: string;
  subTitle?: string;
  description?: string;
}

export interface StepQueryTableProps extends QueryTableProps {
  autoRefresh?: boolean;
  steps: StepProps[];
  stepsStyle: React.CSSProperties;
  queryTableStyle: React.CSSProperties;
}

interface StepQueryTableState {
  current: number;
}

export default class StepForm extends React.Component<StepQueryTableProps, StepQueryTableState> {
  static defaultProps = {
    autoRefresh: true,
  };

  state = {
    current: 0,
  };

  queryTablesRef = [];

  constructor(props) {
    super(props);

    props.steps.forEach(() => {
      this.queryTablesRef.push(React.createRef());
    });
  }

  handleStepChange = (current) => {
    this.setState({
      current,
    });

    if (this.props.autoRefresh) {
      const currentQueryTableRef = this.queryTablesRef[current];
      if (currentQueryTableRef.current) {
        currentQueryTableRef.current.tableRef.current.refreshTable();
      }
    }
  };

  renderStepQueryTable = () => {
    const { steps, autoRefresh, stepsStyle, queryTableStyle, ...queryTableProps } = this.props;

    const { current } = this.state;

    return (
      <div>
        <div className="sula-template-step-query-table-steps" style={stepsStyle}>
          <Steps current={current} onChange={this.handleStepChange}>
            {steps.map((step, stepIndex) => {
              const { title, subTitle, description } = step;
              return (
                <Step
                  status={current === stepIndex ? 'process' : 'wait'}
                  title={title}
                  subTitle={subTitle}
                  description={description}
                  key={stepIndex}
                />
              );
            })}
          </Steps>
        </div>
        <div style={queryTableStyle}>
          <Memorize>
            {steps.map((step, stepIndex) => {
              const currentQueryTableProps = omit(step, ['title', 'subTitle', 'description']);
              return (
                <MemorizeItem visible={current === stepIndex} key={stepIndex} memoId={stepIndex}>
                  <QueryTable
                    {...assign({}, queryTableProps, currentQueryTableProps)}
                    ref={this.queryTablesRef[stepIndex]}
                  />
                </MemorizeItem>
              );
            })}
          </Memorize>
        </div>
      </div>
    );
  };

  render() {
    return this.renderStepQueryTable();
  }
}
