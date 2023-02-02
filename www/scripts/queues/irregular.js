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
        function cleansugform(e) {}
        Irregular.cleansugform = cleansugform;
        function browsereshomepage(e) {
            let eid = $(e.target).parents("[data-eid]").data("eid");
            let hpspan = $(`[data-eid=${eid}] .nloc`);
            let hpurl = hpspan.text();
            window.open(hpurl, "_blank", "noopener,noreferrer");
        }
        function prepare() {
            let btn = $(".openhpbtn");
            btn.on("dblclick", browsereshomepage);
        }
        Irregular.prepare = prepare;
    })(Irregular = Queues.Irregular || (Queues.Irregular = {}));
})(Queues || (Queues = {}));

function turnstileerror() {
    $("#hpsugsbtn").attr("disabled", "disabled");
    $("#hpsugsbtn").addClass("btn-danger");
}

function turnstiletimeout() {
    $("#hpsugsbtn").attr("disabled", "disabled");
}

function turnstileexpired() {
    $("#hpsugsbtn").attr("disabled", "disabled");
}

function turnstilerendered(token) {
    $("#hpsugsbtn").removeAttr("disabled");
    $("#hpsugsbtn").removeClass("btn-danger");
}

$(function() {
    let hpSugModal = $("#suggestURLModal");
    hpSugModal.on("show.bs.modal", Queues.Irregular.preparesugform);
    hpSugModal.on("hide.bs.modal", Queues.Irregular.cleansugform);
    Queues.Irregular.prepare();
});