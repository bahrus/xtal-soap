//import {XtallatX} from 'xtal-latx/xtal-latx.js';
import {RenderContext, RenderOptions} from 'trans-render/init.d.js';
import {UpdateContext} from 'trans-render/update.d.js';
import {EventContext} from 'event-switch/event-switch.d.js';
import {XtalElement} from 'xtal-element/xtal-element.js';

const endpoint = 'endpoint';
export abstract class XtalSoapElement extends XtalElement{
    abstract get messageBuilder(): (t: this) => string;
    abstract get eventContext(): EventContext;
    //abstract get responseBuilder(): (t: this) => string;    
    _value!: Document;
    get value(){
        return this._value;
    }
    setValue(nv: Document){
        this._value = nv;
        this.de('value', {value: nv});
        //this.setResponse(this.responseBuilder(this));
    }

    // _response: String = '';
    // get response(){
    //     return this._response;
    // }
    // setResponse(nv: String){
    //     this._response = nv;
    //     this.de('response', {response: nv});
    //     this.onPropsChange();
    // }

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
        this._upgradeProperties(['endpoint']);
        super.connectedCallback();
        this.onPropsChange();
    }

    abstract get renderContext(): RenderContext;
    abstract get update(): (ctx: RenderContext, target: HTMLElement | DocumentFragment, options?: RenderOptions | undefined) => UpdateContext; 

    onPropsChange(){
        if(!super.onPropsChange()) return false;
        const rc = this.renderContext;  
        const esc = this.eventContext;
        if(this.mainTemplate !== undefined){
            if(esc && esc.eventManager !== undefined){
                esc.eventManager(this.root, esc);
            }
            if(rc && rc.init !== undefined){
                if(this._initialized){
                    rc.update!(rc, this.root);
                }else{
                    rc.init(this.mainTemplate, rc, this.root, this.renderOptions);
                    rc.update = this.update;
                }
                
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
            'Access-Control-Allow-Origin': '*',

        });
        fetch(this._endpoint, {
            method: 'POST',
            headers: headers,
            body: body,
        }).then(resp =>{
            resp.text().then(txt =>{
                const dp = new DOMParser();
                this.setValue(dp.parseFromString(txt, 'application/xml'));
            })
        })
    }

}