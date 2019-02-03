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
    static get observedAttributes() {
        return super.observedAttributes.concat([endPoint]);
    }
    attributeChangedCallback() {
        throw 'not implemented';
    }
    postMessage() {
        const tmpl = document.createElement('template');
        this.messageFormatContext.init(this, this.messageFormatContext, tmpl);
    }
}
