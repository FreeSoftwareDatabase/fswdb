/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

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
    $("a.torlink").on("click", Tor.copylink);
});