import { XtalSoapElement } from '../xtal-soap-element.js';
import { addEventListeners } from 'event-switch/event-switch.js';
export class TempConverter extends XtalSoapElement {
    constructor() {
        super(...arguments);
        this._eventSwitchContext = {
            eventManager: addEventListeners,
            eventRules: {}
        };
    }
    get eventSwitchContext() {
        return this._eventSwitchContext;
    }
}
