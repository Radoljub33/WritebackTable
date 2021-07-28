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
let jsonArray;
let keys;
let jsonData;


export class Visual implements IVisual {
    private target: HTMLElement;
    private reactRoot: React.ComponentElement<any, any>;
    private keysN: Array<String>;
    private dataN: Array<Object>;

    constructor(options: VisualConstructorOptions) {
        options.element.style.overflow = 'auto';
        fetch(`https://192.168.68.65:8090/`, {         //DYNAMIC
            //mode: "no-cors",
            method: 'GET',
            //body: JSON.stringify(bodyJson),
            headers: {
                "Accept": "application/json",
                'content-type': 'application/json',
                "authentification": `sa:simon`,
                //"authentification": `${user}:${pw}`,
                "serverconfig": `localhost:1433&AdventureWorks2019`
                //"serverconfig": `${ser}&${db}`
            }
        }).then(response => { return response.json(); })
            .then(data => {
                jsonData = data;
                let arr = jsonData['recordsets'];
                jsonArray = arr[0];

                keys = Object.keys(jsonArray[0]);
                this.keysN = keys;
                this.dataN = jsonArray;

               // console.log(this.keysN);
               // console.log(this.dataN);

                this.reactRoot = React.createElement(Table, { data: this.dataN, header: this.keysN });
                this.target = options.element;
                ReactDOM.render(this.reactRoot, this.target);
            });

    }

    public update(options: VisualUpdateOptions) {

    }
}