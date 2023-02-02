/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

var NavigationBar;

(function(NavigationBar) {
    function showbackdrop(e) {
        $("nav-backdrop").removeAttr("hidden");
    }
    NavigationBar.showbackdrop = showbackdrop;
    function hidebackdrop(e) {
        $("nav-backdrop").prop("hidden", true);
    }
    NavigationBar.hidebackdrop = hidebackdrop;
    function fastbrowse(e) {
        const dest = this.href;
        const target = this.target;
        if (dest !== undefined && e.button == 0 && target != "_blank") {
            document.location.assign(dest);
        }
    }
    NavigationBar.fastbrowse = fastbrowse;
    function mgrccpay(e) {
        $("#ccpay").prop("hidden", HypertextTransfer.istorified());
    }
    NavigationBar.mgrccpay = mgrccpay;
    function linkoc(e) {
        let t = e.relatedTarget;
        if (t !== undefined && t !== null) {
            let ifsrc = $(t).attr("data-fswdb-href");
            if (ifsrc !== undefined) {
                $("#dif").attr("src", ifsrc);
                $("#difs").attr("href", ifsrc);
            }
        }
    }
    NavigationBar.linkoc = linkoc;
    function mgriframe(e) {
        let offcanvas = $(e.target);
        let iframe = offcanvas.find("iframe");
        let iframespinner = $("#lif");
        if (e.data.hide === true) {
            iframe.attr("hidden", "hidden");
            iframespinner.removeAttr("hidden");
        } else {
            iframe.removeAttr("hidden");
            iframe.on("load", function() {
                iframespinner.attr("hidden", "hidden");
            });
        }
    }
    NavigationBar.mgriframe = mgriframe;
})(NavigationBar || (NavigationBar = {}));

$(document).on("show.bs.collapse", "#navbarCollapse", NavigationBar.showbackdrop);

$(document).on("hide.bs.collapse", "#navbarCollapse", NavigationBar.hidebackdrop);

$(document).on("show.bs.dropdown", "#navbarDropdown", NavigationBar.mgrccpay);

$(document).on("show.bs.offcanvas", "#donationsoc", NavigationBar.linkoc);

$(document).on("show.bs.offcanvas", "#donationsoc", {
    hide: true
}, NavigationBar.mgriframe);

$(document).on("shown.bs.offcanvas", "#donationsoc", {
    hide: false
}, NavigationBar.mgriframe);

$(document).on("mousedown", "nav.navbar a", NavigationBar.fastbrowse);