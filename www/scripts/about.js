/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

var Stats;

(function(Stats) {
    let extratimeout = 0;
    let Page;
    (function(Page) {
        function scroll(e) {
            window.scrollTo(e.data.X, e.data.Y);
        }
        Page.scroll = scroll;
        function mgrkarmaslider(e) {
            let slider = $(e.target);
            let label = e.data.label;
            let sval = Number(slider.val());
            let percLikes = (sval + 5) / 10 * 100;
            if (sval < -1) label.text(sval + " (" + percLikes + "%): bad."); else if (sval > 2) label.text(sval + " (" + percLikes + "%): outstanding."); else if (sval > 1) label.text(sval + " (" + percLikes + "%): good."); else label.text(sval + " (" + percLikes + "%): neutral.");
        }
        function load(e) {
            $(e.data.into).load("/about/stats", function(response, status, xhr) {
                if (status != "error") {
                    extratimeout = 0;
                    $("#dq").on("change input", {
                        label: $("label[for=dq]")
                    }, mgrkarmaslider);
                    Charts.loadlib();
                } else {
                    extratimeout += 350;
                    window.setTimeout(function() {
                        load(e);
                    }, 500 + extratimeout / 2);
                }
            });
        }
        Page.load = load;
    })(Page = Stats.Page || (Stats.Page = {}));
    let Charts;
    (function(Charts) {
        function renderviewschart(e) {
            if (Chart.getChart(e.data.id) != undefined) return;
            let viewKarma = Array();
            let viewAverages = Array();
            $(".vdk").each(function() {
                viewKarma.push(Number($(this).text()).valueOf());
            });
            $(".vdavg").each(function() {
                viewAverages.push(Number($(this).text()).valueOf());
            });
            const ctx = $("#" + e.data.id);
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: viewKarma,
                    datasets: [ {
                        label: "# of Views",
                        data: viewAverages,
                        backgroundColor: [ "rgba(52,101,164,0.7)" ],
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
                        }
                    },
                    scale: {
                        ticks: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        function renderkarmachart(e) {
            if (Chart.getChart(e.data.id) != undefined) return;
            let karmaKarma = Array();
            let karmaCount = Array();
            $(".kdk").each(function() {
                karmaKarma.push(Number($(this).text()).valueOf());
            });
            $(".kdcount").each(function() {
                karmaCount.push(Number($(this).text()).valueOf());
            });
            const ctx2 = $("#" + e.data.id);
            new Chart(ctx2, {
                type: "bar",
                data: {
                    labels: karmaKarma,
                    datasets: [ {
                        label: "# of Resources",
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
                        }
                    },
                    scale: {
                        ticks: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        function refreshchart(e) {
            let chart = Chart.getChart(e.data.id);
            if (chart !== undefined) chart.render();
        }
        function destroychart(e) {
            let chart = Chart.getChart(e.data.id);
            if (chart !== undefined) chart.destroy();
        }
        function enabletabs() {
            let viewsPanelModal = $("#viewsTableModal");
            let karmaPanelModal = $("#karmaTableModal");
            $(".chartbutton").removeAttr("disabled");
            $("#vchpanelabel").on("show.bs.tab", {
                id: "vch"
            }, refreshchart);
            viewsPanelModal.on("show.bs.modal", {
                id: "vch"
            }, renderviewschart);
            viewsPanelModal.on("hidden.bs.modal", {
                id: "vch"
            }, destroychart);
            $("#kchpanelabel").on("show.bs.tab", {
                id: "kch"
            }, refreshchart);
            karmaPanelModal.on("show.bs.modal", {
                id: "kch"
            }, renderkarmachart);
            karmaPanelModal.on("hidden.bs.modal", {
                id: "kch"
            }, destroychart);
        }
        function loadlib() {
            let chrtjs = $("#chrtjs");
            chrtjs.attr("src", chrtjs.data("src"));
            chrtjs.removeData("src");
            chrtjs.on("load", enabletabs);
        }
        Charts.loadlib = loadlib;
    })(Charts || (Charts = {}));
})(Stats || (Stats = {}));

var Tor;

(function(Tor) {
    function copylink(e) {
        let val = String($(e.target).val()).toString();
        let clipboard = navigator.clipboard;
        if (clipboard !== undefined) {
            clipboard.writeText(val);
        }
    }
    Tor.copylink = copylink;
})(Tor || (Tor = {}));

$(function() {
    $("button[data-bs-toggle=modal]").on("click", {
        x: 0,
        y: 0
    }, Stats.Page.scroll);
    $("a.torlink").on("click", Tor.copylink);
    $("#karmaAccordion-collapseTwo").on("show.bs.collapse", {
        into: "#statsplace"
    }, Stats.Page.load);
});