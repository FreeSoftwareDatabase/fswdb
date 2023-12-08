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
    function getselectedoptions(selector) {
        let options = selector.children("option");
        let selected = options.filter((i, e) => {
            return e.selected;
        });
        selected.total = options.length;
        return selected;
    }
    function alloptionsselected(selector) {
        let selected = getselectedoptions(selector);
        return selected.length == selected.total;
    }
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
        let anytask = alloptionsselected(taskselector);
        let anysystem = alloptionsselected(systemselector);
        if (tsval != "" && tsval !== undefined && ssval != "" && ssval !== undefined) {
            if (anytask && anysystem) {
                fdesc.text(`Search for any kind of resource, ignoring system compatibility.`);
            } else if (anytask) {
                fdesc.text(`Search for any kind of resource compatible with ${ssval.toString().replace(/,/g, " or ")}.`);
            } else if (anysystem) {
                fdesc.text(`Search for ${tsval.toString().replace(/,/g, " or ")}-related resources, ignoring system compatibility.`);
            } else {
                fdesc.text(`Search for ${tsval.toString().replace(/,/g, " or ")}-related resources that are compatible with ${ssval.toString().replace(/,/g, " or ")}.`);
            }
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
        let selector = $(e.target);
        let catname = String(selector.val()).valueOf();
        let multicat = getselectedoptions(selector).length > 1;
        if (catname !== undefined && catname != "" && !multicat) {
            icon.attr("src", `/static/img/uc/${catname}.webp`);
            icon.removeClass("novalue");
        } else {
            icon.attr("src", "/static/img/uc/category.webp");
            if (multicat) {
                icon.removeClass("novalue");
            } else {
                icon.addClass("novalue");
            }
        }
    }
    function updfosicon(e) {
        let icon = $("img#OSicon");
        let selector = $(e.target);
        let osname = String(selector.val()).valueOf();
        let multios = getselectedoptions(selector).length > 1;
        if (osname !== undefined && osname != "" && !multios) {
            icon.attr("src", `/static/img/os/${osname}.webp`);
            icon.removeClass("novalue");
        } else {
            icon.attr("src", "/static/img/os/System.webp");
            if (multios) {
                icon.removeClass("novalue");
            } else {
                icon.addClass("novalue");
            }
        }
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
    window.setTimeout(updfdesc, 3e3);
});