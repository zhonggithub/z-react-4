import 'isomorphic-fetch';

export default (url, body, method) => {
  const config = {
    method: method || (body ? 'POST' : 'GET'),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      token: sessionStorage.getItem('jwt:token'),
    },
    body: body ? JSON.stringify(body) : null,
    credentials: 'include',
  };
  if (method === 'delete' || method === 'DELETE') {
    delete config.body;
  }
  return fetch(url, config);
};
