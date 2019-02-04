import { XtallatX } from 'xtal-latx/xtal-latx.js';
const endPoint = 'end-point';
export class XtalSoapElement extends XtallatX(HTMLElement) {
    get value() {
        return this._value;
    }
    set value(nv) {
        this._value = nv;
        this.de('value', { value: nv });
    }
    get endPoint() {
        return this._endPoint;
    }
    set endPoint(nv) {
        this.attr(endPoint, nv);
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([endPoint]);
    }
    attributeChangedCallback() {
        throw 'not implemented';
    }
    postMessage() {
        const requestTemplate = document.createElement('template');
        this.messageFormatContext.init(this, this.messageFormatContext, requestTemplate);
        const body = requestTemplate.innerHTML;
        const headers = new Headers({
            'Content-Type': 'text/xml; charset=utf-8',
            // 'Content-Length': body.length,
            'Access-Control-Allow-Origin': '*',
        });
        fetch(this._endPoint, {
            method: 'POST',
            headers: headers,
            body: body,
        }).then(resp => {
            resp.text().then(txt => {
                const tmpl = document.createElement('template');
                tmpl.innerHTML = txt;
                this.value = tmpl;
            });
        });
        //this.value = tmpl;
    }
}
