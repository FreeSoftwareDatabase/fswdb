/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

var Queues;

(function(Queues) {
    let Irregular;
    (function(Irregular) {
        function preparesugform(e) {
            let litembtn = $(e.relatedTarget);
            let litem = litembtn.parents("[data-eid]");
            let tresid = litem.data("eid");
            let tresname = litem.find(".rname").text().trim();
            let tresohp = litem.find(".nloc").text().trim();
            console.log(e);
            $("form #rid").val(tresid);
            $("form #rname").val(tresname);
            $("form #oraddr").val(tresohp);
        }
        Irregular.preparesugform = preparesugform;
        function browsereshomepage(e) {
            let eid = $(e.target).parents("[data-eid]").data("eid");
            let hpspan = $(`[data-eid=${eid}] .nloc`);
            let hpurl = hpspan.text();
            window.open(hpurl, "_blank", "noopener,noreferrer");
        }
        function prepare() {
            let btn = $(".openhpbtn");
            btn.on("dblclick", browsereshomepage);
            turnstile.ready(function() {
                turnstile.render("#cft", {
                    sitekey: "0x4AAAAAAAB8ni7E5tNewb__",
                    callback: Turnstile.rendered,
                    "expired-callback": Turnstile.expired,
                    "timeout-callback": Turnstile.timeout,
                    "error-callback": Turnstile.error,
                    action: "hpsug"
                });
            });
        }
        Irregular.prepare = prepare;
        let Turnstile;
        (function(Turnstile) {
            function error() {
                $("#hpsugsbtn").attr("disabled", "disabled");
                $("#hpsugsbtn").addClass("btn-danger");
            }
            Turnstile.error = error;
            function timeout() {
                $("#hpsugsbtn").attr("disabled", "disabled");
            }
            Turnstile.timeout = timeout;
            function expired() {
                $("#hpsugsbtn").attr("disabled", "disabled");
            }
            Turnstile.expired = expired;
            function rendered(token) {
                $("#hpsugsbtn").removeAttr("disabled");
                $("#hpsugsbtn").removeClass("btn-danger");
            }
            Turnstile.rendered = rendered;
        })(Turnstile = Irregular.Turnstile || (Irregular.Turnstile = {}));
    })(Irregular = Queues.Irregular || (Queues.Irregular = {}));
})(Queues || (Queues = {}));

$(function() {
    let hpSugModal = $("#suggestURLModal");
    hpSugModal.on("show.bs.modal", Queues.Irregular.preparesugform);
    Queues.Irregular.prepare();
});