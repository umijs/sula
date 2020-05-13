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

    it('error message', async (done) => {
      return fetch({ url: '/error.json' }).catch(() => {
        expect(errorSpy).toHaveBeenCalledWith('error');
        done();
      });
    });

    it('error message development', async (done) => {
      process.env.NODE_ENV = 'development';
      return fetch({ url: '/error.json' }).catch(() => {
        expect(errorSpy).toHaveBeenCalledWith('error');
        done();
      });
    });

    it('biz error with desc & message', async (done) => {
      return fetch({ url: '/bizerror.json' }).catch(() => {
        expect(errorSpy).not.toHaveBeenCalled();
        expect(notiSpy).toHaveBeenCalledWith({ description: 'error desc', message: 'error' });
        done();
      });
    });

    it('biz error with desc', async (done) => {
      return fetch({ url: '/bizerror/nomessage.json' }).catch(() => {
        expect(errorSpy).not.toHaveBeenCalled();
        expect(notiSpy).toHaveBeenCalledWith({ description: 'error desc', message: '500' });
        done();
      });
    });

    it('biz error with message', async (done) => {
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
    request.use(
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

    it('costom matchers', async () => {
      const res = await fetch({
        url: '/matchers.json',
        method: 'post',
      });
      expect(res).toEqual({ a: 123, extra: true });
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
