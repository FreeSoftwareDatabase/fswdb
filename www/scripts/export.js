/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

function turnstileerror() {
    $("#rexpbtn").attr("disabled", "disabled");
    $("#rexpbtn").addClass("btn-danger");
}

function turnstiletimeout() {
    $("#rexpbtn").attr("disabled", "disabled");
}

function turnstileexpired() {
    $("#rexpbtn").attr("disabled", "disabled");
}

function turnstilerendered(token) {
    $("#rexpbtn").removeAttr("disabled");
    $("#rexpbtn").removeClass("btn-danger");
}