/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

$(function() {
    let detailsXHR = null;
    function cleanHTML(els) {
        for (const el of els) el.empty();
    }
    async function sethomepageicon(url, iconEl) {
        let icon = "world";
        if (url.indexOf("github") > -1) icon = "github"; else if (url.indexOf("gitlab") > -1) icon = "gitlab"; else if (url.indexOf("bitbucket") > -1) icon = "bitbucket"; else if (url.indexOf("mozilla.org") > -1) icon = "mozilla"; else if (url.indexOf("addons.google.com") > -1) icon = "chrome"; else if (url.indexOf("google.com") > -1) icon = "google"; else if (url.indexOf("wikipedia") > -1 || url.indexOf("mediawiki") > -1 || url.indexOf("wiki.") > -1 || url.indexOf("/wiki/") > -1) icon = "wiki"; else if (url.indexOf("open") > -1 && url.indexOf("source") > -1 || url.indexOf("sourceforge") > -1) icon = "open-source"; else if (url.indexOf("git.") > -1 || url.indexOf("vcs") > -1 || url.indexOf("trunk/") > -1) icon = "git";
        iconEl.attr("src", `/static/img/hp/${icon}.webp`);
    }
    async function enlistusecases(usecases, uclistEl, tmplEl) {
        if (usecases.length <= 0) usecases = $("<usage>general-purpose</usage>");
        usecases.each(function(index, element) {
            let usecase = $(element).text().replace("-", " ");
            let tmpl = $(tmplEl.clone().prop("content"));
            tmpl.find(".sdDetailsIcon").attr("src", `/static/img/uc/${$(element).text()}.webp`);
            tmpl.find(".uc").html(usecase);
            tmpl.appendTo(uclistEl);
        });
    }
    async function enlistplatforms(platforms, sdesc, pllistEl, tmplEl) {
        if (platforms.length <= 0) platforms = $("<os>Subsystem</os>");
        platforms.each(function(index, element) {
            let platform = $(element).text();
            let tmpl = $(tmplEl.clone().prop("content"));
            tmpl.find(".sdDetailsIcon").attr("src", `/static/img/os/${platform}.webp`);
            if (platform.startsWith("Linux") && (sdesc.indexOf("GNU") > -1 || sdesc.indexOf("gnu") > -1)) platform = "GNU/" + platform;
            tmpl.find(".pl").html(platform);
            tmpl.appendTo(pllistEl);
        });
    }
    function togglespdx(e) {
        let sw = $(e.target);
        let lst = e.data.list;
        let items = lst.find(".li");
        let switched = $(e.target).hasClass("active");
        sw.addClass("disabled");
        items.each(function(index, element) {
            let el = $(element);
            let spdxlic = el.data("spdx");
            let mogrlic = el.data("mogr");
            if (spdxlic !== undefined && mogrlic !== undefined) {
                let icon = el.siblings(".sdDetailsIcon").first();
                let tooltip = bootstrap.Tooltip.getInstance(icon[0]);
                icon.fadeTo("fast", 0).promise().then(function() {
                    if (spdxlic == null || mogrlic == null) return;
                    if (switched) {
                        icon[0].orig = icon.clone(true, true);
                        el.text(spdxlic);
                        el.addClass("small font-monospace user-select-all");
                        icon.attr("src", "/static/img/li/spdx_logo.webp");
                        icon.attr("title", "Standard SPDX license.");
                        {
                            let t = bootstrap.Tooltip.getInstance(icon[0]);
                            if (t !== null) t.disable();
                        }
                    } else {
                        el.text(mogrlic);
                        el.removeClass("small font-monospace user-select-all");
                        if (icon[0].orig !== undefined) {
                            let originalsrc = icon[0].orig.attr("src");
                            let originaltitle = icon[0].orig.attr("title");
                            if (originalsrc !== undefined && originaltitle !== undefined) {
                                icon.attr("src", originalsrc);
                                icon.attr("title", originaltitle);
                                {
                                    let t = bootstrap.Tooltip.getInstance(icon[0]);
                                    if (t !== null) t.enable();
                                }
                            }
                            delete icon[0].orig;
                        }
                    }
                    icon.fadeTo("fast", 1);
                });
            }
        });
        window.setTimeout(function() {
            sw.removeClass("disabled");
        }, 340);
    }
    async function enlistlicenses(licenses, liclist, tmplel, spdxswitch) {
        let isspdx = false;
        if (licenses.length <= 0) licenses = $("<license>Unclear</license>");
        licenses.each(function(index, element) {
            let license = $(element).text();
            let hlicense;
            let liclogo = "license";
            let lictype = "";
            let tmpl = $(tmplel.clone().prop("content"));
            let tmplitem = tmpl.find(".li");
            if (license.indexOf("Public") > -1 && license.indexOf("Domain") > -1 || license.indexOf("Unlicense") > -1) {
                liclogo = "copyright-off";
                lictype = "Public Domain: the author does not enforce the copyright.";
            } else if (license.indexOf("Creative") > -1 && license.indexOf("Commons") > -1) {
                if (license.indexOf("Zero") < 0) {
                    liclogo = "creative-commons";
                    lictype = "CC: license generated via Creative Commons.";
                } else {
                    liclogo = "creative-commons-zero";
                    lictype = "0 Copyright: copyright is explicitly waived out.";
                }
            } else if (license.indexOf("GPL") > -1 || license.indexOf("MPL") > -1) {
                liclogo = "copyleft";
                lictype = "Copyleft: freedom to use, modify and redistribute under certain conditions.";
            } else if (license.indexOf("ISC") > -1 || license.indexOf("MIT") > -1 || license.indexOf("Expat") > -1 || license.indexOf("BSD") > -1 || license.indexOf("Apache") > -1 || license.indexOf("Academic Free") > -1 || license.indexOf("Python") > -1 || license.indexOf("Zlib") > -1) {
                liclogo = "copyleft-off";
                lictype = "Non-copyleft/Permissive: total freedom to use, modify and redistribute.";
            } else if (license == "Unclear" || license == "Other") {
                liclogo = "unclear";
                lictype = "Custom or uncommon license.";
            }
            {
                let i;
                let t;
                i = tmpl.find(".sdDetailsIcon");
                i.attr("src", `/static/img/li/${liclogo}.webp`);
                i.attr("title", lictype);
                t = new bootstrap.Tooltip(i[0]);
                $("#entryDetails").on("hidden.bs.modal", function() {
                    try {
                        t.hide();
                        t.dispose();
                    } catch {}
                });
            }
            if (license.indexOf("-") > -1) {
                hlicense = license.replace("-or-later", "+");
                hlicense = hlicense.replace("-only", "");
                hlicense = hlicense.replace(/-/g, " ");
                tmplitem.data("mogr", hlicense);
                tmplitem.data("spdx", license);
                isspdx = true;
            } else hlicense = license;
            tmplitem.html(hlicense);
            tmpl.appendTo(liclist);
        });
        spdxswitch.off("click", togglespdx);
        spdxswitch.on("click", {
            list: liclist
        }, togglespdx);
        if (isspdx) spdxswitch.removeAttr("hidden"); else spdxswitch.attr("hidden", "hidden");
    }
    async function processXMLEntryDetails(xmldata) {
        let sdDescription = $("#sdDescription");
        let sdHomepage = $("#sdHomepage");
        let sdWWWIcon = $("#wwwIcon");
        let sdUsecases = $("#sdUses");
        let sdPlatforms = $("#sdPlatforms");
        let sdLicenses = $("#sdLicenses");
        let sdSPDXswitch = $("#spdxswitch");
        let sdViews = $("#sdViews");
        let sdLikes = $("#sdLikes");
        cleanHTML([ sdDescription, sdUsecases, sdPlatforms, sdLicenses, sdViews, sdLikes ]);
        sdSPDXswitch.removeClass("active");
        const softwareDetails = {
            description: $("description", xmldata),
            homepage: $("homepage", xmldata),
            usages: $("usage", xmldata),
            platforms: $("os", xmldata),
            licenses: $("license", xmldata),
            views: $("views", xmldata),
            likes: $("likes", xmldata)
        };
        Object.freeze(softwareDetails);
        sdDescription.html(softwareDetails.description.text());
        sdHomepage.attr("href", softwareDetails.homepage.text());
        {
            let ucTmpl = $("template#usesTmpl").first();
            let plTmpl = $("template#platformsTmpl").first();
            let liTmpl = $("template#licensesTmpl").first();
            enlistusecases(softwareDetails.usages, sdUsecases, ucTmpl);
            enlistplatforms(softwareDetails.platforms, softwareDetails.description.text(), sdPlatforms, plTmpl);
            enlistlicenses(softwareDetails.licenses, sdLicenses, liTmpl, sdSPDXswitch);
            sethomepageicon(softwareDetails.homepage.text(), sdWWWIcon);
        }
        sdViews.html(softwareDetails.views.text());
        let rawLikes = Number(softwareDetails.likes.text()).valueOf();
        let percLikes = (rawLikes + 5) / 10 * 100;
        sdLikes.html(`${percLikes.toString()}%`);
        $("#entryDetailsLoading").hide();
        $("#edfccontroller").prop("disabled", false);
    }
    function loadEntryDetails(e) {
        let eventSource = $(e.relatedTarget);
        let entryID = parseInt(eventSource.data("entry-id"));
        let entryKind = eventSource.children(".eKind").data("kind");
        let entryName = eventSource.children(".eName").text();
        let entryTeaser = eventSource.children(".eTeaser").text();
        let entryDate = new Date(eventSource.data("entry-date"));
        let entryObsolete = eventSource.data("entry-obsolete") !== undefined;
        $(".modal#entryDetails #entryDetailsLabelType").html(entryKind);
        $(".modal#entryDetails #entryDetailsLabelTitle").html(entryName);
        $(".modal#entryDetails #entryDetailsTeaser").html(entryTeaser);
        $(".modal#entryDetails #entryDetailsUpdateTimestamp").html(entryDate.toLocaleDateString());
        if (entryObsolete == true) {
            $(".modal#entryDetails #entryDetailsLabelObsoleteBadge").removeAttr("hidden");
        } else {
            $(".modal#entryDetails #entryDetailsLabelObsoleteBadge").prop("hidden", true);
        }
        let resurl = new URL(document.location.href);
        resurl.searchParams.delete("quick");
        $(".modal#entryDetails #shlink").val(`${resurl.toString()}&quick=${entryID.toString()}`);
    }
    function abortfullentrydetailsrequest() {
        try {
            if (detailsXHR !== null) {
                detailsXHR.abort();
                detailsXHR = null;
            }
        } catch {}
    }
    function loadFullEntryDetails(e) {
        let eventSource = $(e.relatedTarget);
        let entryID = parseInt(eventSource.data("entry-id"));
        let spinner = $("#entryDetailsLoading");
        let statbtn = $("#edfccontroller");
        let statfooter = $("#edfootercollapse")[0];
        spinner.removeClass("text-danger");
        statbtn.prop("disabled", true);
        if (statfooter !== null) {
            let ci = bootstrap.Collapse.getInstance(statfooter);
            if (ci !== null) ci.hide();
        }
        spinner.show();
        function reqDetails(n) {
            abortfullentrydetailsrequest();
            detailsXHR = $.ajax({
                url: "/search/details",
                type: "GET",
                accepts: {
                    "text xml": "text/xml"
                },
                timeout: 7e3,
                data: {
                    id: entryID
                },
                dataType: "xml",
                success: processXMLEntryDetails,
                error: function(jqXHR, textStatus, errorThrown) {
                    if (n > 0 && textStatus != "abort") {
                        if (n == 1) spinner.addClass("text-danger");
                        reqDetails(n - 1);
                    } else {
                        let entryDetailsModal = document.getElementById("entryDetails");
                        if (entryDetailsModal !== null) {
                            let modal = bootstrap.Modal.getInstance(entryDetailsModal);
                            if (modal !== null) modal.hide();
                        }
                    }
                }
            });
        }
        if (Automation.botUA == false) reqDetails(3); else window.setTimeout(reqDetails, Math.floor(Math.random() * (350 - 200) + 200), 1);
    }
    function mgrquicksearch() {
        let p = new URLSearchParams(document.location.search);
        let eid = p.get("quick");
        try {
            if (eid != null) {
                let idt = $(`#searchResults *[data-entry-id=${eid}]`);
                idt.trigger("click");
                idt.addClass("text-primary");
                if (history.length > 1) {
                    $("#bb").removeAttr("hidden").on("click", function() {
                        history.back();
                    });
                }
            }
        } catch {}
    }
    function cpshlink() {
        let sharebox = $(".modal#entryDetails #shlink");
        let link = String(sharebox.val());
        let curl = link.toString();
        const sLink = {
            title: document.title,
            url: curl
        };
        try {
            if (navigator.canShare(sLink)) navigator.share(sLink);
            navigator.clipboard.writeText(curl);
        } catch {}
        sharebox.first().trigger("focus");
        {
            let el = sharebox.get(0);
            if (el !== undefined) el.setSelectionRange(0, link.length, "forward");
        }
    }
    let entryDetailsModal = $(".modal#entryDetails");
    entryDetailsModal.on("show.bs.modal", loadFullEntryDetails);
    entryDetailsModal.on("show.bs.modal", loadEntryDetails);
    entryDetailsModal.on("hide.bs.modal", abortfullentrydetailsrequest);
    let noresultsc = $("#emptyResultSetCaption");
    if (noresultsc.length > 0) {
        noresultsc.on("click", function() {
            $("#navsearch").trigger("focus");
        });
    } else mgrquicksearch();
    entryDetailsModal.find("#cplink").on("click", cpshlink);
});