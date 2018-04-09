'use strict';

const ChartJs = require('chartjs');

class Chart {
    constructor($wrapper) {
        this.wrapper = $wrapper;
    }

    drawChart(xAxisValues, yAxisValues, options) {
        options = options || {};
        jQuery.extend(options, {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        });

        $('canvas', this.wrapper).remove();
        this.wrapper.append('<canvas id="myChart"></canvas>');
        const ctx = document.getElementById('myChart').getContext('2d');
        new ChartJs(ctx, {
            type: 'bar',
            data: {
                labels: xAxisValues,
                datasets: [{
                    label: options.label || '',
                    data: yAxisValues
                }]
            },
            options: options
        });
    }
}

module.exports = Chart;