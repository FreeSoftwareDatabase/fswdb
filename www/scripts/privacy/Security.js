/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

var Cookies;

(function(Cookies) {
    function enabled() {
        return navigator.cookieEnabled === true;
    }
    Cookies.enabled = enabled;
})(Cookies || (Cookies = {}));

var Security;

(function(Security) {
    let Widget;
    (function(Widget) {
        let BrowserWipe;
        (function(BrowserWipe) {
            function forgetall(e) {
                if (e.button != 0) return;
                try {
                    if (window.localStorage.length > 0) {
                        window.localStorage.clear();
                    }
                } catch {}
                try {
                    if (window.sessionStorage.length > 0) {
                        if (window.sessionStorage.getItem("cookiesaccepted") == String(true)) {
                            window.sessionStorage.removeItem("cookiesaccepted");
                        }
                    }
                } catch {}
                let forgetAllModal = bootstrap.Modal.getInstance(e.data.modal);
                forgetAllModal.hide();
                window.setTimeout(function() {
                    $.ajax({
                        method: "HEAD",
                        crossDomain: false,
                        cache: false,
                        timeout: 5e3,
                        headers: {
                            "X-Request-Action": "clearsession"
                        },
                        complete: function() {
                            window.location.reload();
                        }
                    });
                }, 500);
            }
            BrowserWipe.forgetall = forgetall;
        })(BrowserWipe = Widget.BrowserWipe || (Widget.BrowserWipe = {}));
        let Modal;
        (function(Modal) {
            let Button;
            (function(Button) {
                function enable(btn) {
                    btn.attr("aria-disabled", "false");
                    btn.removeAttr("disabled");
                }
                function disable(btn) {
                    btn.attr("aria-disabled", "true");
                    btn.attr("disabled", "true");
                }
                function manage(e) {
                    let btn = e.data.button;
                    let modal = bootstrap.Modal.getInstance(e.data.modal);
                    if (e.type == "shown") {
                        if (modal != null && Cookies.enabled() !== true) {
                            window.alert("Your browser or an extension installed inside your browser has disabled the cookies. Cookies are required to use this functionality.");
                            modal.hide();
                        }
                        window.setTimeout(function() {
                            enable(btn);
                        }, e.data.timeout);
                    } else if (e.type == "hide") disable(btn);
                }
                Button.manage = manage;
            })(Button = Modal.Button || (Modal.Button = {}));
            let ForgetModal;
            (function(ForgetModal) {
                function prepare(e) {
                    let m = $("#" + e.data["modalid"]);
                    let w = m.find("#wipeall");
                    m.on("shown.bs.modal hide.bs.modal", {
                        button: w,
                        timeout: 2e3
                    }, Widget.Modal.Button.manage);
                    w.on("dblclick", {
                        modal: m
                    }, Widget.BrowserWipe.forgetall);
                }
                ForgetModal.prepare = prepare;
            })(ForgetModal = Modal.ForgetModal || (Modal.ForgetModal = {}));
        })(Modal = Widget.Modal || (Widget.Modal = {}));
    })(Widget = Security.Widget || (Security.Widget = {}));
    $(window).on("load", {
        modalid: "forgetModal"
    }, Widget.Modal.ForgetModal.prepare);
})(Security || (Security = {}));