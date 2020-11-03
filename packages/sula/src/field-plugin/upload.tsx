import React from 'react';
import { Upload as AUpload } from 'antd';
import { UploadProps } from 'antd/lib/upload';
import isArray from 'lodash/isArray';
import assign from 'lodash/assign';
import { getFormDataParams } from '../action-plugin/request';
import { triggerActionPlugin } from '../rope/triggerPlugin';

export default class Upload extends React.Component<UploadProps> {
  onChange = (e) => {
    const { onChange } = this.props;
    const fileList = normalizedFileList(e);
    if (onChange) {
      onChange(fileList);
    }
  };

  customRequest = ({ filename, file, onError, onProgress, onSuccess }) => {
    const { request: requestConfig, ctx } = this.props;
    let formDataPrams = { [filename]: file };
    formDataPrams = getFormDataParams(formDataPrams, requestConfig.params)

    const finalRequestConfig = assign({}, requestConfig, {
      params: formDataPrams,
      method: 'POST',
      onUploadProgress: ({ total, loaded }) => {
        onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file);
      },
    });
    
    triggerActionPlugin(ctx, finalRequestConfig)
      .then((data) => {
        onSuccess({ response: data }, file);
      })
      .catch(onError);
  };

  render() {
    const { request, ...restProps } = this.props;
    return (
      <AUpload
        {...restProps}
        onChange={this.onChange}
        fileList={normalizedFileList(this.props.fileList)}
        {...(request ? { customRequest: this.customRequest } : {})}
      />
    );
  }
}

function normalizedFileList(fileList) {
  if (!fileList) {
    return null;
  }
  if (isArray(fileList)) {
    return fileList;
  }
  return fileList.fileList;
}
