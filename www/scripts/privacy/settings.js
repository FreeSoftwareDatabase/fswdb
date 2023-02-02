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
                let featvalue = window.localStorage.getItem(v);
                let feattvalue = featvalue == "true";
                featname = featname[0].toLocaleUpperCase() + featname.substring(1);
                featname = featname.replace(" ", ": ");
                if (feattvalue == true) {
                    settingsul.append(`<li class="hstack gap-3 list-group-item"><i class="bi bi-toggle-on"></i><span>${featname}</span></li>`);
                } else if (featvalue == null || featvalue == "") {
                    settingsul.append(`<li class="hstack gap-3 list-group-item"><i class="bi bi-toggles text-danger"></i><span>${featname}</span></li>`);
                } else {
                    settingsul.append(`<li class="hstack gap-3 list-group-item"><i class="bi bi-toggle-off"></i><span>${featname}</span></li>`);
                }
            });
        }
    } else {
        $("p#hasnopref").prop("hidden", false);
        $("p#haspref, .prefvisible").prop("hidden", true);
    }
});