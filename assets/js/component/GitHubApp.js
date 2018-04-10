const $ = require('jquery');
require('jquery-ui/ui/widgets/autocomplete');
const Chart = require('./Chart');
const Routing = require('./Routing');

class GitHubApp {
    constructor($wrapper) {
        this.$wrapper = $wrapper;

        $('.js-autocomplete', this.$wrapper).autocomplete({
            source: this._onInputChange,
            select: this._onSelect,
            minLength: 1,
            open: function () {
                $("ul.ui-menu").width($(this).innerWidth());
            }
        });
    }

    _onSelect(event, ui) {
        $('.js-error', this.$wrapper).html('');
        $.ajax({
            url: `${Routing.generate('show_repo_contributors')}?query=${encodeURIComponent(ui.item.value)}`,
            dataType: 'json',

            success: (data) => {
                const chart = new Chart($('.js-canvas', this.$wrapper));
                chart.drawChart(
                    data.names,
                    data.contributions,
                    {
                        label: `Contributions in project ${ui.item.value}`
                    }
                );
                $('.js-canvas', this.$wrapper).show();
            },
            error: (xhr) => {
                $('.js-error', this.$wrapper).html(JSON.parse(xhr.responseText).error);
            }
        });
    }

    _onInputChange(request, response) {

        $('.js-error', this.$wrapper).html('');
        $('.js-canvas', this.$wrapper).hide();

        if (/[^\/]+\/[^\/]*/i.exec(request.term) === null) {
            $('.js-error', this.$wrapper).html("Please write username optionally with repo's name in the correct format")
            return false;
        }

        $.ajax({
            url: `${Routing.generate('show_repos')}?query=${encodeURIComponent(request.term)}`,
            dataType: 'json',
            success: (data) => {
                response(data.repos);
            },
            error: (xhr) => {
                $('.js-error', this.$wrapper).html(
                    JSON.parse(xhr.responseText).error
                );
            }
        });
    }
}

module.exports = GitHubApp;