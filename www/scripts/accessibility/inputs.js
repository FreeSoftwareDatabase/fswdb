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
                if (e.data.switch.prop("checked") == true) {
                    $("#bti").prop("hidden", false);
                    $("#btif").prop("hidden", true);
                } else {
                    $("#bti").prop("hidden", true);
                    $("#btif").prop("hidden", false);
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
                let cb = window[ocallback];
                if (cb !== undefined) cb(null, null);
            }
            Option.saveState = saveState;
        })(Option = Widget.Option || (Widget.Option = {}));
    })(Widget || (Widget = {}));
    $(function() {
        let aswitches = $('.accessibility-input[type="checkbox"]');
        let btswitch = $('#fntswitchsl.accessibility-input[type="checkbox"]');
        aswitches.each(Widget.Option.restoreState);
        aswitches.on("change", Widget.Option.saveState);
        btswitch.on("change", {
            switch: btswitch
        }, Widget.Option.manageIcon);
        btswitch.trigger("change", {
            switch: btswitch
        });
        $(".js-unlock").removeAttr("disabled").removeAttr("aria-disabled");
    });
})(Accessibility || (Accessibility = {}));