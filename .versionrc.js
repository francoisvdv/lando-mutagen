const tracker = {
  filename: 'package.json',
  type: "json"
}

const config = {
  "header": "# Changelog \r\n\r\nAll notable changes to this project will be documented in this file.",
  "types": [
    {"type":"feat","section":"Features","hidden":false},
    {"type":"fix","section":"Bug Fixes","hidden":false},
    {"type":"style","section":"Styling Changes","hidden":false},
    {"type":"perf","section":"Performance","hidden":false},
    {"type":"docs","section":"Documentation","hidden":false},
    {"type":"refactor","section":"Other","hidden":true},
    {"type":"chore","section":"Chore","hidden":true},
    {"type":"test","section":"Testing","hidden":true}
  ],
  "bumpFiles": [tracker],
  "packageFiles": [tracker]
};
console.log('standard-version config:', config);
module.exports = config;