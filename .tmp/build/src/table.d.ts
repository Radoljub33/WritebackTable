import * as React from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
export declare class Table extends React.Component<{}, any> {
    constructor(props: any);
    lengthHeaders: number;
    cnt: number;
    allTables: Array<string>;
    /**
     * updates the rows-state after any change of a field
     * supports live-time changes while typing
     * @param index size of current tableheaders
     * @param dataType inserting key
     * @param value inserting value
     */
    handleChange(index: any, dataType: any, value: any): void;
    /**
     * gives the ability to update the tableheaders with a new tableheader
     * @param index place of tableheader
     * @param value name of tableheader (key)
     */
    handleChangeHeader(index: any, value: any): void;
    /**
     * function to clear following states: header, rows, cred_user and cred_pwd
     * is used to reset the data-sets and to secure for instance a logout
     */
    cleanState(): void;
    /**
     * switches the login view to the table view or resets it to the login view
     * is used for login purposes
     */
    showLogin(): void;
    /**
     * switches the table view to the help-guide view or resets it to the table view
     * is used for shwing the help-guide and switching it off
     */
    showHelp(): void;
    /**
     * sorts the table by overgiven sort criteria (column name)
     * changes the sorting of the table due to state update
     * @param sortCrit criteria for sorting
     */
    sortBy(sortCrit: any): void;
    /**
     * algortihm to compare the values concerning the column name and direction
     * @param key sort criteria
     * @param direction index for ascending/descending
     * @returns an anonym function which compares two values
     */
    compareKeys(key: any, direction: any): (a: any, b: any) => number;
    /**
     * uses the selected column to change the sort symbol for it
     * @param key column name
     * @returns sort symbol depending on the current sort state and direction
     */
    changeSymbol(key: any): "bi bi-arrow-down-up" | "bi bi-arrow-up" | "bi bi-arrow-down";
    /**
     * ability to add an empty row into an existing table
     * can be filled with data entered by the user
     */
    addRow(): void;
    /**
     * saves the modified table back to the Microsoft SQL-Server
     * uses the overgiven credentials, configurations and settings to connect to the Microsoft SQL-Server
     * after completing the request if displays a Toast which demonstrates a success-case or an error-case
     */
    saveTable(): void;
    /**
     * clears the username and password state
     * is used to clear user credentials before any ability to login
     */
    clearInputState(): void;
    /**
     * submits the entered login credentials and checks by a plain-login-check if username and password are valid
     * uses the overgiven credentials, configurations and settings to connect to the Microsoft SQL-Server
     * after completing the login request if displays a Toast which demonstrates a success-case or an error-case
     * in a success-case the visual view is changed to the table-view and loadTables() is called
     */
    submitLogin(): void;
    /**
     * ability to show all tables which can be selected and modified in the visual
     * uses the overgiven credentials, configurations and settings to connect to the Microsoft SQL-Server
     * requests the full table-names of all tables which are provided by the Microsoft-SQL-Server-Database
     * fills the dropdown menue with the table-names from the response
     * @param auth encoded sql credentials
     * @param conf1 Microsft SQL-Server-URL
     * @param conf2 Microsft SQL-Server-Databasename
     */
    loadTables(auth: any, conf1: any, conf2: any): void;
    /**
     * requests the selected table, from the Microsoft SQL-Server and displays the data as a table
     * uses the overgiven credentials, configurations and settings to connect to the Microsoft SQL-Server
     * after receiving an response the visual shows a Toast: either an success-case or error-case
     */
    searchTable(): void;
    render(): JSX.Element;
}
