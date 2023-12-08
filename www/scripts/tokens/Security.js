/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
export var Conversion;

(function(Conversion) {
    function strtowa(utf8str) {
        if (typeof utf8str !== "string") {
            throw new Error("Not a string.");
        }
        return CryptoJS.enc.Utf8.parse(utf8str);
    }
    Conversion.strtowa = strtowa;
    function watosha224wa(wa) {
        if (typeof wa === "string") {
            throw new Error("Not a WordArray.");
        }
        return CryptoJS.SHA224(wa);
    }
    Conversion.watosha224wa = watosha224wa;
    function watob64str(wa) {
        if (typeof wa === "string") {
            throw new Error("Not a WordArray.");
        }
        return CryptoJS.enc.Base64.stringify(wa);
    }
    Conversion.watob64str = watob64str;
    function SHA224b64hash(txt) {
        let s = strtowa(txt);
        let shash = watosha224wa(s);
        let b64shash = watob64str(shash);
        return b64shash;
    }
    Conversion.SHA224b64hash = SHA224b64hash;
})(Conversion || (Conversion = {}));

var Cookies;

(function(Cookies) {
    function enabled() {
        return navigator.cookieEnabled === true;
    }
    Cookies.enabled = enabled;
})(Cookies || (Cookies = {}));

var Security;

(function(Security) {
    let Token;
    (function(Token) {
        let Validation;
        (function(Validation) {
            Validation.AJAXXHR = null;
            function begin(jqXHR, settings) {
                let bsmodal = $(this);
                bsmodal.attr("data-awaiting", "XHR");
                bsmodal.find("input").prop("disabled", true);
                let b64t, b64shash;
                {
                    let t = Conversion.strtowa(settings.headers["X-Token"]);
                    b64t = Conversion.watob64str(t);
                    b64shash = Conversion.SHA224b64hash(settings.headers["X-Sectag"]);
                }
                jqXHR.setRequestHeader("X-Token", b64t);
                jqXHR.setRequestHeader("X-Sectag", b64shash);
            }
            Validation.begin = begin;
            function accepted(data, textStatus, jqXHR) {
                let bsmodal = this;
                Validation.AJAXXHR = null;
                bsmodal.hide();
            }
            Validation.accepted = accepted;
            function reporterror(error) {
                try {
                    navigator.vibrate(100);
                } catch (e) {}
                window.alert(error);
            }
            Validation.reporterror = reporterror;
            function rejected(jqXHR, textStatus, errorThrown) {
                reporterror("Wrong token/sectag.");
            }
            Validation.rejected = rejected;
            function failed(jqXHR, textStatus, errorThrown) {
                reporterror("Verification failed. No action performed.");
            }
            Validation.failed = failed;
            function success(data, textStatus, jqXHR) {
                reporterror("Verification passed. The token is now stored in your web browser.");
                document.location.reload();
            }
            Validation.success = success;
            function completed(jqXHR, textStatus) {
                let bsmodal = $(this);
                window.setTimeout(function() {
                    bsmodal.removeAttr("data-awaiting");
                    bsmodal.find("input").prop("disabled", false);
                    Validation.AJAXXHR = null;
                }, 500);
            }
            Validation.completed = completed;
        })(Validation || (Validation = {}));
        function validate(e) {
            let tokenInput = e.data.tokenInput;
            let secTagInput = e.data.secTagInput;
            let token = String(tokenInput.val());
            let sectag = String(secTagInput.val());
            let tokenAddModal = document.getElementById(e.data.bsmodalid);
            let bsTokenAddModal = null;
            if (tokenAddModal !== null) {
                bsTokenAddModal = bootstrap.Modal.getInstance(tokenAddModal);
            }
            tokenAddModal = null;
            Validation.AJAXXHR = $.ajax({
                method: "HEAD",
                crossDomain: false,
                cache: false,
                timeout: 5e3,
                headers: {
                    "X-Request-Action": "memotoken",
                    "X-Token": token,
                    "X-Sectag": sectag
                },
                context: bsTokenAddModal,
                beforeSend: Validation.begin,
                statusCode: {
                    202: Validation.accepted,
                    403: Validation.rejected
                },
                error: Validation.failed,
                success: Validation.success,
                complete: Validation.completed
            });
        }
        Token.validate = validate;
        function abortvalidation() {
            if (Validation.AJAXXHR !== null) {
                try {
                    Validation.AJAXXHR.abort();
                } catch {}
                Validation.reporterror("Token validation aborted by user.");
            }
        }
        Token.abortvalidation = abortvalidation;
    })(Token || (Token = {}));
    let Widget;
    (function(Widget) {
        let TokenInput;
        (function(TokenInput) {
            function cleartag(e) {
                let stag = e.data["secTagInput"];
                if (window.crypto.getRandomValues !== undefined) {
                    stag.val(String(window.crypto.getRandomValues(new Uint8Array(6))));
                } else if (Math.random !== undefined) {
                    stag.val(String(Math.random()).repeat(3));
                }
                stag.val("");
            }
            TokenInput.cleartag = cleartag;
            function trimcontent(e) {
                if ("currentTarget" in e) {
                    let input = $(e.currentTarget);
                    let txt = String(input.val());
                    if (txt.indexOf(" ") > -1) {
                        input.val(txt.trim());
                        return false;
                    }
                }
            }
            TokenInput.trimcontent = trimcontent;
        })(TokenInput = Widget.TokenInput || (Widget.TokenInput = {}));
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
                function focus(input) {
                    $(function() {
                        if (Automation.autofocus == true) {
                            window.setTimeout(function() {
                                $(input).first().trigger("focus", {
                                    preventScroll: false
                                });
                            }, 300);
                        }
                    });
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
                        focus(e.data.tokeninput);
                    } else if (e.type == "hide") disable(btn);
                }
                Button.manage = manage;
            })(Button = Modal.Button || (Modal.Button = {}));
            let TokenModal;
            (function(TokenModal) {
                function prepare(e) {
                    let m = $("#" + e.data["modalid"]);
                    let t = m.find("#token");
                    let s = m.find("#sectag");
                    let b = m.find("#validatetoken");
                    m.on("hidden.bs.modal", {
                        secTagInput: s
                    }, Widget.TokenInput.cleartag);
                    m.on("shown.bs.modal hide.bs.modal", {
                        button: b,
                        tokeninput: t,
                        modal: m,
                        timeout: 2e3
                    }, Widget.Modal.Button.manage);
                    m.on("hide.bs.modal", Token.abortvalidation);
                    m.find("input").on("change focusout paste", Widget.TokenInput.trimcontent);
                    b.on("click", {
                        tokenInput: t,
                        secTagInput: s,
                        bsmodalid: e.data.modalid
                    }, Token.validate);
                }
                TokenModal.prepare = prepare;
            })(TokenModal = Modal.TokenModal || (Modal.TokenModal = {}));
        })(Modal = Widget.Modal || (Widget.Modal = {}));
    })(Widget = Security.Widget || (Security.Widget = {}));
    $(window).on("load", {
        modalid: "addTokenModal"
    }, Widget.Modal.TokenModal.prepare);
})(Security || (Security = {}));