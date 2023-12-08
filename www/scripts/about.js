/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

var Tor;

(function(Tor) {
    let HiddenService;
    (function(HiddenService) {
        function copylink(e) {
            let val = String($(e.target).val()).toString();
            let clipboard = navigator.clipboard;
            if (clipboard !== undefined) {
                clipboard.writeText(val);
            }
        }
        HiddenService.copylink = copylink;
    })(HiddenService = Tor.HiddenService || (Tor.HiddenService = {}));
})(Tor || (Tor = {}));

var GitHub;

(function(GitHub) {
    const API_BASE = "https://api.github.com/";
    const REPO_BASE = "repos/FreeSoftwareDatabase/";
    let Repository;
    (function(Repository) {
        function download(e) {
            e.preventDefault();
            {
                let outlink = $(e.target);
                let outpath = outlink.data("href");
                let finalURL = `${API_BASE}${REPO_BASE}${outpath}`;
                let cbdlink = $("#cbdownload");
                let cbdlinkdesc = cbdlink.find("#cbtype");
                cbdlink.on("click", function() {
                    document.location.href = finalURL;
                });
                cbdlinkdesc.html(outpath);
            }
        }
        Repository.download = download;
    })(Repository = GitHub.Repository || (GitHub.Repository = {}));
})(GitHub || (GitHub = {}));

$(function() {
    $("a.torlink").on("click", Tor.HiddenService.copylink);
    $("a.scdownload").on("click", GitHub.Repository.download);
});