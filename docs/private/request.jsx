import React from 'react';
import umiRequest from 'umi-request';
import { request } from 'sula';
import BasicQueryTable from '../query-table/basic';

export default () => {
  return (
    <div>
      <button
        onClick={() => {
          request.impl((options) => {
            const { url, ...restOptions } = options;
            return umiRequest(url, restOptions);
          });
        }}
      >
        使用umi-request
      </button>

      <button onClick={() => {
        request({
          url: 'https://jsonplaceholder.typicode.com/posts/1',
          method: 'GET',
          convertParams: ({params}) => {
            return Object.assign({name: 'sula'}, params);
          }
        }).then((data) => {
          console.log('data: ', data);
        })
      }}>
        发起请求测试
      </button>

      <br />
      <BasicQueryTable />
    </div>
  );
};
