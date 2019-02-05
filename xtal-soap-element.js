import { XtalElement } from 'xtal-element/xtal-element.js';
const endPoint = 'end-point';
export class XtalSoapElement extends XtalElement {
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
    connectedCallback() {
        this.onPropsChange();
    }
    onPropsChange() {
        const rc = this.renderContext;
        const esc = this.eventSwitchContext;
        if (this.mainTemplate !== undefined) {
            if (esc && esc.eventManager !== undefined) {
                esc.eventManager(this.root, esc);
            }
            if (rc && rc.init !== undefined) {
                rc.init(this.mainTemplate, rc, this.root, this.renderOptions);
            }
            else {
                this.root.appendChild(this.mainTemplate.content.cloneNode(true));
            }
            this._initialized = true;
        }
        return true;
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
