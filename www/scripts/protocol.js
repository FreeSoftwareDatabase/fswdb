/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

var WebBrowser;

(function(WebBrowser) {
    function _localstorage_available() {
        let test = "§";
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
        return false;
    }
    WebBrowser._localstorage_available = _localstorage_available;
})(WebBrowser || (WebBrowser = {}));

var HypertextTransfer;

(function(HypertextTransfer) {
    function issecure() {
        return window.location.protocol.startsWith("https");
    }
    function istorified() {
        return window.location.hostname.endsWith(".onion") || window.location.hostname.endsWith(".onion.");
    }
    HypertextTransfer.istorified = istorified;
    function islocal() {
        return window.location.hostname.indexOf("127.0") >= 0 || window.location.hostname.indexOf("192.168") >= 0;
    }
    function autoredirect() {
        if (islocal()) return false;
        if (issecure() == false && istorified() == false) {
            window.location.protocol = "https:";
        }
        return true;
    }
    HypertextTransfer.autoredirect = autoredirect;
})(HypertextTransfer || (HypertextTransfer = {}));

var URIs;

(function(URIs) {
    function reverturlbar(e) {
        window.setTimeout(function() {
            try {
                history.pushState("", document.title, window.location.pathname + window.location.search);
            } catch (err) {}
        }, 150);
    }
    function startdefusinghashuris() {
        let t = null;
        function defusehashuris(mutationList, observer) {
            mutationList.forEach(function(record) {
                if (record.type == "childList") {
                    if (t !== null) window.clearTimeout(t);
                    t = window.setTimeout(function() {
                        let hashlinks = $("a[href^='#']");
                        hashlinks.off("click", reverturlbar);
                        hashlinks.on("click", reverturlbar);
                    }, 500);
                } else return;
            });
        }
        const observerOptions = {
            childList: true,
            attributes: false,
            characterData: false,
            subtree: true
        };
        const observer = new MutationObserver(defusehashuris);
        observer.observe(document, observerOptions);
    }
    URIs.startdefusinghashuris = startdefusinghashuris;
})(URIs || (URIs = {}));

var Automation;

(function(Automation) {
    Automation.autofocus = null;
    Automation.botUA = null;
    function updaterequisites() {
        if (Automation.autofocus === null && WebBrowser._localstorage_available() == true) {
            Automation.autofocus = window.localStorage.getItem("automation_autofocus") == "true";
        }
        if (Automation.botUA === null) {
            Automation.botUA = navigator.webdriver === true;
        }
    }
    Automation.updaterequisites = updaterequisites;
})(Automation || (Automation = {}));

var EuropeanUnion;

(function(EuropeanUnion) {
    function _init_storage() {
        if (WebBrowser._localstorage_available()) EuropeanUnion.stg = window.localStorage; else EuropeanUnion.stg = window.sessionStorage;
    }
    function acceptcookies() {
        let cdate = Date.now();
        EuropeanUnion.stg.setItem("cookiesaccepted", String(cdate));
    }
    function accepteupl() {
        let cdate = Date.now();
        EuropeanUnion.stg.setItem("euplaccepted", String(cdate));
    }
    function cookiesaccepted() {
        let d = EuropeanUnion.stg.getItem("cookiesaccepted");
        if (d !== null) {
            let adate = Number.parseInt(d);
            let cdate = Date.now();
            return cdate - adate < 15768e6;
        } else return false;
    }
    function euplaccepted() {
        let d = EuropeanUnion.stg.getItem("euplaccepted");
        return d !== null;
    }
    function deletenotice(e) {
        let notice = $(e.target);
        let noticetoast = notice.parent(".toast-container");
        noticetoast.find('[data-bs-toggle="tooltip"]').trigger("destroytooltip");
        noticetoast.remove();
    }
    function deletenode() {
        try {
            let notice = $(".gdpr.toast-container");
            notice.remove();
        } catch {}
    }
    function setslide() {
        let gdprnotice = $("#eucntcagdpr");
        let euplnotice = $("#eucntcaeupl");
        let cookiesok = cookiesaccepted();
        let euplok = euplaccepted();
        if (cookiesok == true && euplok == false) {
            gdprnotice.removeClass("active");
            euplnotice.addClass("active");
        } else if (cookiesok == false && euplok == true) {
            euplnotice.removeClass("active");
            gdprnotice.addClass("active");
        }
    }
    function shownotice(data, textStatus, jqXHR) {
        $(data).insertAfter("main");
        let cNotice = $("#eucnt");
        let cSlide = cNotice.find("#eucntca");
        let cToast = null;
        if (cNotice.length > 0 && Automation.botUA == false) {
            function shownoticeintoast() {
                let cookieNotice = cNotice.get(0);
                if (cookieNotice === undefined) return;
                cToast = new bootstrap.Toast(cookieNotice);
                cToast.show();
                cSlide.on("slide.bs.carousel", acceptcookies);
                cNotice.on("hide.bs.toast", accepteupl);
                cNotice.on("hidden.bs.toast", deletenotice);
                cNotice.on("shown.bs.toast", setslide);
                JQ.UI.mgrdraggable();
                BS.Popper.mgrtooltips();
                if (Automation.autofocus == true) {
                    try {
                        cNotice.find("button[data-bs-dismiss]").first().trigger("focus", {
                            preventScroll: true
                        });
                    } catch {}
                }
            }
            window.setTimeout(shownoticeintoast, 500);
        }
    }
    function mgrnotice() {
        _init_storage();
        let cookiesok = cookiesaccepted();
        let euplok = euplaccepted();
        if (cookiesok && euplok) deletenode(); else {
            $.get("/static/eutoast.html", shownotice, "html").fail(function() {
                if (cookiesok == false) {
                    window.alert("This website uses only technical cookies.");
                    acceptcookies();
                }
                if (euplok == false) {
                    let pr = window.confirm("All scripts served from this domain are licensed under the EUPL 1.2 (see: https://kb.fswdb.eu/licensing/eupl-12/).");
                    if (pr === true) accepteupl(); else {
                        window.alert("To browse this website you must accept the license.");
                        window.setTimeout(window.location.reload.bind(window.location), 3e3);
                    }
                }
            });
        }
    }
    EuropeanUnion.mgrnotice = mgrnotice;
})(EuropeanUnion || (EuropeanUnion = {}));

$(function() {
    HypertextTransfer.autoredirect();
    URIs.startdefusinghashuris();
    Automation.updaterequisites();
    EuropeanUnion.mgrnotice();
});