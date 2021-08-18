"use strict";
import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Table } from "./table";
import { VisualSettings } from "./settings";
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import "./../style/visual.less";

export class Visual implements IVisual {
    private target: HTMLElement;
    private reactRoot: React.ComponentElement<any, any>;
    private keysN: Array<String> = [];      
    private dataN: Array<Object> = [];

    private serverConf: String = "";            //server-config which is read out of measure[1]
    private reqUrl: String = "";                //server-url which is read out of measure[0]
    private visualSettings: VisualSettings;
    private settings: VisualSettings;
    private ext: VisualConstructorOptions;      //caching the ConstructorOptions 
    private counter = 0;                        //checkCounter for singleton

    constructor(options: VisualConstructorOptions) {
        this.ext = options;
    }

    /**
     * starts the visual after the update method is called once as singleton
     * @param options 
     */
    private call(options) {
        options.element.style.overflow = 'auto';       //ability to scroll inside the visual
        this.reactRoot = React.createElement(Table, { data: this.dataN, header: this.keysN, serverConfig: this.serverConf, requestUrl: this.reqUrl });      //creates an element of type Table with overgiven parameter
        this.target = options.element;
        ReactDOM.render(this.reactRoot, this.target);       //React Render-Ability of the ReactDOM
    }

    /**
     * default provided method to enumerate Visual-Data
     * @param options EnumerateVisualObjectInstancesOptions
     * @returns enumerated Objects of settings ans options
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        const settings: VisualSettings = this.visualSettings || <VisualSettings>VisualSettings.getDefault();
        return VisualSettings.enumerateObjectInstances(settings, options);
    }

    /**
     * default provided method to be called when a update within Microsoft Power BI happens (new Measure, updated values, ...)
     * @param options nested observer-like behaviour
     */
    public update(options: VisualUpdateOptions) {
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        console.log('Visual update', options);
        this.visualSettings = VisualSettings.parse<VisualSettings>(options.dataViews[0]);

        this.reqUrl = "" + options.dataViews[0].categorical.values[0].values;           //reading server-url from measure-placeholder
        this.serverConf = "" + options.dataViews[0].categorical.values[1].values;       //reading server-config from measure-placeholder

        if(this.counter == 0) {     //single call while runtime
            this.counter = 1;
            this.call(this.ext);    //calling constructing options after reqUrl and serverConfig are provided
        }
    }

    /**
     * default provided method to parse a dataView to VisualSettings
     * @param dataView from update(options)
     * @returns parsed VisualSettings
     */
    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }
}