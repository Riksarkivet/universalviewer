import BaseCommands = require("../uv-shared-module/BaseCommands");
import BootstrapParams = require("../../BootstrapParams");
import Commands = require("../uv-shared-module/BaseCommands");
import Dialogue = require("../uv-shared-module/Dialogue");
import Shell = require("../uv-shared-module/Shell");
import Version = require("../../_Version");

class AdjustDialogue extends Dialogue {

    $title: JQuery;
    $contrast: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('adjustDialogue');

        super.create();

        this.openCommand = BaseCommands.SHOW_ADJUST_DIALOGUE;
        this.closeCommand = BaseCommands.HIDE_ADJUST_DIALOGUE;

        $.subscribe(this.openCommand, (e, params) => {
            this.open();
        });

        $.subscribe(this.closeCommand, (e) => {
            this.close();
        });

         this.$title = $('<h1></h1>');
         this.$content.append(this.$title);
         
         this.$contrast = $('<div class="contrast"></div>');
         this.$content.append(this.$contrast);

        // initialise ui.
        this.$title.text(this.content.title);

        this.$element.hide();
    }
    
    adjustContrast(value: number) {
        $.publish(BaseCommands.ADJUST_CONTRAST, [value]);
    }

    open(): void {
        super.open();
    }

    resize(): void {
        super.resize();
    }
}

export = AdjustDialogue;