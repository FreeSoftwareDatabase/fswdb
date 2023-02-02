/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

var Accessibility;

(function(Accessibility) {
    let Widget;
    (function(Widget) {
        let Option;
        (function(Option) {
            function restoreState(i, o) {
                let aswitch = $(o);
                let memkey = String(aswitch.data("memory"));
                let memstatus = window.localStorage.getItem(memkey);
                aswitch.prop("checked", memstatus == "true");
            }
            Option.restoreState = restoreState;
            function manageIcon(e) {
                let icon = $(e.data.icon);
                if (e.data.switch.prop("checked") == true) {
                    icon.addClass("schecked");
                    icon.removeClass("sunchecked");
                } else {
                    icon.addClass("sunchecked");
                    icon.removeClass("schecked");
                }
            }
            Option.manageIcon = manageIcon;
            function saveState(e) {
                let aswitch = $(e.target);
                let status = aswitch.is(":checked");
                let memkey = String(aswitch.data("memory"));
                let ocallback = String(aswitch.data("observer-callback"));
                let settingsl = window.localStorage.getItem("settingsl");
                window.localStorage.setItem(memkey, String(status));
                window.localStorage.setItem("hassettings", String(true));
                if (settingsl == null) {
                    window.localStorage.setItem("settingsl", memkey);
                } else {
                    if (settingsl.indexOf(memkey) == -1) {
                        window.localStorage.setItem("settingsl", settingsl + ";" + memkey);
                    }
                }
                let cb;
                if (ocallback.indexOf(":") > 0) {
                    let splitcb = ocallback.split(":", 2);
                    let callbackscope = splitcb[0];
                    let callbacksubscope = splitcb[1];
                    cb = window[callbackscope][callbacksubscope];
                } else {
                    cb = window[ocallback];
                }
                try {
                    if (cb.mgr !== undefined) cb.mgr(null, null);
                } catch {}
            }
            Option.saveState = saveState;
        })(Option = Widget.Option || (Widget.Option = {}));
    })(Widget || (Widget = {}));
    $(function() {
        let aswitches = $('.accessibility-input[type="checkbox"]');
        let btswitch = $('#fntswitchsl.accessibility-input[type="checkbox"]');
        let gothicswitch = $('#fntswitchss.accessibility-input[type="checkbox"]');
        let nmswitch = $('#nmswitchcnt.accessibility-input[type="checkbox"]');
        let aiswitch = $('#aiswitchaf.accessibility-input[type="checkbox"]');
        aswitches.each(Widget.Option.restoreState);
        aswitches.on("change", Widget.Option.saveState);
        btswitch.on("change", {
            switch: btswitch,
            icon: "#bti"
        }, Widget.Option.manageIcon);
        btswitch.trigger("change", {
            switch: btswitch,
            icon: "#bti"
        });
        gothicswitch.on("change", {
            switch: gothicswitch,
            icon: "#fnt"
        }, Widget.Option.manageIcon);
        gothicswitch.trigger("change", {
            switch: gothicswitch,
            icon: "#fnt"
        });
        nmswitch.on("change", {
            switch: nmswitch,
            icon: "#nm"
        }, Widget.Option.manageIcon);
        nmswitch.trigger("change", {
            switch: nmswitch,
            icon: "#nm"
        });
        aiswitch.on("change", {
            switch: aiswitch,
            icon: "#aii"
        }, Widget.Option.manageIcon);
        aiswitch.trigger("change", {
            switch: aiswitch
        });
        $(".js-unlock").removeAttr("disabled").removeAttr("aria-disabled");
    });
})(Accessibility || (Accessibility = {}));