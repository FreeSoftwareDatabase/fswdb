/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

var Page;

(function(Page) {
    function prepare() {
        $(document).on("click", "#shelp", Search.focus);
        $(document).on("click", "#excludeNothing, #onlySoftware, #onlyHardware, #onlyAssets", Dropdown.limitSearch);
        $(document).on("show.bs.dropdown", "#limitDropDown", Dropdown.remSearchLimit);
        {
            const allHTML = document.querySelector("html");
            const dropdownObserver = new MutationObserver(Dropdown.remSearchLimitOnMutation);
            const observerOptions = {
                childList: true,
                attributes: false,
                subtree: false
            };
            if (allHTML !== null) dropdownObserver.observe(allHTML, observerOptions);
        }
        $(document).on("submit", "form#sForm", Search.clean);
        Dropdown.ready();
        $(function() {
            if (Automation.autofocus == true) {
                window.setTimeout(function() {
                    $("#s").first().trigger("focus", {
                        preventScroll: false
                    });
                }, 300);
            }
        });
    }
    Page.prepare = prepare;
})(Page || (Page = {}));

var Search;

(function(Search) {
    let spinnerTimer = 0;
    let sformcallback;
    let extratimeout = 0;
    function focus(e) {
        $("#s").trigger("focus");
    }
    Search.focus = focus;
    function clean(e) {
        let limitf = $("input#ek");
        let ival = limitf.val();
        if (ival !== undefined) {
            limitf.prop("disabled", ival.toString().length <= 0);
        }
    }
    Search.clean = clean;
    function insert(data, textStatus, jqXHR) {
        try {
            window.clearTimeout(spinnerTimer);
        } catch (error) {}
        $(function() {
            $("#mainsearchform").html(data);
            if (sformcallback !== null) sformcallback(); else console.error("LCB ERROR");
        });
    }
    function showspinner() {
        try {
            $("#sfspinner").removeClass("visually-hidden");
        } catch (error) {}
    }
    function sformloaderror(xhr, status, error, c) {
        console.error(error);
        if (status == "timeout") {
            $("#sfspinner").removeClass("visually-hidden");
            extratimeout += 250;
            window.setTimeout(function() {
                load(c);
            }, 500 + extratimeout / 2);
        } else if (status != "abort") {
            window.setTimeout(function() {
                document.location.reload();
            }, 700);
        }
    }
    function load(c) {
        spinnerTimer = window.setTimeout(showspinner, 400);
        sformcallback = c;
        $.ajax({
            url: "/sform",
            timeout: 5e3 + extratimeout,
            success: insert,
            error: function(xhr, status, error) {
                sformloaderror(xhr, status, error, c);
            },
            dataType: "html"
        });
    }
    Search.load = load;
})(Search || (Search = {}));

var Dropdown;

(function(Dropdown) {
    function ready() {
        let limitDropDown = $("#limitDropDown");
        let sbtn = $("#sbtn");
        sbtn.removeClass("rounded-end");
        limitDropDown.removeAttr("hidden");
    }
    Dropdown.ready = ready;
    function limitSearch(e) {
        let anyLimit = $("a[data-limit]");
        let newlimit = $(this).data("limit");
        let limitDropDown = $("#limitDropDown");
        let limitf = $("input#ek");
        switch (newlimit) {
          case "s":
          case "h":
          case "a":
            limitf.val(newlimit);
            if (limitDropDown.length >= 0) {
                limitDropDown.addClass("active text-info");
                ready();
            }
            break;

          default:
            limitf.val("");
            if (limitDropDown.length >= 0) {
                limitDropDown.removeClass("active text-info");
                ready();
            }
        }
        anyLimit.removeClass("active");
        $(this).addClass("active");
    }
    Dropdown.limitSearch = limitSearch;
    function remSearchLimit(e = undefined) {
        let limit = $("input#ek").val();
        let anyLimit = $("a[data-limit]");
        let activeLimit = $('a[data-limit="' + limit + '"]');
        anyLimit.removeClass("active");
        activeLimit.addClass("active");
        activeLimit.trigger("click");
    }
    Dropdown.remSearchLimit = remSearchLimit;
    function remSearchLimitOnMutation(m) {
        remSearchLimit();
    }
    Dropdown.remSearchLimitOnMutation = remSearchLimitOnMutation;
})(Dropdown || (Dropdown = {}));

Search.load(Page.prepare);