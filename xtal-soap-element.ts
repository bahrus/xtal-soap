import {XtallatX} from 'xtal-latx/xtal-latx.js';
import {RenderContext} from 'trans-render/init.d.js';
import {EventSwitchContext} from 'event-switch/event-switch.d.js';
import {XtalElement} from 'xtal-element/xtal-element.js';

const endpoint = 'endpoint';
export abstract class XtalSoapElement<TReq> extends XtalElement{
    //abstract get requestTemplate(): HTMLTemplateElement;
    abstract get mainTemplate(): HTMLTemplateElement;
    //abstract get messageFormatContext(): RenderContext;
    abstract get messageBuilder(): (t: this) => string;
    abstract get eventSwitchContext(): EventSwitchContext;
    
    _value!: HTMLTemplateElement;
    get value(){
        return this._value;
    }
    set value(nv){
        this._value = nv;
        this.de('value', {value: nv});
    }

    _endpoint!: string;
    get endpoint(){
        return this._endpoint;
    }
    set endpoint(nv){
        this.attr(endpoint, nv);
    }

    static get observedAttributes(){
        return super.observedAttributes.concat([endpoint]);
    }
    attributeChangedCallback(n: string, ov: string, nv: string){
        switch(n){
            case endpoint:
                this._endpoint = nv;
                break;
        }
    }

    connectedCallback(){
        this.onPropsChange();
    }

    abstract get renderContext(): RenderContext;

    onPropsChange(){
        const rc = this.renderContext;  
        const esc = this.eventSwitchContext;
        if(this.mainTemplate !== undefined){
            if(esc && esc.eventManager !== undefined){
                esc.eventManager(this.root, esc);
            }
            if(rc && rc.init !== undefined){
                rc.init(this.mainTemplate, rc, this.root, this.renderOptions);
            }else{
                this.root.appendChild(this.mainTemplate.content.cloneNode(true));
            }
            this._initialized = true;
        }
        return true;
    }

    postMessage(){
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
        }).then(resp =>{
            resp.text().then(txt =>{
                const tmpl = document.createElement('template');
                tmpl.innerHTML = txt;
                this.value = tmpl;
            })
        })
        //this.value = tmpl;
    }

}