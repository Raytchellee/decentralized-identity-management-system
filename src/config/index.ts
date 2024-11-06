const config = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api-url.com',
};

Object.entries(config).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`missing required ${key} env variable`);
  }
});

export default config;
