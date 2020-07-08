import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import Charts from '@sula/charts';

const grid = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

const data = Array(10)
  .fill(0)
  .map(() => parseInt(Math.random() * 1000, 10));

const option = {
  tooltip: {},
  grid,
  xAxis: {
    type: 'category',
    data: Array(10)
      .fill(0)
      .map((_, i) => `${i + 1}月`),
    show: false,
  },
  yAxis: {
    type: 'value',
    show: false,
  },
};

const areaOption = {
  ...option,
  series: [
    {
      data,
      type: 'line',
      areaStyle: {},
    },
  ],
};

const barOption = {
  ...option,
  series: [
    {
      data,
      type: 'bar',
    },
  ],
};

const lineOption = {
  ...option,
  series: [
    {
      data,
      type: 'line',
    },
  ],
};

const stackBarOption = {
  ...option,
  legend: {
    data: ['直接访问', '邮件营销'],
    show: false,
  },
  series: [
    {
      name: '直接访问',
      data,
      stack: '总量',
      type: 'bar',
    },
    {
      name: '邮件营销',
      data,
      stack: '总量',
      type: 'bar',
    },
  ],
};

export default class CardCharts extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <div style={{ marginBottom: 12 }}>
                <Statistic title="Active Users" value={112893} />
              </div>
              <div>
                <Charts style={{ height: 46 }} option={areaOption} />
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div style={{ marginBottom: 12 }}>
                <Statistic title="Active Users" value={112893} />
              </div>
              <div>
                <Charts style={{ height: 46 }} option={barOption} />
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div style={{ marginBottom: 12 }}>
                <Statistic title="Active Users" value={112893} />
              </div>
              <div>
                <Charts style={{ height: 46 }} option={lineOption} />
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div style={{ marginBottom: 12 }}>
                <Statistic title="Active Users" value={112893} />
              </div>
              <div>
                <Charts style={{ height: 46 }} option={stackBarOption} />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
