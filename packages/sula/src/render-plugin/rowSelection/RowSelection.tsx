import React from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import LocaleReceiver, { t } from '../../localereceiver';

export default class RowSelection extends React.Component {
  renderRowSelection = (locale) => {
    const { ctx } = this.props;
    const { table } = ctx;
    const selectedRowKeys = table && table.getSelectedRowKeys();

    if (selectedRowKeys && selectedRowKeys.length) {
      return (
        <span>
          <InfoCircleOutlined />
          <span style={{ marginLeft: 8 }}>
            {t(locale.selectedRecords, { count: selectedRowKeys.length })}
          </span>
          <a
            style={{ marginLeft: 8 }}
            onClick={() => {
              table.clearRowSelection();
            }}
          >
            {locale.clearText}
          </a>
        </span>
      );
    }

    return null;
  };
  render() {
    return <LocaleReceiver>{this.renderRowSelection}</LocaleReceiver>;
  }
}
