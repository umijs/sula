import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const request = (options: AxiosRequestConfig): Promise<any> => {
  return axios(options);
};

export const dataResolver = (res: AxiosResponse) : any => {
  return res && res.data;
}
