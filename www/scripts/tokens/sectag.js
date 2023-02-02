/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

var Security;

(function(Security) {
    function cleartag(e) {
        let stag = e.data["secTagInput"];
        if (window.crypto.getRandomValues !== undefined) {
            stag.val(String(window.crypto.getRandomValues(new Uint8Array(6))));
        } else if (Math.random !== undefined) {
            stag.val(String(Math.random()).repeat(3));
        }
        stag.val("");
    }
    Security.cleartag = cleartag;
    function triminputs(e) {
        let input = $(e.currentTarget);
        input.val(String(input.val()).trim());
    }
    Security.triminputs = triminputs;
    function forgetall(e) {
        if (window.localStorage.length > 0) {
            window.localStorage.clear();
        }
        let forgetAllModal = document.getElementById("forgetModal");
        if (forgetAllModal !== null) {
            let modal = bootstrap.Modal.getInstance(forgetAllModal);
            if (modal !== null) modal.hide();
        }
        window.setTimeout(function() {
            window.location.reload();
        }, 500);
    }
    Security.forgetall = forgetall;
    function mgrwipebutton(e) {
        let btn = $("#wipeall");
        function ew() {
            btn.attr("aria-disabled", "false");
            btn.removeAttr("disabled");
        }
        function dw() {
            btn.attr("aria-disabled", "true");
            btn.attr("disabled", "true");
        }
        if (e.type == "shown") window.setTimeout(ew, 2e3); else if (e.type == "hide") dw();
    }
    Security.mgrwipebutton = mgrwipebutton;
})(Security || (Security = {}));

$(function() {
    $("#addTokenModal").on("hidden.bs.modal", {
        secTagInput: $("#sectag")
    }, Security.cleartag);
    $("#addTokenModal input").on("change", Security.triminputs);
});