/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

var EntryDetails;

(function(EntryDetails) {
    let fulldetailsXHR = null;
    function hide(e) {
        Form.modal.find("#entryDetailsBody").fadeOut("fast");
    }
    EntryDetails.hide = hide;
    function show(e) {
        Form.modal.find("#entryDetailsBody").fadeIn("slow");
    }
    EntryDetails.show = show;
    function copydetails(e) {
        let eventSource = $(e.relatedTarget);
        let entryID = parseInt(eventSource.data("entry-id"));
        let entryKind = eventSource.children(".eKind").data("kind");
        let entryHostIcon = eventSource.children(".eHost").data("icon");
        let entryName = eventSource.children(".eName").text();
        let entryTeaser = eventSource.children(".eTeaser").text();
        let entryDate = new Date(eventSource.data("entry-date"));
        let entryObsolete = eventSource.data("entry-obsolete") !== undefined;
        Form.modal.find("#entryDetailsLabelType").html(entryKind);
        Form.modal.find("#entryDetailsBody #wwwIcon").attr("src", `/static/img/hp/${entryHostIcon}.webp`);
        Form.modal.find("#entryDetailsLabelTitle").html(entryName);
        Form.modal.find("#entryDetailsTeaser").html(entryTeaser);
        Form.modal.find("#entryDetailsUpdateTimestamp").html(entryDate.toLocaleDateString());
        if (entryObsolete == true) {
            Form.modal.find("#entryDetailsLabelObsoleteBadge").removeAttr("hidden");
        } else {
            Form.modal.find("#entryDetailsLabelObsoleteBadge").prop("hidden", true);
        }
        Form.Share.SearchLink.set(document.location.href, entryID);
        Form.modal.find("#ochfootercollapse").data("chat-id", `${entryID.toString()}`);
    }
    EntryDetails.copydetails = copydetails;
    function abortloadfulldetailsloading() {
        try {
            if (fulldetailsXHR !== null) {
                fulldetailsXHR.abort();
                fulldetailsXHR = null;
            }
        } catch {}
    }
    EntryDetails.abortloadfulldetailsloading = abortloadfulldetailsloading;
    function loadfulldetails(e) {
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
            abortloadfulldetailsloading();
            fulldetailsXHR = $.ajax({
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
                success: processXMLentrydetails,
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
    EntryDetails.loadfulldetails = loadfulldetails;
    async function processXMLentrydetails(xmldata) {
        let sdWWWIcon = $("#wwwIcon");
        let sdUsecases = $("#sdUses");
        let sdPlatforms = $("#sdPlatforms");
        let sdLicenses = $("#sdLicenses");
        let sdSPDXswitch = $("#spdxswitch");
        Form.HTML.cleanall([ sdUsecases, sdPlatforms, sdLicenses ]);
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
        Form.Description.set(softwareDetails.description.text());
        Form.HomePage.set(softwareDetails.homepage.text());
        {
            let ucTmpl = $("template#usesTmpl").first();
            let plTmpl = $("template#platformsTmpl").first();
            let liTmpl = $("template#licensesTmpl").first();
            Form.UseCases.enlist(softwareDetails.usages, sdUsecases, ucTmpl);
            Form.Platforms.enlist(softwareDetails.platforms, softwareDetails.description.text(), sdPlatforms, plTmpl);
            Form.Licenses.enlist(softwareDetails.licenses, sdLicenses, liTmpl, sdSPDXswitch);
        }
        Form.Statistics.update(Number.parseInt(softwareDetails.views.text()), Number.parseInt(softwareDetails.likes.text()));
        $("#entryDetailsLoading").hide();
        $("#edfccontroller").prop("disabled", false);
    }
    let Form;
    (function(Form) {
        let HTML;
        (function(HTML) {
            function clean(el) {
                el.empty();
            }
            HTML.clean = clean;
            function cleanall(els) {
                for (const el of els) clean(el);
            }
            HTML.cleanall = cleanall;
        })(HTML = Form.HTML || (Form.HTML = {}));
        let Description;
        (function(Description) {
            async function set(description) {
                let sdDescription = $("#sdDescription");
                Form.HTML.clean(sdDescription);
                sdDescription.html(description);
            }
            Description.set = set;
        })(Description = Form.Description || (Form.Description = {}));
        let HomePage;
        (function(HomePage) {
            async function set(url) {
                let sdHomepage = $("#sdHomepage");
                sdHomepage.attr("href", url);
            }
            HomePage.set = set;
        })(HomePage = Form.HomePage || (Form.HomePage = {}));
        let UseCases;
        (function(UseCases) {
            async function enlist(usecases, uclistEl, tmplEl) {
                if (usecases.length <= 0) usecases = $("<usage>general-purpose</usage>");
                usecases.each(function(index, element) {
                    let usecase = $(element).text().replace("-", " ");
                    let tmpl = $(tmplEl.clone().prop("content"));
                    tmpl.find(".sdDetailsIcon").attr("src", `/static/img/uc/${$(element).text()}.webp`);
                    tmpl.find(".uc").html(usecase);
                    tmpl.appendTo(uclistEl);
                });
            }
            UseCases.enlist = enlist;
        })(UseCases = Form.UseCases || (Form.UseCases = {}));
        let Platforms;
        (function(Platforms) {
            async function enlist(platforms, sdesc, pllistEl, tmplEl) {
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
            Platforms.enlist = enlist;
        })(Platforms = Form.Platforms || (Form.Platforms = {}));
        let Licenses;
        (function(Licenses) {
            async function enlist(licenses, liclist, tmplel, spdxswitch) {
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
                    } else if (license.indexOf("ISC") > -1 || license.indexOf("MIT") > -1 || license.indexOf("Expat") > -1 || license.indexOf("BSD") > -1 || license.indexOf("Apache") > -1 || license.indexOf("Academic Free") > -1 || license.indexOf("Python") > -1 || license.indexOf("Zlib") > -1 || license.indexOf("Permissive") > -1) {
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
            Licenses.enlist = enlist;
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
        })(Licenses = Form.Licenses || (Form.Licenses = {}));
        let Share;
        (function(Share) {
            let SearchLink;
            (function(SearchLink) {
                function set(url, entry_identifier) {
                    let parsedURL = new URL(url);
                    parsedURL.searchParams.delete("quick");
                    Form.modal.find("#shlink").val(`${parsedURL.toString()}&quick=${entry_identifier.toString()}`);
                }
                SearchLink.set = set;
                function copyintoclipboard() {
                    let sharebox = Form.modal.find("#shlink");
                    let link = String(sharebox.val()).valueOf();
                    const sLink = {
                        title: document.title,
                        url: link
                    };
                    try {
                        navigator.clipboard.writeText(link).then(() => {
                            console.log(`Text "${link}" copied to clipboard.`);
                            let toastbody = $("#serpt .toast-body");
                            toastbody.html("Link copied to clipboard.");
                            let toast = $("#serpt").get(0);
                            if (toast !== undefined) {
                                let t = bootstrap.Toast.getOrCreateInstance(toast);
                                t.show();
                            }
                        }).catch(err => {
                            console.error(`Failed to copy "${link}" to clipboard: `, err);
                        });
                        if (navigator.canShare(sLink)) navigator.share(sLink);
                    } catch {}
                    sharebox.first().trigger("focus");
                    {
                        let el = sharebox.get(0);
                        if (el !== undefined) el.setSelectionRange(0, link.length, "forward");
                    }
                }
                SearchLink.copyintoclipboard = copyintoclipboard;
            })(SearchLink = Share.SearchLink || (Share.SearchLink = {}));
        })(Share = Form.Share || (Form.Share = {}));
        let Statistics;
        (function(Statistics) {
            function update(views, likes) {
                let sdViews = $("#sdViews");
                let sdLikes = $("#sdLikes");
                let percLikes = (likes + 5) / 10 * 100;
                Form.HTML.cleanall([ sdViews, sdLikes ]);
                sdViews.html(views.toString());
                sdLikes.html(`${percLikes.toString()}%`);
            }
            Statistics.update = update;
        })(Statistics = Form.Statistics || (Form.Statistics = {}));
    })(Form = EntryDetails.Form || (EntryDetails.Form = {}));
})(EntryDetails || (EntryDetails = {}));

var QuickSearch;

(function(QuickSearch) {
    function mgr() {
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
    QuickSearch.mgr = mgr;
})(QuickSearch || (QuickSearch = {}));

$(function() {
    EntryDetails.Form.modal = $(".modal#entryDetails");
    let chatbox = EntryDetails.Form.modal.find("#ochfootercollapse");
    EntryDetails.Form.modal.on("show.bs.modal", EntryDetails.loadfulldetails).on("show.bs.modal", EntryDetails.copydetails);
    EntryDetails.Form.modal.on("show.bs.modal", EntryDetails.hide);
    EntryDetails.Form.modal.on("shown.bs.modal", EntryDetails.show);
    EntryDetails.Form.modal.on("hide.bs.modal", EntryDetails.abortloadfulldetailsloading);
    let noresultsc = $("#emptyResultSetCaption");
    if (noresultsc.length > 0) {
        noresultsc.on("click", function() {
            $("#navsearch").trigger("focus");
        });
    } else QuickSearch.mgr();
    EntryDetails.Form.modal.find("#cplink").on("click", EntryDetails.Form.Share.SearchLink.copyintoclipboard);
});