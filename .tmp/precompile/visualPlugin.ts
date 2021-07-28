import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api";
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin;
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions;
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];

var writeBackTable47CA2C69671C434A97B7FD3E2BE48BBC_DEBUG: IVisualPlugin = {
    name: 'writeBackTable47CA2C69671C434A97B7FD3E2BE48BBC_DEBUG',
    displayName: 'WriteBackTable',
    class: 'Visual',
    apiVersion: '2.6.0',
    create: (options: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }

        throw 'Visual instance not found';
    },
    custom: true
};

if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["writeBackTable47CA2C69671C434A97B7FD3E2BE48BBC_DEBUG"] = writeBackTable47CA2C69671C434A97B7FD3E2BE48BBC_DEBUG;
}

export default writeBackTable47CA2C69671C434A97B7FD3E2BE48BBC_DEBUG;