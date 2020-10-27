// eslint-disable-next-line import/no-extraneous-dependencies
import { message as amessage, notification } from 'antd';
import { request, getFormDataParams } from '../request';
import './request.mock';

function fetch(params) {
  return request(params, {});
}

let successSpy;
let errorSpy;
let notiSpy;

describe('sula request', () => {
  describe('sula request', () => {
    beforeEach(() => {
      successSpy = jest.spyOn(amessage, 'success').mockImplementation(() => {});
      errorSpy = jest.spyOn(amessage, 'error').mockImplementation(() => {});
      notiSpy = jest.spyOn(notification, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      successSpy.mockRestore();
      errorSpy.mockRestore();
      notiSpy.mockRestore();
      amessage.destroy();
      notification.destroy();
    });

    it('comstom success message', async () => {
      const res = await fetch({
        url: '/success.json',
        successMessage: 'success!!!',
        method: 'post',
      });
      expect(res).toEqual({ a: 123 });
      expect(successSpy).toHaveBeenCalledWith('success!!!');
    });

    it('remote success message', async () => {
      const res = await fetch({ url: '/success.json', method: 'delete', successMessage: true });
      expect(res).toEqual({ a: 123 });
      expect(successSpy).toHaveBeenCalledWith('success');
    });

    it('hidden success message', async () => {
      const res = await fetch({ url: '/success.json', method: 'post', successMessage: false });
      expect(res).toEqual({ a: 123 });
      expect(successSpy).not.toHaveBeenCalled();
    });

    it('error message', (done) => {
      return fetch({ url: '/error.json' }).catch(() => {
        expect(errorSpy).toHaveBeenCalledWith('error');
        done();
      });
    });

    it('error message development', (done) => {
      process.env.NODE_ENV = 'development';
      return fetch({ url: '/error.json' }).catch(() => {
        expect(errorSpy).toHaveBeenCalledWith('error');
        done();
      });
    });

    it('biz error with desc & message', (done) => {
      return fetch({ url: '/bizerror.json' }).catch(() => {
        expect(errorSpy).not.toHaveBeenCalled();
        expect(notiSpy).toHaveBeenCalledWith({ description: 'error desc', message: 'error' });
        done();
      });
    });

    it('biz error with desc', (done) => {
      return fetch({ url: '/bizerror/nomessage.json' }).catch(() => {
        expect(errorSpy).not.toHaveBeenCalled();
        expect(notiSpy).toHaveBeenCalledWith({ description: 'error desc', message: '500' });
        done();
      });
    });

    it('biz error with message', (done) => {
      return fetch({ url: '/bizerror/nodesc.json' }).catch(() => {
        expect(errorSpy).not.toHaveBeenCalled();
        expect(notiSpy).toHaveBeenCalledWith({ description: 'error', message: 'error' });
        done();
      });
    });

    it('redirect', async () => {
      window.location.assign = jest.fn();
      await fetch({ url: '/redirect.json' });
      expect(window.location.assign).toHaveBeenCalledWith('http://www.github.com');
      window.location.assign.mockClear();
    });

    it('converter params', async () => {
      const res = await fetch({
        url: '/params.json',
        method: 'post',
        params: { id: 1 },
        convertParams: ({ params }) => {
          return {
            ...params,
            extra: true,
          };
        },
      });
      expect(res.body).toEqual(JSON.stringify({ id: 1, extra: true }));
    });

    it('converter response', async () => {
      const res = await fetch({
        url: '/success.json',
        converter: ({ data }) => {
          return {
            ...data,
            extra: true,
          };
        },
      });
      expect(res).toEqual({ a: 123, extra: true });
    });

    it('bizdata adapter', async () => {
      const res = await fetch({ url: '/response.json' });
      expect(res).toEqual({ id: 123 });
    });
  });

  describe('global config matchers', () => {
    it('costom matchers', async () => {
      await request.use(
        (reqConfig) => {
          if (reqConfig.url === '/matchers.json') {
            return true;
          }
          return false;
        },
        {
          bizDataAdapter(res) {
            return {
              ...res.data,
              extra: true,
            };
          },
        },
      );

      request.use(true, {});
      const res = await fetch({
        url: '/matchers.json',
        method: 'post',
      });
      expect(res).toEqual({ a: 123, extra: true });
    });

    it('bizParamsAdapter', async () => {
      await request.use({
        bizParamsAdapter(params) {
          const { testParams, ...otherParams } = params || {};
          return otherParams;
        },
      });
      const res = await fetch({
        url: '/params.json',
        method: 'post',
        params: { testParams: 12, id: 1 },
      });
      expect(res.body).toEqual(JSON.stringify({ id: 1 }));
    });

    it('bizRequestAdapter', async () => {
      await request.use({
        bizRequestAdapter(requestConfig) {
          const { method, params, data } = requestConfig;
          const { requestParams, ...otherParams } = data || params || {};
          let keys = 'params';
          if (method === 'post') {
            keys = 'data';
          }
          return { ...requestConfig, [keys]: otherParams };
        },
      });
      const res = await fetch({
        url: '/params.json',
        method: 'post',
        params: { requestParams: 12, id: 1 },
      });
      expect(res.body).toEqual(JSON.stringify({ id: 1 }));
    });

    it('global bizRedirectHandler', async () => {
      window.location.assign = jest.fn();
      await request.use({
        bizRedirectHandler(response) {
          const { data, code } = response;
          const codeNum = Number(code);
          if (codeNum >= 300 && codeNum < 400 && data?.redirectUrl) {
            window.location.assign(data.redirectUrl);
          }
        },
      });
      await fetch({ url: '/global/redirect.json' });
      expect(window.location.assign).toHaveBeenCalledWith('http://www.github.com');
      window.location.assign.mockClear();
    });

    it('global bizDevErrorAdapter', async () => {
      await request.use({
        bizDevErrorAdapter(response) {
          const { code, success, errorMessage, description } = response;
          const codeNum = Number(code);
          if (success === false && codeNum >= 400) {
            return {
              message: errorMessage,
              description: description,
            };
          }
          return null;
        },
      });
      return fetch({ url: '/global/errorAdapter.json' }).catch((error) => {
        expect(error).toEqual({ message: 'error', description: 'error description' });
      });
    });

    it('global bizErrorMessageAdapter', async () => {
      await request.use({
        bizErrorMessageAdapter(response) {
          const { code, success, errorMessage } = response;
          const codeNum = Number(code);
          if (success === false && codeNum < 300) {
            return errorMessage;
          }
          return null;
        },
      });

      return fetch({ url: '/global/errorMessageAdapter.json' }).catch((error) => {
        expect(error).toEqual('error message');
      });
    });

    it('global bizSuccessMessageAdapter', async () => {
      await request.use({
        bizSuccessMessageAdapter(response, successMessage) {
          const { success, message: successMes } = response;
          if (successMessage === false) {
            return null;
          }
          if (success !== false) {
            if (successMessage === true) {
              return successMes;
            }
            return successMessage;
          }
        },
      });

      await request.use({
        bizNotifyHandler(notifyMessages) {
          const { successMessage } = notifyMessages;
          if (successMessage) {
            expect(successMessage).toEqual('success message');
          }
        },
      });

      return fetch({ url: '/global/successMessageAdapter.json', successMessage: true });
    });

    it('global bizDataAdapter', async () => {
      await request.use({
        bizDataAdapter(response) {
          if (response?.list) {
            return response.list;
          }
          return response;
        },
      });
      return fetch({ url: '/global/dataAdapter.json' }).then((response) => {
        expect(response).toEqual([{ name: 'name' }]);
      });
    });
  });

  describe('getFormDataParams', () => {
    it('formData', () => {
      const formDataIerator = (data) => {
        const finalData = {};
        // eslint-disable-next-line no-restricted-syntax
        for (const pair of data.entries()) {
          const [key, value] = pair;
          finalData[key] = value;
        }
        return finalData;
      };

      expect(formDataIerator(getFormDataParams({ a: 1, b: 2, c: ['1'] }))).toEqual({
        a: '1',
        b: '2',
        c: '1',
      });
      expect(
        formDataIerator(
          getFormDataParams(
            { a: 1, b: 2, c: ['1'] },
            {
              m: 1,
              n: 2,
              o: [1, 2, 3],
            },
          ),
        ),
      ).toEqual({ a: '1', b: '2', c: '1', m: '1', n: '2', o: '3' });
      expect(
        formDataIerator(
          getFormDataParams(
            { a: 1, b: { originFileObj: 'bbb' }, c: [{ originFileObj: 'ccc' }] },
            {
              m: 1,
              n: 2,
              o: [1, 2, 3],
            },
          ),
        ),
      ).toEqual({ a: '1', b: 'bbb', c: 'ccc', m: '1', n: '2', o: '3' });
    });
  });
});
