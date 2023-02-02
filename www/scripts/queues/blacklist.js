/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

var Blacklist;

(function(Blacklist) {
    let filtert = null;
    function filter(e) {
        let page = $("body");
        let searchText = String(e.data.sbox.val()).toUpperCase().valueOf();
        let matchingListElements;
        page.css("cursor", "wait");
        e.data.items.each(function(index, element) {
            let listItem = $(this);
            let itemText = listItem.text().replace(/⋅/g, ".").toUpperCase();
            if (itemText.includes(searchText)) {
                listItem.removeAttr("hidden");
            } else {
                listItem.attr("hidden", "hidden");
            }
        });
        page.css("cursor", "default");
    }
    function mgrblfiltering(e) {
        if (filtert != null) window.clearTimeout(filtert);
        if (e.data.sbox.val().length > 0) {
            filtert = window.setTimeout(filter, 250, e);
        } else e.data.items.removeAttr("hidden");
    }
    Blacklist.mgrblfiltering = mgrblfiltering;
})(Blacklist || (Blacklist = {}));

$(function() {
    let filterinput = $("#blfilter");
    let searchableItems = $("#bl li");
    filterinput.on("keydown", {
        items: searchableItems,
        sbox: filterinput
    }, Blacklist.mgrblfiltering);
    filterinput.on("change", {
        items: searchableItems,
        sbox: filterinput
    }, Blacklist.mgrblfiltering);
    filterinput.removeAttr("disabled").removeClass("disabled");
});