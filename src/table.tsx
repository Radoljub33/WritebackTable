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
    this.state = {
      rows: props.data,
      header: props.header,
      refresh: <i className="bi bi-arrow-repeat"> (RE)LOAD</i>,
      cred_user: '',
      cred_pwd: '',
      serverConfig: props.serverConfig,
      url: props.requestUrl,
      sort: {},
      tables: []
    };
  }

  lengthHeaders: number = 0;
  cnt: number = 1;
  allTables: Array<string> = [];

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

  handleChangeHeader(index, value) {
    const newStateHeader = this.state.header.map((item, i) => {
      if (i == index) {
        return { ...item, value };
      }

      return item;
    });

    let arr_original = this.state.header;
    let arr_value = [value];
    let arr_modified = arr_original.concat(arr_value);

    this.setState({
      header: arr_modified
    })
  }

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

  showLogin() {
    this.forceUpdate();
    if (this.cnt == 0) {
      this.cnt = 1;
    } else {
      this.cnt = 0;
    }
  }

  showHelp() {
    this.forceUpdate();
    if (this.cnt == 0) {
      this.cnt = 2;
    } else {
      this.cnt = 0;
    }
  }

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

  compareKeys(key, direction) {
    if (direction === undefined) {
      direction = 1;
    }

    return (a, b) => {
      return (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * direction;
    }
  }

  changeSymbol(key) {
    let sortObj = this.state.header.find(head => head === key);

    if (this.state.sort.Crit !== sortObj) {
      return "bi bi-arrow-down-up";
    }

    if (this.state.sort.direction == 1) {
      return "bi bi-arrow-up";
    } else {
      return "bi bi-arrow-down";
    }
  }

  showSort() {
    this.forceUpdate();
    this.cnt = 3;
  }

  addRow() {
    let myObject = {}

    this.state.header.map((element, i) => {
      myObject[element] = "";
    });

    let arr_original = this.state.rows;
    let arr_object = [myObject];
    let arr_modified = arr_original.concat(arr_object);

    this.setState({
      rows: arr_modified

    })
  }

  addColumn() {
    let value = document.querySelector('input').value
    console.log(value);
    this.handleChangeHeader(4, value.trim());
  }

  saveTable() {
    let body = this.state.rows;
    let credUser = this.state.cred_user;
    let credPwd = this.state.cred_pwd;
    let credentials = credUser + ":" + credPwd;
    let codedAuth = Buffer.from(credentials, 'ascii').toString('base64');
    let match = this.state.serverConfig.split(';');
    let respMsg = "";
    let tableName = (document.querySelector('#selectTable') as HTMLSelectElement).value;

    fetch(`${this.state.url}table/${tableName}`, {
      method: 'POST',
      body: JSON.stringify(body),
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
            respMsg = (JSON.parse(text)['originalError']['info']['message']);
            ToastError("ERROR: " + JSON.stringify(respMsg).replace('"', '').substring(0, 70) + " ...");
          });
        } else {
          ToastSuccess("Table saved and synchronized");
          this.searchTable();

          return res.json();
        }
      })
      .catch(err => {
        ToastError("Error happened while saving! ");

        this.setState({
          refresh: <i className="bi bi-arrow-repeat"> RETRY</i>
        })
      })

    return null;
  }

  clearInputState() {
    this.setState({
      cred_user: '',
    })

    this.setState({
      cred_pwd: '',
    })
  }

  submitLogin() {
    this.setState({
      cred_user: ''
    })

    this.setState({
      cred_pwd: ''
    })

    let credentials = (document.querySelector('input').value) + ":" + ((document.querySelector('#pwd') as HTMLInputElement).value);
    let codedAuth = Buffer.from(credentials, 'ascii').toString('base64');
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
        if (data.status == 200) {
          this.cnt = 0;
          this.loadTables(codedAuth, match[0], match[1]);
          this.forceUpdate();
          ToastSuccess("Successfully logged in with user: " + this.state.cred_user)
        } else {
          ToastError("Login failed for user: " + this.state.cred_user + " Username or Password incorrect.");
        }
      }).catch((e) => {
        ToastError("Login failed for user: " + this.state.cred_user);
      })
  }

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
          tableValues[i] = (Object.values(jsonTables[i])[0]);
        }

        this.allTables.push(...tableValues);
        this.setState({
          tables: tableValues
        });
      }).catch((err) => {
        console.log(err);
      })
  }

  backtoStart() {
    this.forceUpdate();
    this.cnt = 0;
  }

  searchTable() {
    this.setState({
      refresh: <i><Spinner animation="border" size="sm" />  LOADING</i>
    })

    this.cleanState();

    let tableName = (document.querySelector('#selectTable') as HTMLSelectElement).value;
    let credUser = this.state.cred_user;
    let credPwd = this.state.cred_pwd;
    let credentials = credUser + ":" + credPwd;
    let codedAuth = Buffer.from(credentials, 'ascii').toString('base64');
    let match = this.state.serverConfig.split(';');

    fetch(`https://192.168.68.65:8090/getTable/${tableName}`, {
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
        let arr = jsonData['recordsets'];
        let jsonArray = arr[0];
        let keys = Object.keys(jsonArray[0]);
        let keysN = keys;
        let dataN = jsonArray;

        this.setState({
          rows: dataN
        });

        this.setState({
          header: keysN
        });

        this.setState({
          refresh: <i className="bi bi-arrow-repeat"> (RE)LOAD</i>
        });
      }).catch((e) => {
        ToastError("AN ERROR HAPPENED WHILE READING! " + e);

        this.setState({
          refresh: <i className="bi bi-arrow-repeat"> RETRY</i>
        })
      })
  }

  render() {
    if (this.cnt == 0) {
      return (
        <div id="table-wrapper">
          <ToastContainer></ToastContainer>
          <p className="p">
            <button className="btn btn-success" onClick={() => { this.saveTable() }}>
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
              this.addRow()
              var element = document.getElementById("table-wrapper");
              element.scrollIntoView(false);
            }}>
              <i className="bi bi-plus-circle"> ROW</i>
            </button>
            <span> </span>
            <button disabled={false} className="btn btn-light" onClick={() => {
              let value = document.querySelector('input').value
              this.handleChangeHeader(1, value.trim());
              this.handleChange(this.lengthHeaders, value.trim(), "");
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
              element.scrollIntoView(true);
            }}><i className="bi bi-box-arrow-in-up"> BACK TO TOP</i></button><span> </span>
          </div>
        </div>
      );
    } else if (this.cnt == 1) {
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
    } else {
      return (
        <div id="table-wrapper">
          <ToastContainer></ToastContainer>
          <p className="p">
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
            <button className="btn btn-danger">! IMPORTANT !</button><span> </span>
            <label className="lg"><b>PLEASE NOTE: </b>AVOID MULTIPLE OPERATIONS IF ONE OF THEM SHOULD BE: <b>DELETE</b></label><br></br><br></br>

            <span> </span>
          </p>
          <br></br>
          <br></br>
          <br></br>
        </div>
      );
    }
  }
}