import BaseAdjustDialogue = require("../../modules/uv-dialogues-module/AdjustDialogue");

class AdjustDialogue extends BaseAdjustDialogue {

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

export = AdjustDialogue;