"use strict";
import powerbi from "powerbi-visuals-api";

import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Table } from "./table";
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
    private serverConf: String = "192.168.68.65:1433;AdventureWorks2019";
    private reqUrl: String = "https://192.168.68.65:8090/";

    constructor(options: VisualConstructorOptions) {
        options.element.style.overflow = 'auto';
        this.reactRoot = React.createElement(Table, { data: this.dataN, header: this.keysN, serverConfig: this.serverConf, requestUrl: this.reqUrl });
        this.target = options.element;
        ReactDOM.render(this.reactRoot, this.target);
    }

    public update(options: VisualUpdateOptions) {

    }
}