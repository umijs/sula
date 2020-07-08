export type PluginCtx = Record<string, any>;
export type LazyPluginCtxGetter = () => PluginCtx;
export type LazyPluginCtx = {
  ctxGetter?: LazyPluginCtxGetter | Record<string, LazyPluginCtxGetter>;
  [key: string]: any;
};


/**
 * {
 *   record: { name: 'sula' },
 *   table: {// tableInstance },
 *   ctxGetter: () => {
 *      return {
 *        xyz: 'xyz'
 *      }
 *   }
 * } =>
 * {
 *   record: { name: 'sula' },
 *   table: { // tableInstance },
 *   modalGetter: () => { // modal or drawer },
 *   xyz: 'xyz',
 * }
 */
