import {XtallatX} from 'xtal-latx/xtal-latx.js';
import {RenderContext} from 'trans-render/init.d.js';
import {EventSwitchContext} from 'event-switch/event-switch.d.js';

const endPoint = 'end-point';
export abstract class XtalSoapElement<TReq> extends XtallatX(HTMLElement){
    abstract get requestTemplate(): HTMLTemplateElement;
    abstract get messageFormatContext(): RenderContext;
    abstract get eventSwitchContext(): EventSwitchContext;
    _value!: HTMLTemplateElement;
    get value(){
        return this._value;
    }
    set value(nv){
        this._value = nv;
        this.de('value', {value: nv});
    }
    static get observedAttributes(){
        return super.observedAttributes.concat([endPoint]);
    }
    attributeChangedCallback(){
        throw 'not implemented';
    }

    postMessage(){
        const tmpl = document.createElement('template');
        this.messageFormatContext!.init!(this, this.messageFormatContext, tmpl);
    }

}