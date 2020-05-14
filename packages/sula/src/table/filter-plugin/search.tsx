import React from 'react';
import LocaleReceiver from '../../localereceiver';
import { Input, Button } from 'antd';

export default class SearchFilter {
  private searchInst: any;

  public props() {
    return {
      filterDropdown: this.filterDropdown,
      onFilterDropdownVisibleChange: this.onFilterDropdownVisibleChange,
    };
  }

  private onFilterDropdownVisibleChange = (visible) => {
    if (visible) {
      setTimeout(() => this.searchInst && this.searchInst.focus());
    }
  };

  private filterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
    return (
      <LocaleReceiver>
        {(locale) => (
          <div style={{ padding: '7px 8px' }}>
            <Input
              ref={(ref) => {
                this.searchInst = ref;
              }}
              value={(selectedKeys || [])[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => confirm()}
            />
            <div style={{ marginTop: 7 }}>
              <Button
                size="small"
                disabled={!selectedKeys.length}
                type="link"
                onClick={() => clearFilters()}
              >
                {locale.resetText}
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={() => confirm()}
                style={{ float: 'right' }}
              >
                {locale.okText}
              </Button>
            </div>
          </div>
        )}
      </LocaleReceiver>
    );
  };
}
