import * as React from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Spinner } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastError, ToastSuccess } from './Toast';
//required for Buffer: npm i --save-dev @types/node + tsconfig compile type node

export class Table extends React.Component<{}, any> {

  constructor(props) {
    super(props);
    this.state = {                                               //react states for:
      rows: props.data,                                             //table-rows
      header: props.header,                                         //table-headers
      refresh: <i className="bi bi-arrow-repeat"> (RE)LOAD</i>,     //button content
      cred_user: '',                                                //username
      cred_pwd: '',                                                 //password
      serverConfig: props.serverConfig,                             //server configuration
      url: props.requestUrl,                                        //server url
      sort: {},                                                     //current sort
      tables: []                                                    //all tablenames state                                           
    };
  }

  lengthHeaders: number = 0;                                        //amount of table headers
  cnt: number = 1;                                                  //index for selected matching visual view
  allTables: Array<string> = [];                                    //storage for all tablenames 

  /**
   * updates the rows-state after any change of a field
   * supports live-time changes while typing
   * @param index size of current tableheaders
   * @param dataType inserting key
   * @param value inserting value
   */
  handleChange(index, dataType, value) {
    const newState = this.state.rows.map((item, i) => {
      if (i == index) {
        return { ...item, [dataType]: value };
      }

      return item;
    });

    this.setState({
      rows: newState
    });
    
  }

  /**
   * gives the ability to update the tableheaders with a new tableheader
   * @param index place of tableheader
   * @param value name of tableheader (key)
   */
  handleChangeHeader(index, value) {
    const newStateHeader = this.state.header.map((item, i) => {
      if (i == index) {
        return { ...item, value };
      }

      return item;
    });

    let arr_original = this.state.header;                 //origin headers
    let arr_value = [value];                              //new header
    let arr_modified = arr_original.concat(arr_value);    //modified headers
    
    this.setState({
      header: arr_modified
    })
   
  }

  /**
   * function to clear following states: header, rows, cred_user and cred_pwd
   * is used to reset the data-sets and to secure for instance a logout
   */
  cleanState() {
    this.setState({
      header: []
    })

    this.setState({
      rows: []
    })

    this.setState({
      cred_user: '',
    })

    this.setState({
      cred_pwd: '',
    })
  }

  /**
   * switches the login view to the table view or resets it to the login view
   * is used for login purposes
   */
  showLogin() {
    this.forceUpdate();
    if (this.cnt == 0) {
      this.cnt = 1;
    } else {
      this.cnt = 0;
    }
  }

  /**
   * switches the table view to the help-guide view or resets it to the table view
   * is used for shwing the help-guide and switching it off
   */
  showHelp() {
    this.forceUpdate();
    if (this.cnt == 0) {
      this.cnt = 2;
    } else {
      this.cnt = 0;
    }
  }

  /**
   * sorts the table by overgiven sort criteria (column name)
   * changes the sorting of the table due to state update
   * @param sortCrit criteria for sorting
   */
  sortBy(sortCrit) {
    let sorter = this.state.sort;

    if (sorter.direction == 1 && sorter.Crit == sortCrit) {
      sorter.direction = -1;
    } else {
      sorter.direction = 1;
      sorter.Crit = sortCrit;
    }

    this.setState({
      rows: [...this.state.rows.sort(this.compareKeys(sortCrit, sorter.direction))]
    });

    this.setState({
      sort: sorter
    });
  }

