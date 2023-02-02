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

var GDPR;

(function(GDPR) {
    function _init_storage() {
        if (WebBrowser._localstorage_available()) GDPR.stg = window.localStorage; else GDPR.stg = window.sessionStorage;
    }
    function acceptcookies() {
        let cdate = Date.now();
        GDPR.stg.setItem("cookiesaccepted", String(cdate));
    }
    function cookiesaccepted() {
        let d = GDPR.stg.getItem("cookiesaccepted");
        if (d !== null) {
            let adate = Number.parseInt(d);
            let cdate = Date.now();
            return cdate - adate < 15768e6;
        } else return false;
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
    function shownotice(data, textStatus, jqXHR) {
        $(data).insertAfter("main");
        let cNotice = $("#gdprcnt");
        let cToast = null;
        if (cNotice.length > 0 && Automation.botUA == false) {
            function shownoticeintoast() {
                let cookieNotice = cNotice.get(0);
                if (cookieNotice === undefined) return;
                cToast = new bootstrap.Toast(cookieNotice);
                cToast.show();
                cNotice.on("hide.bs.toast", acceptcookies);
                cNotice.on("hidden.bs.toast", deletenotice);
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
    function mgrcookienotice() {
        _init_storage();
        if (cookiesaccepted() == true) deletenode(); else {
            $.get("/static/cookietoast.html", shownotice, "html").fail(function() {
                window.alert("This website uses only technical cookies.");
                acceptcookies();
            });
        }
    }
    GDPR.mgrcookienotice = mgrcookienotice;
})(GDPR || (GDPR = {}));

$(function() {
    HypertextTransfer.autoredirect();
    URIs.startdefusinghashuris();
    Automation.updaterequisites();
    GDPR.mgrcookienotice();
});