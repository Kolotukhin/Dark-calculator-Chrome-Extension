(function () {
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    console.log('Start content.js');

    var div = document.createElement('div');
    var controlbtn = document.getElementsByClassName('controlbtn_dcalc_pv');
    var path_calc = chrome.runtime.getURL('calc.html');
    var popup_el;
    var pos4 = 0;


    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log('From background.js: ' + request.greeting);//

        switch (request.greeting) {
            case 'connect_test':
                sendResponse({ greeting: "connect_test_ok" });
                break;
            case 'query_switch':
                chrome.runtime.sendMessage({ greeting: 'switch_on' });
                break;
            case 'switch':
                if (request.greeting === "switch") {
                    if (document.getElementById("dd_div_dcalc_pv")) {
                        document.getElementById("dd_div_dcalc_pv").remove();
                        return;
                    } else {
                        div.innerHTML = `
                            <div id="dd_div_dcalc_pv">
                                <div class="controlbtn_dcalc_pv">
                                    <div class="btn_dcalc_pv dci-zoom-plus_dcalc_pv"></div>
                                    <div class="btn_dcalc_pv dci-zoom-minus_dcalc_pv"></div>
                                    <div class="btn_dcalc_pv dci-arrows-alt_dcalc_pv"></div>
                                    <div class="btn_dcalc_pv dci-times_dcalc_pv"></div>
                                </div>
                                <iframe id="mainframe_dcalc_pv" src=`+ path_calc + ` scrolling="no" frameborder="0"></iframe>
                            </div>`;

                        document.body.append(div);
                        popup_el = document.getElementById("dd_div_dcalc_pv");

                        let posy = Math.round(popup_el.getBoundingClientRect().top)
                        pos4 = (posy + Math.round(document.documentElement.scrollTop));
                        popup_el.style.transition = "all 0s ease 0s";
                        popup_el.style.top = (pos4 + Math.round(document.documentElement.scrollTop)) + "px";


                    }
                }
                break;
        }



        if (document.getElementById("dd_div_dcalc_pv")) {

            function zoom_calc(size) {
                let myiFrame = document.getElementById("mainframe_dcalc_pv");

                const style_dd_div = getComputedStyle(document.getElementById("dd_div_dcalc_pv"));
                const oldsize = style_dd_div.getPropertyValue("--width_dcalc_pv")
                const newsize = parseInt(oldsize) + (parseInt(oldsize) / 100) * size;

                if (newsize < 100 || newsize > 600) return;

                myiFrame.contentWindow.postMessage({ msg: "set_size", sizenow: oldsize, sizenew: newsize, zooming: size }, "*");
                popup_el.style.setProperty('--width_dcalc_pv', newsize + 'px');

                let kf = 0.95;
                if (oldsize > newsize) kf = -0.95;

                popup_el.style.top = (parseInt(popup_el.style.top) - ((newsize / 7.3) * kf - (parseInt(oldsize) / 7.3) * kf)) + 'px';
                popup_el.style.left = (parseInt(popup_el.style.left) - ((newsize / 1.08) * kf - (parseInt(oldsize) / 1.08) * kf)) + 'px';

            }

            document.querySelector('.controlbtn_dcalc_pv').onclick = (event) => {
                if (event.target.classList.contains('dci-zoom-plus_dcalc_pv')) {
                    zoom_calc(20);
                    return;
                }
                if (event.target.classList.contains('dci-zoom-minus_dcalc_pv')) {
                    zoom_calc(-20);
                    return;
                }
                if (event.target.classList.contains('dci-times_dcalc_pv')) {
                    popup_el.remove();
                    return;
                }
            }

            //Make the DIV element draggagle:
            dragElement(popup_el);

            function dragElement(elmnt) {
                let pos1 = 0, pos2 = 0, pos3 = 0;
                if (document.getElementById(elmnt.id + "header")) {
                    /* if present, the header is where you move the DIV from:*/
                    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
                } else {
                    /* otherwise, move the DIV from anywhere inside the DIV:*/
                    elmnt.onmousedown = dragMouseDown;
                }

                function dragMouseDown(e) {
                    elmnt.style.transition = "all 0s ease 0s";
                    e = e || window.event;
                    e.preventDefault();
                    // get the mouse cursor position at startup:
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.onmouseup = closeDragElement;
                    // call a function whenever the cursor moves:
                    document.onmousemove = elementDrag;
                }

                function elementDrag(e) {
                    e = e || window.event;
                    e.preventDefault();
                    // calculate the new cursor position:
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    // set the element's new position:
                    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
                }

                function closeDragElement() {
                    /* stop moving when mouse button is released:*/
                    document.onmouseup = null;
                    document.onmousemove = null;
                }

                // When the user scrolls down 50px from the top of the document, resize the header's font size
                window.onscroll = function () { scrollFunction() };
                function scrollFunction() {
                    elmnt.style.transition = "all 0.5s ease-out";
                    elmnt.style.top = (pos4 + Math.round(document.documentElement.scrollTop)) + "px";

                }

            }
        }

    });
})();
