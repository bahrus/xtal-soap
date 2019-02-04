import {XtalSoapElement} from '../xtal-soap-element.js';
import {createTemplate} from 'xtal-element/utils.js';
import {addEventListeners} from 'event-switch/event-switch.js';
import {EventSwitchContext} from 'event-switch/event-switch.d.js';
export interface TemperatureValues{
    Fahrenheit: number,
    Celsius: number;
}
const requestTemplate = createTemplate(/* xml */`
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <FahrenheitToCelsius xmlns="https://www.w3schools.com/xml/">
      <Fahrenheit></Fahrenheit>
    </FahrenheitToCelsius>
  </soap:Body>
</soap:Envelope>
`);
const mainTemplate = createTemplate(/* html */`
<input name="Fahrenheight">
<button>Convert</button>
`);
export class TempConverter extends XtalSoapElement<TemperatureValues>{
    _eventSwitchContext  = {
        eventManager: addEventListeners,
        eventRules:{
            'click': e => this.convert();
        }
    } as EventSwitchContext;

    get eventSwitchContext() {
        return this._eventSwitchContext;
    }

    get mainTemplate(){
        return mainTemplate;
    }

    convert(){
        debugger;
    }
}