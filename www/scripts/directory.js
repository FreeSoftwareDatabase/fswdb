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
    matchselector.val("");
    matchfilter.val("");
    matchselector.on("change", function() {
        let selector = $(this);
        let label = $("#mlabel");
        switch (selector.val()) {
          case "pre":
            mtype = "start with";
            break;

          case "pst":
            mtype = "end with";
            break;

          case "ter":
            mtype = "start and end with";
            break;

          case "snd":
            mtype = "sound like";
            break;

          default:
            mtype = "";
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
        matchfilter.prop("disabled", mtype == "" || mtype == undefined);
        if (mtype != "" && mtype != undefined && mfval != undefined && mfval != "") {
            fdesce.text(`Display only the resources that ${mtype} “${mfval}”.`);
        } else {
            fdesce.text("");
        }
        if (tsval == "" || tsval === undefined || ssval == "" || ssval === undefined || mtype == "" || mtype === undefined || mfval == "" || mfval === undefined) {
            submit.prop("disabled", true);
        } else {
            submit.prop("disabled", false);
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
    function updffiltericon(e) {
        let icon = $("img#filtericon");
        let filtername = String($(e.target).val()).valueOf();
        if (filtername !== undefined && filtername != "") icon.attr("src", `/static/img/filters/${filtername}.webp`); else icon.attr("src", "/static/img/filters/Filter.webp");
    }
    $("form input, form select").on("change keyup touchend", updfdesc);
    taskselector.on("change", updfcategoryicon).trigger("change");
    systemselector.on("change", updfosicon).trigger("change");
    matchselector.on("change", updffiltericon).trigger("change");
    updfdesc();
});