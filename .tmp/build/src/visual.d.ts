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
    /**
     * default provided method to enumerate Visual-Data
     * @param options EnumerateVisualObjectInstancesOptions
     * @returns enumerated Objects of settings ans options
     */
    enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
    /**
     * default provided method to be called when a update within Microsoft Power BI happens (new Measure, updated values, ...)
     * @param options nested observer-like behaviour
     */
    update(options: VisualUpdateOptions): void;
    /**
     * default provided method to parse a dataView to VisualSettings
     * @param dataView from update(options)
     * @returns parsed VisualSettings
     */
    private static parseSettings;
}
