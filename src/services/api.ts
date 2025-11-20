let tokenGetter: () => Promise<string | null>;

export function setTokenGetter(getter: () => Promise<string | null>) {
  tokenGetter = getter;
}

export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = tokenGetter ? await tokenGetter() : null;

  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
