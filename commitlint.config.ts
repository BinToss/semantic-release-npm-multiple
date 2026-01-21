const disabled = 0;
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [disabled],
    'footer-max-line-length': [disabled],
    'header-max-length': [disabled],
  },
};
