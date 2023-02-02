/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

function resetchk() {
    $(".unselect input[type=checkbox]").prop("checked", false);
}

$(function() {
    $(".resetchk").on("click", resetchk);
});