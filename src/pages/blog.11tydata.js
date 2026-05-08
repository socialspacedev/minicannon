const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

module.exports = function () {
  const ui = yaml.load(fs.readFileSync(path.join(__dirname, '../_data/ui.yaml'), 'utf8'));
  return {
    pagination: {
      size: ui.postsPerPage
    }
  };
};
