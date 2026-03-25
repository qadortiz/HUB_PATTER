module.exports = {
  default: {
    timeout: 90000,
    require: [
      'src/support/**/*.ts',           // ← AGREGAR ESTA LÍNEA
      'features/step_definitions/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
      'junit:reports/cucumber-report.xml'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    parallel: 2
  }
};