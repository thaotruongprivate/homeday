const jQuery = require('jquery');
const autocomplete = require('jquery-autocomplete');
const Chart = require('./chart');

(function(window, $) {
    class GitHub {
        constructor($wrapper) {
            this.$wrapper = $wrapper;

            this.$wrapper.autocomplete({
                source: function (request, response) {
                    const $repoError = $('.error', $repo);
                    $.ajax({
                        method: 'POST',
                        data: {
                            username: $repoInput.val().split('/')[0],
                            repo: $repoInput.val().split('/')[1]
                        },
                        beforeSend: function () {
                            $repoError.html('');
                        },
                        url: $repoInput.attr('data-url'),
                        dataType: "json",
                        success: function (data) {
                            response(data.repos);
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            const data = JSON.parse(xhr.responseText);
                            if (data.error) {
                                $repoError.html(data.error);
                            }
                        }
                    })
                },
                minLength: 3,
                select: function (event, ui) {
                    const $contributorError = $('.error', $contributors);
                    const $contributorChart = $('#myChart');
                    const selectedRepo = ui.item.value;

                    $.ajax({
                        method: 'POST',
                        data: {
                            'username': selectedRepo.split('/')[0],
                            'repo': selectedRepo.split('/')[1]
                        },
                        beforeSend: function () {
                            $contributors.hide();
                            $('.error').html('');
                        },
                        url: $repoInput.attr('data-url-contributors'),
                        dataType: "json",
                        success: function (data) {
                            $contributorChart.show();
                            const chart = new Chart($('.canvas', $contributorChart));
                            chart.drawChart(
                                data.names,
                                data.contributions,
                                {
                                    label: 'Contribution chart of repo "' +selectedRepo + '"'
                                }
                            );
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            const data = JSON.parse(xhr.responseText);
                            $contributorChart.hide();
                            if (data.error) {
                                $contributorError.html(data.error);
                            }
                        }
                    }).complete(function () {
                        $contributors.show();
                    });
                }
            })
        }
    }
    window.GitHub = GitHub;
})(window, jQuery);
