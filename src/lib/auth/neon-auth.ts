export const neonAuthConfig = {
  baseUrl: process.env.NEON_AUTH_BASE_URL || "",
  jwksUrl: process.env.NEON_AUTH_JWKS_URL || "",
  isConfigured: Boolean(process.env.NEON_AUTH_BASE_URL),
};

export async function fetchNeonAuthJwks() {
  if (!neonAuthConfig.jwksUrl) return null;
  try {
    const res = await fetch(neonAuthConfig.jwksUrl);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
