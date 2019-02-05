import { XtalElement } from 'xtal-element/xtal-element.js';
const endpoint = 'endpoint';
export class XtalSoapElement extends XtalElement {
    get value() {
        return this._value;
    }
    set value(nv) {
        this._value = nv;
        this.de('value', { value: nv });
    }
    get endpoint() {
        return this._endpoint;
    }
    set endpoint(nv) {
        this.attr(endpoint, nv);
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([endpoint]);
    }
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case endpoint:
                this._endpoint = nv;
                break;
        }
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
        const requestXML = document.createElement('div');
        const body = this.messageBuilder(this);
        const headers = new Headers({
            'Content-Type': 'text/xml; charset=utf-8',
            // 'Content-Length': body.length,
            'Access-Control-Allow-Origin': '*',
        });
        fetch(this._endpoint, {
            method: 'POST',
            headers: headers,
            body: body,
        }).then(resp => {
            resp.text().then(txt => {
                //const tmpl = document.createElement('textarea');
                //tmpl.innerHTML = txt;
                const dp = new DOMParser();
                this.value = dp.parseFromString(txt, 'application/xml');
            });
        });
        //this.value = tmpl;
    }
}
