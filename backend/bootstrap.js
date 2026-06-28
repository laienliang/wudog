const { Bootstrap } = require('@midwayjs/bootstrap');

Bootstrap.configure({
  // eslint-disable-next-line node/no-unpublished-require
  imports: require('./dist/index'),
  moduleDetector: false,
}).run();
