import { OAUTH } from '@/config/oauth';

export function buildAuthorizeUrl(params: {
  challenge: string;
  state: string;
}): string {
  if (!OAUTH.clientId) {
    throw new Error('Не задан VITE_TPU_OAUTH_CLIENT_ID');
  }

  const url = new URL(OAUTH.authorizeUrl);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', OAUTH.clientId);
  url.searchParams.set('redirect_uri', OAUTH.redirectUri);
  url.searchParams.set('state', params.state);
  url.searchParams.set('code_challenge', params.challenge);
  url.searchParams.set('code_challenge_method', 'S256');
  return url.toString();
}
