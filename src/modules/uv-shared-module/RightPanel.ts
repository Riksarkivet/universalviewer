import BaseCommands = require("./BaseCommands");
import BaseExpandPanel = require("./BaseExpandPanel");

class RightPanel extends BaseExpandPanel {

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

        var panelOpenSaved = Utils.Bools.GetBool(this.provider.getSettings().panelOpenRightPanel, true);

        if (this.options.panelOpen && panelOpenSaved) {
            this.toggle(true);
        }
    }

    getTargetWidth(): number {
        return this.isExpanded ? this.options.panelCollapsedWidth : this.options.panelExpandedWidth;
    }

    getTargetLeft(): number {
        return this.isExpanded ? this.$element.parent().width() - this.options.panelCollapsedWidth : this.$element.parent().width() - this.options.panelExpandedWidth;
    }

    toggleFinish(): void {
        super.toggleFinish();
        var settings: ISettings = this.provider.getSettings();

        if (this.isExpanded) {
            settings.panelOpenRightPanel = true; 
            $.publish(BaseCommands.OPEN_RIGHT_PANEL);
        } else {            
            settings.panelOpenRightPanel = false;            
            $.publish(BaseCommands.CLOSE_RIGHT_PANEL);
        }
        this.provider.updateSettings(settings);
    }

    resize(): void {
        super.resize();

        this.$element.css({
            'left': Math.floor(this.$element.parent().width() - this.$element.outerWidth())
        });
    }
}

export = RightPanel;