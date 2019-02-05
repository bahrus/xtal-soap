import { XtalElement } from 'xtal-element/xtal-element.js';
const endpoint = 'endpoint';
export class XtalSoapElement extends XtalElement {
    constructor() {
        super(...arguments);
        this._response = '';
    }
    get value() {
        return this._value;
    }
    setValue(nv) {
        this._value = nv;
        this.de('value', { value: nv });
        this.setResponse(this.responseBuilder(this));
    }
    get response() {
        return this._response;
    }
    setResponse(nv) {
        this._response = nv;
        this.de('response', { response: nv });
        this.onPropsChange();
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
                if (this._initialized) {
                    rc.update(rc, this.root);
                }
                else {
                    rc.init(this.mainTemplate, rc, this.root, this.renderOptions);
                    rc.update = this.update;
                }
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
            'Access-Control-Allow-Origin': '*',
        });
        fetch(this._endpoint, {
            method: 'POST',
            headers: headers,
            body: body,
        }).then(resp => {
            resp.text().then(txt => {
                const dp = new DOMParser();
                this.setValue(dp.parseFromString(txt, 'application/xml'));
            });
        });
    }
}
