let x = '';
let x1 = '';
let x2 = '';
let sing = '';

const digit = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const action = ['/', '*', '+', '-'];

const outfirst = document.querySelector('.dcscreenfirst p');
const out = document.querySelector('.dcscreen p');

function clearAll() {
    x = '';
    out.textContent = 0;
    outfirst.textContent = '';
    x1 = '';
    x2 = '';
    sing = '';
}

function calculate() {

    if (x1 !== '' && x2 !== '' && sing !== '') {
        outfirst.textContent = `${x1}${sing}${x2}=`;

        switch (sing) {
            case '/':
                x = x1 / x2;
                break;
            case '*':
                x = x1 * x2;
                break;
            case '-':
                x = x1 - x2;
                break;
            case '+':
                x = (+x1) + (+x2);
                break;
        }

        let e = x.toString();
        let n = 0;
        x1 = '';
        x2 = '';
        sing = '';

        if (e === 'NaN' || e === 'Undefined' || e === 'Infinity') {

            out.textContent = 'Error';
            x = '';
            return;
        }

        if (e.length > 9) {
            if (x < 0.0000001) {
                while (x < 10) {
                    n += 1;
                    x = x * 10;
                }
                x = Math.round(x, 2);
                x = new String(x) + 'e-' + n;
            }
            if (x > 999999999) {
                while (x > 10) {
                    n += 1;
                    x = x / 10;
                }
                x = new String(x).substring(0, 3) + 'e+' + (n);
            } else x = new String(x).substring(0, 9);
        } else x = new String(x);

        const regexdot = /\.$/;
        if (x.match(regexdot)) {
            x = new String(x).substring(0, x.length - 1);
        }

        out.textContent = x;

    }

}

function backspace() {
    // before getting sing
    if (x.includes('e')) return; // 
    if (sing === '') {
        x = new String(x).substring(0, x.length - 1);
        x1 = ''; x2 = '';
    } else {
        // after receiving the sing  
        x = new String(x).substring(0, x.length - 1);
        if (x2 === '0') { x2 = ''; return };
        if (x2 !== '') {
            x2 = x;
        }
        else {
            x1 = x; outfirst.textContent = `${x1}` + sing;
        }

    }

    out.textContent = x;


    if (x === '' && x2 === '' && x1 !== '' && sing !== '') {
        x2 = '';
        x = x1;
        sing = '';
        out.textContent = x;
        outfirst.textContent = '';
        return;
    }

    if (x === '' && x1 !== '' && sing !== '') {
        out.textContent = 0;
        x2 = '';
        x = '';
        return;
    }

    if (x === '' && sing !== '') {
        out.textContent = 0;
        outfirst.textContent = '';
        x1 = '';
        x = '';
        sing = '';
    }
    if (x === '' && x2 === '' && x1 === '' && sing === '') {
        out.textContent = 0;
        outfirst.textContent = '';
    }
}

function exponentiate() {
    x1 = x;
    x2 = x;
    sing = '*';
    calculate();
    sing = '';
}

function expressionAdd(inputkey) {
    if (x.length < 9) {
        x += inputkey;
        out.textContent = x;
        if (sing !== '') x2 = x;
        console.table("add inputkey to x=" + x);
    }
}
function inputStr(inputkey) {
    console.table("inputkey=" + inputkey); // del console.log  

    // zero control
    if (x === '0' && inputkey === '0') return;

    // ground zero control
    if (x === '0' && digit.includes(inputkey)) {
        backspace();
        expressionAdd(inputkey);
        return;
    }

    // point control
    if (inputkey === '.') {
        if (!x.includes('.')) {
            if (x == '') expressionAdd(0);
            expressionAdd(inputkey);
        }
        return;
    }

    // before getting a sign (x1)
    if (sing === '') {
        if (action.includes(inputkey)) {
            x1 = x;
            x = '';
            sing = inputkey;
            outfirst.textContent = `${x1}` + inputkey;
        }
    }

    // after receiving the sign  (x2)
    if (sing !== '') {
        //character redefinition
        if (action.includes(inputkey)) {
            sing = inputkey;
            outfirst.textContent = `${x1}` + inputkey;
            inputkey = '';
        }
        /*////////////////////*/

    }

    /*//////////////////////////////////////////////////////*/
    expressionAdd(inputkey);
}


document.addEventListener('keydown', event => {
    const regexk = /^[0-9%\/*\-+=.,]|Backspace|Enter/;
    if ((event.key).match(regexk)) {
        if (event.key === ',') return inputStr('.');
        if (event.key === 'Backspace') return backspace();
        if (event.key === 'Enter') return calculate();
        if (event.key === '=') return calculate();
        inputStr(event.key)
    };
})

document.querySelector('.dc-buttons').onclick = (event) => {
    if (!event.target.classList.contains('dc-bn')) return;
    if (event.target.classList.contains('ac')) return clearAll();
    if (event.target.classList.contains('dci-backspace')) return backspace();
    if (event.target.classList.contains('dci-exponentiate')) return exponentiate();
    if (event.target.classList.contains('dci-equals')) return calculate();
    let key = event.target.textContent;
    if (event.target.classList.contains('dci-divide')) key = '/';
    if (event.target.classList.contains('dci-asterisk')) key = '*';
    if (event.target.classList.contains('dci-minus')) key = '-';
    if (event.target.classList.contains('dci-plus')) key = '+';
    inputStr(key)
}


window.addEventListener("message", (event) => {
    //if (event.origin !== "http://example.org:8080") //return;

    //const style = getComputedStyle(document.getElementById("dcalc"));
    //const oldsize = style.getPropertyValue("--width_dcalc_pv");
    //console.log(oldsize);

    console.log(event.data);
    document.querySelector('.ddcalc').style.setProperty('--width_dcalc_pv', event.data.sizenew + 'px');

}, false);