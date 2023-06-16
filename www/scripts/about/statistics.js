/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

var Stats;

(function(Stats) {
    let Charts;
    (function(Charts) {
        function karmatitleformat(o) {
            return `${o[0].label} Karma points`;
        }
        function karmasubtitleformat(o) {
            let karma = Number(o[0].label).valueOf();
            if (karma < 0) return `(bad Karma)`; else if (karma > 2) return `(outstanding Karma)`; else return `(good Karma)`;
        }
        function pushnumtoarray(e, a) {
            let t = $(e).text();
            let n = Number(t).valueOf();
            a.push(n);
        }
        function renderviewschart() {
            let viewKarma = Array();
            let viewAverages = Array();
            $(".vdk").each(function(i, element) {
                pushnumtoarray(element, viewKarma);
            });
            $(".vdavg").each(function(i, element) {
                pushnumtoarray(element, viewAverages);
            });
            const ctx = $("canvas#views");
            return new Chart(ctx, {
                type: "line",
                data: {
                    labels: viewKarma,
                    datasets: [ {
                        label: "# of Views",
                        xAxisID: "xAxis",
                        yAxisID: "yAxis",
                        data: viewAverages
                    } ]
                },
                options: {
                    animation: {
                        duration: 0
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: "Average views per Karma points"
                        },
                        tooltip: {
                            callbacks: {
                                title: karmatitleformat,
                                afterTitle: karmasubtitleformat
                            },
                            displayColors: false
                        }
                    },
                    scale: {
                        ticks: {
                            beginAtZero: true
                        }
                    },
                    scales: {
                        xAxis: {
                            title: {
                                display: true,
                                text: "# Karma points"
                            }
                        },
                        yAxis: {
                            title: {
                                display: true,
                                text: "# views (average)"
                            }
                        }
                    },
                    elements: {
                        line: {
                            tension: .3
                        },
                        point: {
                            radius: 10,
                            backgroundColor: "transparent",
                            borderColor: "goldenrod"
                        }
                    }
                }
            });
        }
        Charts.renderviewschart = renderviewschart;
        function renderkarmachart() {
            let karmaPoints = Array();
            let karmaCount = Array();
            $(".kdk").each(function(i, element) {
                pushnumtoarray(element, karmaPoints);
            });
            $(".kdcount").each(function(i, element) {
                pushnumtoarray(element, karmaCount);
            });
            const ctx2 = $("canvas#karma");
            return new Chart(ctx2, {
                type: "bar",
                data: {
                    labels: karmaPoints,
                    datasets: [ {
                        label: "# of Resources",
                        xAxisID: "xAxis",
                        yAxisID: "yAxis",
                        data: karmaCount,
                        backgroundColor: [ "rgba(239,41,41,0.7)", "rgba(204,0,0,0.7)", "rgba(164,0,0,0.7)", "rgba(206,92,0,0.7)", "rgba(245,121,0,0.7)", "rgba(196,160,0,0.7)", "rgba(78,154,6,0.7)", "rgba(56,115,0,0.7)", "rgba(56,115,0,0.7)", "rgba(56,115,0,0.7)" ],
                        borderColor: [ "goldenrod" ],
                        borderWidth: 1
                    } ]
                },
                options: {
                    animation: {
                        duration: 0
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: "Resource count per Karma points"
                        },
                        tooltip: {
                            callbacks: {
                                title: karmatitleformat,
                                afterTitle: karmasubtitleformat
                            },
                            displayColors: false
                        }
                    },
                    scale: {
                        ticks: {
                            beginAtZero: true
                        }
                    },
                    scales: {
                        xAxis: {
                            title: {
                                display: true,
                                text: "# Karma points"
                            }
                        },
                        yAxis: {
                            title: {
                                display: true,
                                text: "# resources"
                            }
                        }
                    }
                }
            });
        }
        Charts.renderkarmachart = renderkarmachart;
        function renderageschart() {
            let karmaPoints = Array();
            let fulleditAge = Array();
            let improvementAge = Array();
            $(".adk").each(function(i, element) {
                pushnumtoarray(element, karmaPoints);
            });
            $(".eageavg").each(function(i, element) {
                pushnumtoarray(element, fulleditAge);
            });
            $(".iageavg").each(function(i, element) {
                pushnumtoarray(element, improvementAge);
            });
            const ctx2 = $("canvas#ages");
            return new Chart(ctx2, {
                type: "bar",
                data: {
                    labels: karmaPoints,
                    datasets: [ {
                        label: "# days (edit)",
                        xAxisID: "xAxis",
                        yAxisID: "yAxis",
                        data: fulleditAge,
                        borderColor: [ "goldenrod" ],
                        borderWidth: 1
                    }, {
                        label: "# days (improv)",
                        xAxisID: "xAxis",
                        yAxisID: "yAxis",
                        data: improvementAge,
                        borderColor: [ "lightblue" ],
                        borderWidth: 1
                    } ]
                },
                options: {
                    animation: {
                        duration: 0
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: "Last edit age per Karma points"
                        },
                        tooltip: {
                            callbacks: {
                                title: karmatitleformat,
                                afterTitle: karmasubtitleformat
                            },
                            displayColors: false
                        }
                    },
                    scale: {
                        ticks: {
                            beginAtZero: true
                        }
                    },
                    scales: {
                        xAxis: {
                            title: {
                                display: true,
                                text: "# Karma points"
                            }
                        },
                        yAxis: {
                            title: {
                                display: true,
                                text: "# days"
                            }
                        }
                    }
                }
            });
        }
        Charts.renderageschart = renderageschart;
    })(Charts = Stats.Charts || (Stats.Charts = {}));
})(Stats || (Stats = {}));

$(function() {
    let karmachart = Stats.Charts.renderkarmachart();
    let viewschart = Stats.Charts.renderviewschart();
    let ageschart = Stats.Charts.renderageschart();
    window.setInterval(function() {
        karmachart.render();
        viewschart.render();
        ageschart.render();
    }, 500);
});