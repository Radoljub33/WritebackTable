import * as React from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
export declare class Table extends React.Component<{}, any> {
    constructor(props: any);
    lengthHeaders: number;
    cnt: number;
    config: {
        server: string;
        database: string;
        user: string;
        password: string;
        port: number;
        trustServerCertificate: boolean;
    };
    handleChange(index: any, dataType: any, value: any): void;
    handleChangeHeader(index: any, value: any): void;
    cleanState(): void;
    addRow(): void;
    saveTable(): any;
    searchTable(): any;
    render(): JSX.Element;
    addColumn(): any;
}
