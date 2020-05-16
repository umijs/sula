import React from 'react';
import Icon from './Icon';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';

export default class LoadingIcon extends React.Component {
  render() {
    return (
      <Icon
        {...this.props}
        loading
        type="loading"
        iconMapper={{
          loading: {
            outlined: LoadingOutlined,
          },
        }}
      />
    );
  }
}
