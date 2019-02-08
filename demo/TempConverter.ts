import { XtalSoapElement } from "../xtal-soap-element.js";
import { createTemplate } from "xtal-element/utils.js";
import { init } from "trans-render/init.js";
import { update } from "trans-render/update.js";
import { RenderContext } from "trans-render/init.d.js";
import { newEventContext } from "event-switch/event-switch.js";

const mainTemplate = createTemplate(/* html */ `
<input name="Fahrenheit">
<button>Convert</button>
<div role="answer"></div>
`);
export class TempConverter extends XtalSoapElement {
  //region

  _eventContext = newEventContext({
    click: {
      route: {
        button: {
          action: e => this.postMessage()
        }
      }
    }
  }) 
  get eventContext() {
    return this._eventContext;
  }
  //endregion
  get messageBuilder() {
    return (t: this) => 
/* xml */ `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
    <FahrenheitToCelsius xmlns="https://www.w3schools.com/xml/">
    <Fahrenheit>${this.root.querySelector("input")!.value}</Fahrenheit>
    </FahrenheitToCelsius>
</soap:Body>
</soap:Envelope>
`;
  }

  get responseBuilder() {
    return (t: this) => /* html */ `
            Celsius: ${
              t._value.querySelector("FahrenheitToCelsiusResult")!.textContent
            }
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

  _renderContext = {
    init: init,
    Transform: {
      '[role="answer"]': x => this._response
    }
  } as RenderContext;
  get renderContext() {
    return this._renderContext;
  }
}
customElements.define("temp-converter", TempConverter);
