const config = {
  name: 'The Game',
  projectId: process.env.GCP_PROJECT_ID || '',
  cookieName: process.env.COOKIE_NAME || '',
  cookiePassword: process.env.COOKIE_PASSWORD || '',
}

export default config
