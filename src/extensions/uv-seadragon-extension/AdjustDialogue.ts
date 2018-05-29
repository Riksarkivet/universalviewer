import {AdjustDialogue as BaseAdjustDialogue} from "../../modules/uv-dialogues-module/AdjustDialogue";

export class AdjustDialogue extends BaseAdjustDialogue {

    constructor($element: JQuery) {
        super($element);
    }

    create() : void {
        this.setConfig('adjustDialogue');

        super.create();
    }

    // open(): void {
    //     super.open();
    // }
}