  /**
   * algortihm to compare the values concerning the column name and direction
   * @param key sort criteria
   * @param direction index for ascending/descending
   * @returns an anonym function which compares two values
   */
  compareKeys(key, direction) {
    if (direction === undefined) {
      direction = 1;
    }

    return (a, b) => {
      return (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * direction;  //compares two values and returns the size-index
    }
  }

  /**
   * uses the selected column to change the sort symbol for it
   * @param key column name
   * @returns sort symbol depending on the current sort state and direction
   */
  changeSymbol(key) {
    let sortObj = this.state.header.find(head => head === key);  //stores the header-object which contains the key

    if (this.state.sort.Crit !== sortObj) {
      return "bi bi-arrow-down-up";
    }

    if (this.state.sort.direction == 1) {
      return "bi bi-arrow-up";
    } else {
      return "bi bi-arrow-down";
    }
  }

  /**
   * ability to add an empty row into an existing table
   * can be filled with data entered by the user
   */
  addRow() {
    let myObject = {}

    this.state.header.map((element, i) => {
      myObject[element] = "";
    });

    let arr_original = this.state.rows;                     //origin rows
    let arr_object = [myObject];                            //new row
    let arr_modified = arr_original.concat(arr_object);     //modifed rows

    this.setState({
      rows: arr_modified

    })
  }

  /**
   * saves the modified table back to the Microsoft SQL-Server
   * uses the overgiven credentials, configurations and settings to connect to the Microsoft SQL-Server
   * after completing the request if displays a Toast which demonstrates a success-case or an error-case
   */
  saveTable() {
    let body = this.state.rows;
    let credUser = this.state.cred_user;
    console.log(this.state.header);
    let credPwd = this.state.cred_pwd;
    let credentials = credUser + ":" + credPwd;
    let codedAuth = Buffer.from(credentials, 'ascii').toString('base64');   //encode
    let match = this.state.serverConfig.split(';');
    let respMsg = "";
    let tableName = (document.querySelector('#selectTable') as HTMLSelectElement).value;   //get selected tablename from dropdown
    let reqObject = {
      "respon": [Buffer.from(JSON.stringify(body), 'ascii').toString('base64')]     //hashed table stored in response object
    }

    fetch(`${this.state.url}table/${tableName}`, {
      method: 'POST',
      body: JSON.stringify(reqObject),
      headers: {
        "Accept": "application/json",
        'content-type': 'application/json',
        "theaders": `${this.state.header}`,
        "authentification": `${codedAuth}`,
        "serverconfig": `${match[0]}&${match[1]}`
      }
    })
      .then(res => {
        if (!res.ok) {
          res.text().then(text => {
            respMsg = (JSON.parse(text)['originalError']['info']['message']);   //get the error message from error-object
            ToastError("ERROR: " + JSON.stringify(respMsg).replace('"', '').substring(0, 70) + " ...");
          });
        } else {
          ToastSuccess("Table saved and synchronized");
          this.searchTable();     //requesting and reloading table from Microsoft-SQL-Server

          return res.json();
        }
      })
      .catch(err => {
        ToastError("Error happened while saving! ");

        this.setState({
          refresh: <i className="bi bi-arrow-repeat"> RETRY</i>
        })
      })
  }

  /**
   * clears the username and password state 
   * is used to clear user credentials before any ability to login
   */
  clearInputState() {
    this.setState({
      cred_user: '',
    })

    this.setState({
      cred_pwd: '',
    })
  }

  /**
   * submits the entered login credentials and checks by a plain-login-check if username and password are valid
   * uses the overgiven credentials, configurations and settings to connect to the Microsoft SQL-Server
   * after completing the login request if displays a Toast which demonstrates a success-case or an error-case 
   * in a success-case the visual view is changed to the table-view and loadTables() is called
   */
  submitLogin() {
    this.setState({
      cred_user: ''
    })

    this.setState({
      cred_pwd: ''
    })

    let credentials = (document.querySelector('input').value) + ":" + ((document.querySelector('#pwd') as HTMLInputElement).value);     //reads and combines username and password from the input-fields
    let codedAuth = Buffer.from(credentials, 'ascii').toString('base64');   //decode
    let match = this.state.serverConfig.split(';');

    fetch(`${this.state.url}login`, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        'content-type': 'application/json',
        "authentification": `${codedAuth}`,
        "serverconfig": `${match[0]}&${match[1]}`
      }
    })
      .then(response => { return response })
      .then(data => {
        if (data.status == 200) {   //login success
          this.cnt = 0;   //change view mode
          this.loadTables(codedAuth, match[0], match[1]);   //request and show all full tablenames in the dropdown
          this.forceUpdate();
          ToastSuccess("Successfully logged in with user: " + this.state.cred_user)
        } else {
          ToastError("Login failed for user: " + this.state.cred_user + " Username or Password incorrect.");
        }
      }).catch((e) => {
        ToastError("Login failed for user: " + this.state.cred_user);
      })
  }

  /**
   * ability to show all tables which can be selected and modified in the visual
   * uses the overgiven credentials, configurations and settings to connect to the Microsoft SQL-Server
   * requests the full table-names of all tables which are provided by the Microsoft-SQL-Server-Database
   * fills the dropdown menue with the table-names from the response
   * @param auth encoded sql credentials
   * @param conf1 Microsft SQL-Server-URL
   * @param conf2 Microsft SQL-Server-Databasename
   */
  loadTables(auth, conf1, conf2) {
    fetch(`${this.state.url}dropTables`, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        'content-type': 'application/json',
        "authentification": `${auth}`,
        "serverconfig": `${conf1}&${conf2}`
      }
    })
      .then(response => { return response.json() })
      .then(data => {
        let jsonTables = data;
        let tableValues = [];

        for (let i = 0; i < jsonTables.length; i++) {
          tableValues[i] = (Object.values(jsonTables[i])[0]);   //parses the data-values from the response
        }

        this.allTables.push(...tableValues);
        this.setState({
          tables: tableValues     //fills state to fill dropdown
        });
      }).catch((err) => {
        console.log(err);
      })
  }

  /**
   * requests the selected table, from the Microsoft SQL-Server and displays the data as a table
   * uses the overgiven credentials, configurations and settings to connect to the Microsoft SQL-Server
   * after receiving an response the visual shows a Toast: either an success-case or error-case
   */
  searchTable() {
    this.setState({
      refresh: <i><Spinner animation="border" size="sm" />  LOADING</i>
    })

    this.cleanState();    //clean the provided states

    let tableName = (document.querySelector('#selectTable') as HTMLSelectElement).value;    //uses the current selected full tablename from the dropdown
    let credUser = this.state.cred_user;
    let credPwd = this.state.cred_pwd;
    let credentials = credUser + ":" + credPwd;
    let codedAuth = Buffer.from(credentials, 'ascii').toString('base64');
    let match = this.state.serverConfig.split(';');

    fetch(`${this.state.url}getTable/${tableName}`, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        'content-type': 'application/json',
        "authentification": `${codedAuth}`,
        "serverconfig": `${match[0]}&${match[1]}`
      }
    })
      .then(response => { return response.json() })
      .then(data => {
        let jsonData = data;
        let arr = JSON.parse(Buffer.from(jsonData['respon'][0], 'base64').toString('ascii'))["recordsets"];
        let jsonArray = arr[0];
        let keys = Object.keys(jsonArray[0]);
        let keysN = keys;
        let dataN = jsonArray;

        this.setState({
          rows: dataN   //fill state with json-Array from response
        });

        this.setState({
          header: keysN //fill state with the tableheaders from response
        });

        this.setState({
          refresh: <i className="bi bi-arrow-repeat"> (RE)LOAD</i>
        });
      })
      .catch((e) => {
        ToastError("AN ERROR HAPPENED WHILE READING! " + e);

        this.setState({
          refresh: <i className="bi bi-arrow-repeat"> RETRY</i>
        })
      })
  }

  render() {
    if (this.cnt == 0) {  //table view
      return (
        <div id="table-wrapper">
          <ToastContainer></ToastContainer>
          <p className="p">
            <button className="btn btn-success" id="saveTable" onClick={() => { this.saveTable() }}>
              <i className="bi bi-check-circle"> SAVE</i>
            </button>
            <span> </span>
            <button className="btn tbn-sm btn-secondary" onClick={() => { this.searchTable() }}>{this.state.refresh}</button>
            <span> </span>
            <select id="selectTable" className="form-select" aria-label="Default select example">
              {this.allTables.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <span> </span>
            <span> </span>
            <button className="btn tbn-sm btn-warning" id="questMark" onClick={() => { this.showHelp() }}><i className="bi bi-question-circle"></i></button>
            <span> </span>
            <span> </span>
            <button className="btn btn-light" onClick={() => {
              this.addRow();
              var element = document.getElementById("table-wrapper");
              element.scrollIntoView(false);    //scroll to table-botton
            }}>
              <i className="bi bi-plus-circle"> ROW</i>
            </button>
            <span> </span>
            <button disabled={false} className="btn btn-light" onClick={() => {
              let value = document.querySelector('input').value
              this.handleChangeHeader(1, value.trim());
              this.handleChange(this.lengthHeaders, value.trim(), "");
              setTimeout(() => {this.saveTable();}, 100);
            }}>
              <i className="bi bi-plus-circle"> COLUMN</i>
            </button>
            <span> </span>
            <input className="inputField" name="inputSpalte" id="inputSpalte" placeholder="column name"></input>
          </p>
          <button ></button>
          <span></span>
          <br></br>
          <br></br>
          <br></br>
          <div className="table-responsive">
            <table id="table-scroll" className="table table-hover table-striped table-sm table-bordered">
              <thead>
                <tr>
                  {this.state.header.map((row, index) => {
                    this.lengthHeaders++;
                    return (
                      <th key={this.state.header[index]} scope="col" onClick={() => { this.sortBy(this.state.header[index]) }}>
                        <h5>
                          <span className='sortable-column-label'>{this.state.header[index]}</span>
                          <span> </span>
                          <span className='sortable-column-symbol'>
                            <i className={this.changeSymbol(this.state.header[index])}></i>
                          </span>
                        </h5>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {this.state.rows.map((row, index) => {
                  return (
                    <tr>
                      {this.state.header.map((rowr, indexr) => {
                        let value = this.state.header[indexr];
                        return (
                          <td>
                            <input onChange={(e) => this.handleChange(index, value.trim(), e.target.value)}
                              className='form-control'
                              value={this.state.rows[index][value.trim()]} />
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <button className="btn btn-light" onClick={() => {
              //Quelle: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
              var element = document.getElementById("table-wrapper");
              element.scrollIntoView(true); //scroll to table top
            }}>
              <i className="bi bi-box-arrow-in-up"> BACK TO TOP</i></button><span> </span>
          </div>
        </div>
      );
    } else if (this.cnt == 1) { //login view
      return (
        <div id="table-wrapper">
          {this.clearInputState}
          <ToastContainer></ToastContainer>
          <p className="p">
            <span> </span>
            <br></br>
            <br></br>
            <hr></hr>
            <h3>Log in with your SQL-Credentials:</h3>
            <label className="lg">SQL-Username: </label><span> </span><input className="pr" name="un" ></input>
            <br></br>
            <br></br>
            <label className="lg">SQL-Password: </label><span>  </span><input className="pr" name="pw" id="pwd" type="password"></input>
            <br></br>
            <br></br>
            <button className="btn tbn-sm btn-success" onClick={() => { this.submitLogin() }}> LOGIN</button></p>
          <br></br>
          <br></br>
          <br></br>
        </div>
      );
    } else { //help guide view
      return (
        <div className="scrolldiv">
          <ToastContainer></ToastContainer>
          
            <button className="btn tbn-sm btn-warning" onClick={() => { this.showLogin() }}><i className="bi bi-arrow-return-left"> BACK TO TABLE</i></button>
            <span> </span>
            <br></br>
            <br></br>
            <hr></hr>
            <h3>HELP:</h3>
            <br></br>
            <button className="btn tbn-sm btn-success"><i className="bi bi-check-circle"> SAVE</i></button><span> </span>
            <label className="lg">SAVES THE TABLE BACKDATABASE</label><br></br><br></br>
            <span></span>
            <button className="btn btn-light"><i className="bi bi-plus-circle"> ROW</i></button><span> </span>
            <label className="lg">ADDS AN EMPTY ROW TO THE BOTTOM OF THE TABLE </label><br></br><br></br>

            <span> </span>
            <button className="btn btn-light"><i className="bi bi-plus-circle"> COLUMN</i></button><span> </span>
            <label className="lg">ADDS A COLUMN TO THE TABLE (WITH THE GIVEN NAME) </label><br></br><br></br>

            <span> </span>
            <button className="btn btn-secondary">{this.state.refresh}</button><span> </span>
            <label className="lg">REFRESHES / (RE)LOADS THE TABLE </label><br></br><br></br>

            <span> </span>
            <hr></hr>
            <button className="btn btn-danger">IMPORTANT</button><span> </span>
            <label className="lg"><b>PLEASE NOTE: </b>AVOID MULTIPLE OPERATIONS IF ONE OF THEM SHOULD BE: <b>DELETE</b></label><br></br><br></br>

            <span> </span>
        
          <br></br>
          <br></br>
          <br></br>
        </div>
      );
    }
  }
}