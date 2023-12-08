/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
"use strict";

var HomePage;

(function(HomePage) {
    let AutoFocus;
    (function(AutoFocus) {
        function mgrfocus() {
            $(function() {
                if (Automation.autofocus == true) {
                    window.setTimeout(function() {
                        $("#s").first().trigger("focus", {
                            preventScroll: false
                        });
                    }, 300);
                }
            });
        }
        AutoFocus.mgrfocus = mgrfocus;
    })(AutoFocus || (AutoFocus = {}));
    let MainSearchBar;
    (function(MainSearchBar) {
        let extratimeout = 0;
        let TextBox;
        (function(TextBox) {
            function setplaceholder(config, sform) {
                let examples = config.find("examples");
                let sboxplaceholder = examples.find("example[type='placeholder']").text();
                let suglist = sform.find("datalist");
                sform.find("input[type='search']").attr("placeholder", sboxplaceholder);
                suglist.append($(`<option value="${sboxplaceholder}" label="Example: ${sboxplaceholder}">`));
            }
            TextBox.setplaceholder = setplaceholder;
            function focus(e) {
                $("#s").trigger("focus");
            }
            TextBox.focus = focus;
        })(TextBox = MainSearchBar.TextBox || (MainSearchBar.TextBox = {}));
        let Form;
        (function(Form) {
            function clean(e) {
                let limitf = $("input#ek");
                let ival = limitf.val();
                if (ival !== undefined) {
                    limitf.prop("disabled", ival.toString().length <= 0);
                }
            }
            Form.clean = clean;
        })(Form = MainSearchBar.Form || (MainSearchBar.Form = {}));
        let Dropdown;
        (function(Dropdown) {
            function mgrlimit(e) {
                let newlimititem = $(this);
                let oldlimititem = $("#mainsearch .active[data-limit]");
                let newlimit = newlimititem.data("limit");
                let limitdropdown = $("#limitDropDown");
                let limitf = $("input#ek");
                oldlimititem.removeClass("active");
                newlimititem.addClass("active");
                switch (newlimit) {
                  case "s":
                  case "h":
                  case "a":
                    limitf.val(newlimit);
                    limitdropdown.addClass("active");
                    break;

                  default:
                    limitf.val("");
                    limitdropdown.removeClass("active");
                }
            }
            Dropdown.mgrlimit = mgrlimit;
            function setmacrocategorycounts(config, slimiter) {
                let mcstatistics = config.find("metadata macrocategory counts count");
                mcstatistics.each(function() {
                    let currentcount = $(this);
                    let formstat = slimiter.find(`span[data-type='${currentcount.attr("type")}']`);
                    formstat.text(currentcount.text());
                    formstat.removeClass("visually-hidden");
                });
            }
            Dropdown.setmacrocategorycounts = setmacrocategorycounts;
        })(Dropdown = MainSearchBar.Dropdown || (MainSearchBar.Dropdown = {}));
        function prepare() {
            $(document).on("click", "#mainsearch .form-text", TextBox.focus);
            $(document).on("click", "#mainsearch *[data-limit]", Dropdown.mgrlimit);
            $(document).on("submit", "#mainsearch form", Form.clean);
            AutoFocus.mgrfocus();
        }
        function populate(data, textStatus, jqXHR) {
            $(function() {
                let sformconfig = $(data).find("searchform");
                TextBox.setplaceholder(sformconfig, $("#mainsearch form"));
                Dropdown.setmacrocategorycounts(sformconfig, $("#mainsearch #limitDropDownList"));
                prepare();
            });
        }
        function downloadXML() {
            function sformloaderror(xhr, status, error) {
                console.error(`Search bar loading error "${error}" (${status})`);
                if (status == "timeout" || status == "parsererror") {
                    if (extratimeout < 3e3) {
                        extratimeout += 250;
                        window.setTimeout(downloadXML, 500 + extratimeout / 2);
                    } else {
                        window.setTimeout(document.location.reload.bind(document.location), 700);
                    }
                }
            }
            $.ajax({
                url: "/search/form",
                timeout: 5e3 + extratimeout,
                success: populate,
                error: function(xhr, status, error) {
                    sformloaderror(xhr, status, error);
                },
                dataType: "xml"
            });
        }
        MainSearchBar.downloadXML = downloadXML;
        if (window.requestIdleCallback !== undefined) {
            window.requestIdleCallback(downloadXML, {
                timeout: 500
            });
        } else downloadXML();
    })(MainSearchBar = HomePage.MainSearchBar || (HomePage.MainSearchBar = {}));
})(HomePage || (HomePage = {}));