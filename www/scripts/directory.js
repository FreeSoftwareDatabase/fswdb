/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

$(function() {
    let matchfilter = $("#mtc");
    let matchselector = $("#mtct");
    let systemselector = $("#pfs");
    let taskselector = $("#ucs");
    let fdesc = $("#formdesc");
    let fdesce = $("#formdescend");
    let mtype = "";
    let submit = $('#sdirectory button[type="submit"]');
    try {
        systemselector.val(navigator.platform.split(" ", 1)[0]);
    } catch {}
    matchselector.val("pre");
    matchfilter.val("");
    matchselector.on("change", function() {
        let selector = $(this);
        let label = $("#mlabel");
        switch (selector.val()) {
          case "pre":
            mtype = "start";
            break;

          case "pst":
            mtype = "end";
            break;

          case "ter":
            mtype = "start and end";
            break;

          default:
            mtype = "start";
        }
    });
    function updfdesc() {
        let tsval = taskselector.val();
        let ssval = systemselector.val();
        let mfval = matchfilter.val();
        if (tsval != "" && tsval !== undefined && ssval != "" && ssval !== undefined) {
            fdesc.text(`Search for ${tsval.toString().replace("-", " ")}-related resources that are compatible with ${ssval}.`);
        } else {
            fdesc.text("");
        }
        if (mtype != "" && mfval != "") {
            fdesce.text(`Display only the resources that ${mtype} with ${mfval}.`);
            submit.prop("disabled", false);
        } else {
            fdesce.text("");
            submit.prop("disabled", true);
        }
    }
    function updfcategoryicon(e) {
        let icon = $("img#caticon");
        let catname = String($(e.target).val()).valueOf();
        if (catname !== undefined && catname != "") icon.attr("src", `/static/img/uc/${catname}.webp`); else icon.attr("src", "/static/img/uc/category.webp");
    }
    function updfosicon(e) {
        let icon = $("img#OSicon");
        let osname = String($(e.target).val()).valueOf();
        if (osname !== undefined && osname != "") icon.attr("src", `/static/img/os/${osname}.webp`); else icon.attr("src", "/static/img/os/System.webp");
    }
    $("form input, form select").on("change keyup touchend", updfdesc);
    taskselector.on("change", updfcategoryicon).trigger("change");
    systemselector.on("change", updfosicon).trigger("change");
    matchselector.trigger("change");
    updfdesc();
});