/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

$(function() {
    let price = $("#duration");
    let output = $("output#duration");
    function updprogress() {
        let pval = Number(price.val());
        let pvalmin = Number(price.attr("min"));
        let pvalmax = Number(price.attr("max"));
        if (pval == pvalmin) {
            output.val("CLEAR");
        } else if (pval == pvalmax) {
            output.val("FOREVER");
        } else {
            if (pval != NaN) output.val(pval + " days");
        }
    }
    $("#duration").on("input", updprogress);
    price.val(7);
    updprogress();
});