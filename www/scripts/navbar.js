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
})(NavigationBar || (NavigationBar = {}));

$(document).on("show.bs.collapse", "#navbarCollapse", NavigationBar.showbackdrop);

$(document).on("hide.bs.collapse", "#navbarCollapse", NavigationBar.hidebackdrop);

$(document).on("mousedown", "nav.navbar a", NavigationBar.fastbrowse);