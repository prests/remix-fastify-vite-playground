export default {
  '**/*.{css,html,js,jsx,json,less,md,scss,ts,tsx,yaml}': ['prettier --write'],
  'src/**/*.{js,jsx,ts,tsx}': ['eslint --max-warnings 0'],
  '**/*.{js,ts}?(x)': () => 'tsc',
};
