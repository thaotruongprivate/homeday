const $ = require('jquery');
require('jquery-ui/ui/widgets/autocomplete');
const Chart = require('./Chart');
const Routing = require('./Routing');

class GitHubApp {
    constructor($wrapper) {
        this.$wrapper = $wrapper;

        $('.autocomplete', this.$wrapper).autocomplete({
            source: this._onInputChange,
            select: this._onSelect,
            minLength: 1,
            open: function() {
                $("ul.ui-menu").width( $(this).innerWidth());
            }
        });
    }

    _onSelect(event, ui) {
        const $contributors = $('#contributors', this.$wrapper);
        const $canvasDiv = $('.canvas', this.$wrapper);

        $contributors.hide();
        $canvasDiv.html('');
        $('.error', this.$wrapper).html('');

        $.ajax({
            url: `${Routing.generate('show_repo_contributors')}?query=${encodeURIComponent(ui.item.value)}`,
            dataType: 'json',
            success: (data) => {
                $contributors.show();
                const chart = new Chart($canvasDiv);
                chart.drawChart(
                    data.names,
                    data.contributions,
                    {
                        label: `Contributions in project ${ui.item.value}`
                    }
                );
            },
            error: (xhr) => {
                $('.error', this.$wrapper).html(JSON.parse(xhr.responseText).error);
            }
        });
    }

    _onInputChange(request, response) {

        $('.error', this.$wrapper).html('');
        $('#contributors', this.$wrapper).hide();

        if (/[^\/]+\/[^\/]*/i.exec(request.term) === null) {
            $('.error', this.$wrapper).html("Please write username optionally with repo's name in the correct format")
            return false;
        }

        $.ajax({
            url: `${Routing.generate('show_repos')}?query=${encodeURIComponent(request.term)}`,
            dataType: 'json',
            success: (data) => {
                response(data.repos);
            },
            error: (xhr) => {
                $('.error', this.$wrapper).html(
                    JSON.parse(xhr.responseText).error
                );
            }
        });
    }
}

module.exports = GitHubApp;