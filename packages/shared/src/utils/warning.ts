export const warning = (valid: boolean, message: string, scope?: string, ) => {
  if (typeof console === 'undefined') return
  if(valid) return;

  const prefix = scope ? `[scope]` : '';
  const log = `${prefix}: ${message}`;

  if(process.env.NODE_ENV !== 'production') {
    return console.error(log)
  }

  console.warn(log);
}