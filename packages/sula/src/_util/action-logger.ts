export type ActionsStage = 'action' | 'beforePass' | 'beforeStop' | 'actionSuccess' | 'actionError';

const actionColors = {
  action: '#9e9e9e',
  beforePass: '#5b8c00',
  beforeStop: '#eb2f96',
  actionError: '#f5222d',
  actionSuccess: '#389e0d',
};

const actionLoggers = {
  action(type: ActionsStage, payload: string) {
    console.log(`%caction %c${payload}`, getStyle(actionColors[type]), getStyle('#1890ff'));
  },
  beforePass(type: ActionsStage) {
    console.log(`    %cbefore pass`, getStyle(actionColors[type]));
  },
  beforeStop(type: ActionsStage) {
    console.log(`    %cbefore stop`, getStyle(actionColors[type]));
  },
  actionError(type: ActionsStage, payload: any) {
    console.log(`    %cerror`, getStyle(actionColors[type]), payload);
  },
  actionSuccess(type: ActionsStage, payload: any) {
    console.log(`    %csuccess`, getStyle(actionColors[type]), payload);
  },
};

export default function actionLogger(type: ActionsStage, payload?: any) {
  // @ts-ignore
  if(process.env.SULA_LOGGER==="action" || process.env.SULA_LOGGER==="all") {
    actionLoggers[type](type, payload);
  }
}

function getStyle(color: string, isBold: boolean = true) {
  let style = `color: ${color};`;
  if (isBold) {
    style += `font-weight:bold;`;
  }

  return style;
}