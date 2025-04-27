const BASE_URL = process.env.NEXT_PUBLIC_ENV_API_URL;

const service = async (url, method, options = {}, headerConfig = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headerConfig,
      },
      signal: controller.signal,
      ...options,
      // cache: 'no-store',
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }

    throw new Error(await res.text());
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('请求超时，请稍后重试');
    }
    throw error;
  }
};

export function get(url, params = {}, options = {}, headerConfig = {}) {
  const queryString = Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  return service(`${url}?${queryString}`, 'GET', options, headerConfig);
}

export function post(url, data = {}, options = {}, headerConfig = {}) {
  return service(url, 'POST', { body: JSON.stringify(data), ...options }, headerConfig);
}
