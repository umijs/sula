import React from 'react';
import { Input, Button } from 'antd';
import isArray from 'lodash/isArray';
import LocaleReceiver from '../../localereceiver';

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
    // 初始状态是[]
    const finalSelectedKeys = isArray(selectedKeys) ? selectedKeys[0] : selectedKeys;
    return (
      <LocaleReceiver>
        {(locale) => (
          <div style={{ padding: '7px 8px' }}>
            <Input
              ref={(ref) => {
                this.searchInst = ref;
              }}
              value={finalSelectedKeys}
              onChange={(e) => setSelectedKeys(e.target.value)}
              onPressEnter={() => confirm()}
            />
            <div style={{ marginTop: 7 }}>
              <Button
                size="small"
                disabled={!finalSelectedKeys}
                type="link"
                style={{ padding: 0 }}
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
