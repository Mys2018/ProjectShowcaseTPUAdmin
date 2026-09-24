export const OAUTH = {
  clientId: import.meta.env.VITE_TPU_OAUTH_CLIENT_ID as string | undefined,
  authorizeUrl:
    (import.meta.env.VITE_OAUTH_AUTHORIZE_URL as string | undefined) ||
    'https://oauth.tpu.ru/authorize',
  redirectUri:
    (import.meta.env.VITE_OAUTH_REDIRECT_URI as string | undefined) ||
    `${window.location.origin}/auth/callback`,
};
