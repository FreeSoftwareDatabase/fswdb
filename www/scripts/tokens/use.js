/* © Lorenzo L. Ancora, SPDX-License-Identifier: EUPL-1.2 */
import { Conversion } from "./Security.js";

var List;

(function(List) {
    function easytoggle(e) {
        let listItem = $(e.target);
        listItem.children("input").trigger("click");
    }
    List.easytoggle = easytoggle;
    function toggle(e) {
        let tid = "#" + $(e.target).data("list");
        let targets = $(tid + ' input[type="checkbox"]');
        targets.prop("checked", e.data.check);
    }
    List.toggle = toggle;
    function restoredefault(e) {
        let tid = "#" + $(e.target).data("list");
        let targets = $(tid + ' input[type="checkbox"]');
        function setdefault(index, element) {
            let cbox = $(this);
            cbox.prop("checked", cbox.data("default-checked"));
        }
        targets.each(setdefault);
    }
    List.restoredefault = restoredefault;
    function memodefault(index, element) {
        let li = $(this);
        let licbox = li.children('input[type="checkbox"]');
        licbox.data("default-checked", licbox.prop("checked"));
    }
    List.memodefault = memodefault;
})(List || (List = {}));

var TextInput;

(function(TextInput) {
    function trim(e) {
        let input = $(e.target);
        let curvalue = String(input.val());
        input.val(curvalue.trim());
    }
    TextInput.trim = trim;
    function updatecount(e) {
        let input = $(e.target);
        let curlen = String(input.val()).length;
        let counter = $("span[data-counter-for=" + input.attr("id") + "]");
        let ment = "&nbsp;&lt;&nbsp;";
        counter.html(input.attr("minlength") + ment + String(curlen) + ment + input.attr("maxlength"));
    }
    TextInput.updatecount = updatecount;
    function togglesubmit(e) {
        let submit = e.data.submit;
        let input = $(e.target);
        let length = String(input.val()).length;
        let minlen = Number(input.attr("minlength"));
        let maxlen = Number(input.attr("maxlength"));
        let uflow = length < minlen;
        let oflow = length > maxlen;
        submit.prop("disabled", uflow || oflow);
    }
    TextInput.togglesubmit = togglesubmit;
    function imposeb64val(string, index, array) {
        let w = $(string.toString());
        let v = String(w.val()).toString();
        let hash = Conversion.SHA224b64hash(v);
        w.val(hash);
    }
    function valuetob64(e) {
        let inputs = e.data.tiids;
        if (Array.isArray(inputs) == false) {
            return false;
        }
        inputs.forEach(imposeb64val);
        return true;
    }
    TextInput.valuetob64 = valuetob64;
})(TextInput || (TextInput = {}));

var Legal;

(function(Legal) {
    function mgrcheckboxes() {
        let chbx = $("input[type=checkbox].legal");
        chbx.prop("checked", false);
    }
    Legal.mgrcheckboxes = mgrcheckboxes;
})(Legal || (Legal = {}));

$(function() {
    let listItems = $("ul.easyclick li");
    listItems.on("click", List.easytoggle);
    listItems.each(List.memodefault);
    let lessbtns = $(".lessbtn");
    let resetbtns = $(".rstbtn");
    let plusbtns = $(".plusbtn");
    lessbtns.on("click", {
        check: false
    }, List.toggle);
    resetbtns.on("click", List.restoredefault);
    plusbtns.on("click", {
        check: true
    }, List.toggle);
    let txtinputs = $('input[type="text"], textarea');
    txtinputs.on("change", TextInput.trim);
    txtinputs.on("change", TextInput.updatecount);
    txtinputs.on("change", {
        submit: $("#resupdbtn")
    }, TextInput.togglesubmit);
    txtinputs.trigger("change");
    $("form#tuse").on("submit", {
        tiids: Array("#sectag")
    }, TextInput.valuetob64);
    Legal.mgrcheckboxes();
});