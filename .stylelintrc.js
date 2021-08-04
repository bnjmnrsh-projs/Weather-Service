module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended',
    'stylelint-config-rational-order',
    // '@wordpress/stylelint-config/scss',
    'stylelint-config-prettier'
  ],
  plugins: [
    'stylelint-a11y',
    'stylelint-high-performance-animation',
    'stylelint-no-unsupported-browser-features',
    'stylelint-use-nesting',
    'stylelint-scss'
  ],
  rules: {
    // browserslist supported
    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'warning',
        ignorePartialSupport: true
      }
    ],
    // a11y
    'a11y/media-prefers-reduced-motion': true,
    'a11y/no-outline-none': true,
    'a11y/selector-pseudo-class-focus': true,
    // nesting & order
    'csstools/use-nesting': 'always', // || "ignore"

    // animations
    'plugin/no-low-performance-animation-properties': [
      true,
      {
        ignoreProperties: ['color', 'background-color', 'box-shadow']
      }
    ],
    // SCSS Recomended
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': null,
    'scss/dollar-variable-pattern': '^[a-z][a-zA-Z0-9]+$',
    'scss/selector-no-redundant-nesting-selector': true
  }
}
