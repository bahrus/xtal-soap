import { XtalSoapElement } from '../xtal-soap-element.js';
import { createTemplate } from 'xtal-element/utils.js';
import { init } from 'trans-render/init.js';
import { addEventListeners } from 'event-switch/event-switch.js';
const mainTemplate = createTemplate(/* html */ `
<input name="Fahrenheit">
<button>Convert</button>
`);
export class TempConverter extends XtalSoapElement {
    constructor() {
        super(...arguments);
        this._eventSwitchContext = {
            eventManager: addEventListeners,
            eventRules: {
                click: {
                    route: {
                        button: {
                            action: e => this.convert(),
                        }
                    }
                },
            }
        };
        // get requestTemplate(){return requestTemplate;}
        this._renderContext = {
            init: init,
            Transform: {
            //div: x=> this.viewModel
            }
        };
    }
    get messageBuilder() {
        return (t) => /* xml */ `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
    <FahrenheitToCelsius xmlns="https://www.w3schools.com/xml/">
    <Fahrenheit>47</Fahrenheit>
    </FahrenheitToCelsius>
</soap:Body>
</soap:Envelope>
`;
    }
    get eventSwitchContext() {
        return this._eventSwitchContext;
    }
    get ready() { return true; }
    get mainTemplate() { return mainTemplate; }
    get renderContext() {
        return this._renderContext;
    }
    convert() {
        this.postMessage();
    }
}
customElements.define('temp-converter', TempConverter);
