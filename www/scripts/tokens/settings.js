/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

$(function() {
    let hassettings = false;
    let settingsl = null;
    try {
        hassettings = window.localStorage.getItem("hassettings") != null;
        settingsl = window.localStorage.getItem("settingsl");
    } catch {}
    if (hassettings === true) {
        let settingsa = null;
        if (settingsl != null) settingsa = settingsl.split(";");
        let settingsul = $("ul#plist");
        $("p#haspref, .prefvisible").prop("hidden", false);
        $("p#hasnopref").prop("hidden", true);
        if (settingsa != null) {
            settingsa.forEach(function(v, i, a) {
                let featname = v.replace(new RegExp(/_/, "g"), " ");
                featname = featname[0].toLocaleUpperCase() + featname.substring(1);
                settingsul.append(`<li>${featname.replace(" ", ": ")}</li>`);
            });
        }
    } else {
        $("p#hasnopref").prop("hidden", false);
        $("p#haspref, .prefvisible").prop("hidden", true);
    }
});