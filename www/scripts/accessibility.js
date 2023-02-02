/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

var NightMode;

(function(NightMode) {
    let NavBar;
    (function(NavBar) {
        function mgr(mutationList, observer) {
            let barnightmode = window.localStorage.getItem("bar_night_mode");
            let navbar = $(".navbar");
            if (barnightmode == "true" && navbar.length > 0) {
                navbar.removeClass("bg-light navbar-light");
                navbar.addClass("bg-dark navbar-dark");
            } else {
                navbar.removeClass("bg-dark navbar-dark");
                navbar.addClass("bg-light navbar-light");
            }
            let navbtn = $(".navbar button[type='submit']");
            if (barnightmode == "true" && navbtn.length > 0) {
                navbtn.addClass("btn-outline-light");
            } else {
                navbtn.removeClass("btn-outline-light");
            }
            if (observer != null) observer.disconnect();
        }
        NavBar.mgr = mgr;
    })(NavBar = NightMode.NavBar || (NightMode.NavBar = {}));
    let Main;
    (function(Main) {
        function mgr(mutationList, observer) {
            let main = $("main");
            if (main.length <= 0) return;
            let mainnightmode = window.localStorage.getItem("main_night_mode");
            main = null;
            let body = $("body");
            let dropdowns = $(".dropdown-menu");
            if (mainnightmode == "true") {
                body.removeClass("bg-body");
                body.addClass("bg-light bg-gradient");
                if (dropdowns.length > 0) {
                    dropdowns.addClass("dropdown-menu-dark");
                    if (observer != null) observer.disconnect();
                }
            } else {
                body.removeClass("bg-light bg-gradient");
                body.addClass("bg-body");
                if (dropdowns.length > 0) {
                    dropdowns.removeClass("dropdown-menu-dark");
                    if (observer != null) observer.disconnect();
                }
            }
        }
        Main.mgr = mgr;
    })(Main = NightMode.Main || (NightMode.Main = {}));
})(NightMode || (NightMode = {}));

var SimpleFonts;

(function(SimpleFonts) {
    function mgr(mutationList, observer) {
        let body = $("body");
        if (body.length <= 0) return; else if (observer != null) observer.disconnect();
        let spacedfonts = window.localStorage.getItem("fonts_spaced");
        let ssfonts = window.localStorage.getItem("fonts_sans_serif");
        if (spacedfonts == "true") {
            body.css("letter-spacing", "0.02rem");
        } else {
            body.css("letter-spacing", "initial");
        }
        if (ssfonts == "true") {
            body.css("font-family", '"Zen Maru Gothic"');
        } else {
            body.css("font-family", "var(--bs-font-sans-serif)");
        }
    }
    SimpleFonts.mgr = mgr;
})(SimpleFonts || (SimpleFonts = {}));

var BulletTime;

(function(BulletTime) {
    function mgr(p1, p2) {
        let html = $("html");
        let slowmo = window.localStorage.getItem("animations_slow");
        if (slowmo == "true") {
            $["animation_speed"] = "slow";
            html.addClass("slow");
        } else {
            $["animation_speed"] = "fast";
            html.removeClass("slow");
            if (html.attr("class") == "") html.removeAttr("class");
        }
    }
    BulletTime.mgr = mgr;
})(BulletTime || (BulletTime = {}));

var ReturnToTop;

(function(ReturnToTop) {
    let assigned = false;
    function returntotop() {
        window.scrollTo(0, 0);
    }
    function mgr(e) {
        let pageh = $(document).height();
        let viewporth = $(window).height();
        if (pageh == undefined || viewporth === undefined) return;
        if (pageh > viewporth + 15) {
            let rtt = e.data.btn;
            if (assigned == false) {
                rtt.on("click", returntotop);
                assigned = true;
            }
            rtt.removeClass("visually-hidden");
        }
    }
    ReturnToTop.mgr = mgr;
})(ReturnToTop || (ReturnToTop = {}));

var JQ;

(function(JQ) {
    let UI;
    (function(UI) {
        let mgrclosebtnto = 0;
        function forcerefresh(e, ui) {
            $(e.target).trigger("resize");
        }
        function mgrclosebtn(e, ui) {
            let draggable = $(e.target);
            let cbtn = draggable.find(".btn-close");
            if (e.type == "dragstart") {
                cbtn.attr("disabled", "disabled");
                cbtn.addClass("disabled");
            } else {
                window.clearTimeout(mgrclosebtnto);
                mgrclosebtnto = window.setTimeout(function() {
                    cbtn.removeAttr("disabled");
                    cbtn.removeClass("disabled");
                }, 500);
            }
        }
        function mgrshadow(e, ui) {
            let draggable = $(e.target);
            if (e.type == "dragstart") draggable.addClass("shadow-none"); else if (e.type == "dragstop") draggable.removeClass("shadow-none");
        }
        function mgrdraggable() {
            let draggables = $(".draggable");
            draggables.draggable({
                containment: "document",
                scroll: false,
                opacity: .7
            });
            draggables.on("mousedown dragstop", forcerefresh);
            draggables.on("dragstart dragstop", mgrclosebtn);
            draggables.on("dragstart dragstop", mgrshadow);
        }
        UI.mgrdraggable = mgrdraggable;
    })(UI = JQ.UI || (JQ.UI = {}));
})(JQ || (JQ = {}));

var BS;

(function(BS) {
    let Popper;
    (function(Popper) {
        function disposetooltip(e) {
            e.data.tooltip.hide();
            window.setTimeout(function() {
                try {
                    e.data.tooltip.dispose();
                } catch {}
            }, 500);
        }
        function addtooltip(index, element) {
            let t = new bootstrap.Tooltip(element);
            $(element).on("destroytooltip", {
                tooltip: t
            }, disposetooltip);
        }
        function mgrtooltips() {
            var tooltipTriggerList = $('[data-bs-toggle="tooltip"]');
            tooltipTriggerList.each(addtooltip);
        }
        Popper.mgrtooltips = mgrtooltips;
    })(Popper = BS.Popper || (BS.Popper = {}));
})(BS || (BS = {}));

{
    const allHTML = document.getElementsByTagName("html")[0];
    const barObserver = new MutationObserver(NightMode.NavBar.mgr);
    const mainObserver = new MutationObserver(NightMode.Main.mgr);
    const fontObserver = new MutationObserver(SimpleFonts.mgr);
    const observerOptions = {
        childList: true,
        attributes: false,
        subtree: false
    };
    if (allHTML != null) {
        barObserver.observe(allHTML, observerOptions);
        mainObserver.observe(allHTML, observerOptions);
        fontObserver.observe(allHTML, observerOptions);
    }
}

$(JQ.UI.mgrdraggable);

$(BS.Popper.mgrtooltips);

$(BulletTime.mgr);

$(function() {
    $(window).on("resize", {
        btn: $("footer #rtt")
    }, ReturnToTop.mgr).trigger("resize");
});