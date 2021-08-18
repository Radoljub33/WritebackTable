import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import "./../style/visual.less";
export declare class Visual implements IVisual {
    private target;
    private reactRoot;
    private keysN;
    private dataN;
    private serverConf;
    private reqUrl;
    private visualSettings;
    private settings;
    private ext;
    private counter;
    constructor(options: VisualConstructorOptions);
    /**
     * starts the visual after the update method is called once as singleton
     * @param options
     */
    private call;
    enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
    update(options: VisualUpdateOptions): void;
    private static parseSettings;
}
