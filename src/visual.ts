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
import { ToastContainer } from "react-toastify";
let jsonArray;
let keys;
let jsonData;



export class Visual implements IVisual {
    private target: HTMLElement;
    private reactRoot: React.ComponentElement<any, any>;
    private keysN: Array<String> = [];
    private dataN: Array<Object> = [];
    //private serverConf: String = "192.168.68.65:1433;AdventureWorks2019";
    //private reqUrl: String = "https://192.168.68.65:8090/";
    private serverConf: String = "";
    private reqUrl: String = "";
    private visualSettings: VisualSettings;
    private settings: VisualSettings;
    private ext: VisualConstructorOptions;
    private counter = 0;


    constructor(options: VisualConstructorOptions) {
        this.ext = options;
    }

    private call(options) {
        console.log("IDE GAS: " + this.serverConf);
        options.element.style.overflow = 'auto';
        this.reactRoot = React.createElement(Table, { data: this.dataN, header: this.keysN, serverConfig: this.serverConf, requestUrl: this.reqUrl });
        this.target = options.element;
        ReactDOM.render(this.reactRoot, this.target);
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        const settings: VisualSettings = this.visualSettings || <VisualSettings>VisualSettings.getDefault();
        return VisualSettings.enumerateObjectInstances(settings, options);
    }

    public update(options: VisualUpdateOptions) {
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        console.log('Visual update', options);
        this.visualSettings = VisualSettings.parse<VisualSettings>(options.dataViews[0]);

        this.reqUrl = "" + options.dataViews[0].categorical.values[0].values;
        this.serverConf = "" + options.dataViews[0].categorical.values[1].values;

        if(this.counter == 0) {
            this.counter = 1;

            this.call(this.ext);
        }
    }

    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }
}