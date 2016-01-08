import BaseCommands = require("./BaseCommands");
import BaseExpandPanel = require("./BaseExpandPanel");

class LeftPanel extends BaseExpandPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        super.create();

        this.$element.width(this.options.panelCollapsedWidth);

    }

    init(): void{
        super.init();

        if (window.matchMedia && window.matchMedia("(max-width: 768px)").matches) 
            return;

        var panelOpenSaved = Utils.Bools.GetBool(this.provider.getSettings().panelOpenLeftPanel, true);

        if (this.options.panelOpen && panelOpenSaved) {
            this.toggle(true);
        }
    }

    getTargetWidth(): number {
        if (this.isFullyExpanded || !this.isExpanded){
            return this.options.panelExpandedWidth;
        } else {
            return this.options.panelCollapsedWidth;
        }
    }

    getFullTargetWidth(): number{
        return this.$element.parent().width();
    }

    toggleFinish(): void {
        super.toggleFinish();

        if (this.isExpanded){
            $.publish(BaseCommands.OPEN_LEFT_PANEL);
        } else {
            var settings: ISettings = this.provider.getSettings();
            settings.panelOpenLeftPanel = false;
            this.provider.updateSettings(settings);
            $.publish(BaseCommands.CLOSE_LEFT_PANEL);
        }
    }

    resize(): void {
        super.resize();

        if (this.isFullyExpanded){
            this.$element.width(this.$element.parent().width());
        }
    }
}

export = LeftPanel;