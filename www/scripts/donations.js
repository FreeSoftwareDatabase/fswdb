/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

var Donations;

(function(Donations) {
    function parsexml(data) {
        let doc = $(data);
        return {
            address: {
                type: doc.find("address").attr("type"),
                id: doc.find("id").text()
            },
            qrcode: doc.find("qr svg")[0]
        };
    }
    function getxmlfor(currency, onsuccess) {
        return jQuery.get(`/donation/address/${currency}`, onsuccess, "xml");
    }
    function deactivatenavlinks() {
        $("#donations .nav-link").removeClass("active");
    }
    function preparepage(e) {
        let dbtn = $(this);
        let currency = dbtn.data("cryptocurrency");
        let cexplanation = $("#cryptoexplanation");
        let dexplanation = $("#donorboxexplanation");
        function setels(data) {
            let donationtarget = parsexml(data);
            if (donationtarget.address.type !== undefined) $(e.data.addresstype).text(donationtarget.address.type);
            $(e.data.addr).text(donationtarget.address.id);
            $(e.data.qr).html(donationtarget.qrcode).attr("title", donationtarget.address.id);
        }
        getxmlfor(currency, setels).then(function() {
            deactivatenavlinks();
            dbtn.find(".nav-link").addClass("active");
            cexplanation.removeClass("visually-hidden");
            dexplanation.addClass("visually-hidden");
        });
    }
    Donations.preparepage = preparepage;
    function preparedonorbox(e) {
        let dbtn = $(this);
        let cexplanation = $("#cryptoexplanation");
        let dexplanation = $("#donorboxexplanation");
        let campaign = $(this).data("donorboxcampaign");
        let qr = $(this).data("donorboxqr");
        $(e.data.addr).html($(`<a href="${campaign}" class="btn btn-primary ms-5">Paypal donation page</a>`)[0]);
        $(e.data.qr).html($(`<img src="${qr}" class="m-4" title="${campaign}" draggable="false">`)[0]);
        deactivatenavlinks();
        cexplanation.addClass("visually-hidden");
        dexplanation.removeClass("visually-hidden");
        dbtn.find(".nav-link").addClass("active");
    }
    Donations.preparedonorbox = preparedonorbox;
})(Donations || (Donations = {}));

$(function() {
    let dbtns = $("#donations .nav-item[data-cryptocurrency]");
    let dboxbtn = $("#donations .nav-item[data-donorboxcampaign]");
    let atype = $("#donations #atype");
    let addr = $("#donations #address");
    let qr = $("#donations #qr");
    dbtns.on("click keypress", {
        addresstype: atype,
        addr,
        qr
    }, Donations.preparepage);
    dboxbtn.on("click keypress", {
        addr,
        qr
    }, Donations.preparedonorbox);
});