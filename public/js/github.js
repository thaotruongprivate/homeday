$(document).ready(function () {
    const $repo = $('#repo');
    const $repoInput = $('#repo-autocomplete');
    const $contributors = $('#contributors');

    $repoInput.autocomplete({
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
                    drawBarChart(
                        data.names,
                        data.contributions,
                        'Contribution chart of repo "' + selectedRepo + '"'
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
    });

    function drawBarChart(xAxis, yAxis, label) {
        label = label || '';
        $('#myChart').remove();
        $contributors.append('<canvas id="myChart"></canvas>');
        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: xAxis,
                datasets: [{
                    label: label,
                    data: yAxis
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }
});