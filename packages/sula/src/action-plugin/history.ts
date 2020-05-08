import queryString from 'query-string';
import isUndefined from 'lodash/isUndefined';

export const back = (ctx) => {
  ctx.history.goBack();
}

export const forward = (ctx) => {
  ctx.history.goForward();
}

export const route = (ctx, config) => {
  ctx.history.push(generateRouterOptions(config));
}


function generateRouterOptions(config) {
  const { query, search, path } = config;
  if (isUndefined(query) && isUndefined(search)) {
    return path;
  }

  const finalSearch = search || `?${queryString.stringify(query)}`;

  return {
    pathname: path,
    search: finalSearch,
  };
}