import * as React from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
export declare class Table extends React.Component<{}, any> {
    constructor(props: any);
    lengthHeaders: number;
    cnt: number;
    allTables: Array<string>;
    handleChange(index: any, dataType: any, value: any): void;
    handleChangeHeader(index: any, value: any): void;
    cleanState(): void;
    showLogin(): void;
    showHelp(): void;
    sortBy(sortCrit: any): void;
    compareKeys(key: any, direction: any): (a: any, b: any) => number;
    changeSymbol(key: any): "bi bi-arrow-down-up" | "bi bi-arrow-up" | "bi bi-arrow-down";
    showSort(): void;
    addRow(): void;
    addColumn(): void;
    saveTable(): any;
    clearInputState(): void;
    submitLogin(): void;
    loadTables(auth: any, conf1: any, conf2: any): void;
    backtoStart(): void;
    searchTable(): void;
    render(): JSX.Element;
}
