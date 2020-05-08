export const isPromise = obj =>
  !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';

export const isFormData = data => {
  return typeof FormData !== 'undefined' && data instanceof FormData;
}
