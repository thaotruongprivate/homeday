const $ = require('jquery');
const GitHubApp = require('./component/GitHubApp');
require('babel-polyfill');
require("jquery-ui/themes/base/core.css");
require("jquery-ui/themes/base/theme.css");
require("jquery-ui/themes/base/autocomplete.css");
require("../css/github.css");

$(document).ready(function () {
    const $wrapper = $('.js-github');
    const gitHubApp = new GitHubApp($wrapper);
});