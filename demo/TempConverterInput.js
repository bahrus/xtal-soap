import { XtalSoapElement } from "../xtal-soap-element.js";
import { createTemplate, newRenderContext } from "xtal-element/utils.js";
import { update } from "trans-render/update.js";
import { newEventContext } from "event-switch/event-switch.js";
const mainTemplate = createTemplate(/* html */ `
<input name="Fahrenheit">
<button>Convert</button>
`);
export class TempConverter extends XtalSoapElement {
    constructor() {
        super(...arguments);
        this._eventContext = newEventContext({
            click: {
                route: {
                    button: {
                        action: e => this.postMessage()
                    }
                }
            }
        });
        this._renderContext = newRenderContext({});
    }
    get eventContext() {
        return this._eventContext;
    }
    //endregion
    get messageBuilder() {
        return (t) => 
        /* xml */ `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
    <FahrenheitToCelsius xmlns="https://www.w3schools.com/xml/">
    <Fahrenheit>${this.root.querySelector("input").value}</Fahrenheit>
    </FahrenheitToCelsius>
</soap:Body>
</soap:Envelope>
`;
    }
    get ready() {
        return true;
    }
    get update() {
        return update;
    }
    get mainTemplate() {
        return mainTemplate;
    }
    get renderContext() {
        return this._renderContext;
    }
}
customElements.define("temp-converter-input", TempConverter);
