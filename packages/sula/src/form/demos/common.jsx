export const remoteSource = {
  url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
  method: 'GET',
  params: {
    type: 'remoteSource',
  },
  converter({ data }) {
    return [
      {
        text: '苹果',
        value: 'apple',
      },
      {
        text: '桃子',
        value: 'peach',
      },
    ];
  },
};

export const remoteValues = {
  url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
  method: 'GET',
  params: {
    type: 'remoteValues',
  },
  converter({ data }) {
    return {
      input: 'input',
      input1: 'input1',
      input2: 'input2',
      select: 'apple',
    };
  },
};

export const submit = {
  url: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
  method: 'GET',
  params: {
    name: 'sula',
  },
  finish: (ctx) => {
    console.log('ctx: ', ctx);
    return ctx.result;
  },
};
