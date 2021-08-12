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
      url: props.requestUrl

    };
  }

  lengthHeaders: number = 0;
  cnt: number = 1;

  handleChange(index, dataType, value) {
    const newState = this.state.rows.map((item, i) => {
      if (i == index) {
        return { ...item, [dataType]: value }; //neuer wert
      }
      return item; //alter wert
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

    let arr = this.state.header;

    let arr2 = [value];

    let arr3 = arr.concat(arr2);

    this.setState({
      header: arr3

    })
    console.log(this.state.header);
  }

  cleanState() {
    this.setState({
      header: []

    })

    this.setState({
      rows: []

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
    let objToSort = this.state.header.find(head => head === sortCrit);
    console.log(objToSort);
    let sorter = this.state.sort;

    if (objToSort.sortable) {
      if (sorter.direction == 1 && sorter.Crit == sortCrit) {
        sorter.direction = -1;
      } else {
        sorter.direction = 1;
        sorter.Crit = sortCrit;
      }
      //render
      this.setState({ rows: [...this.state.rows.sort(this.compareKeys(sortCrit, sorter.direction))] });
      this.setState({
        sort: sorter
      });

      console.log(this.state.rows)
    }
  }


  compareKeys(key, direction) {
    if (direction === undefined) {
      direction = 1;
    }
    //if a > b return 1, else return -1 or 0(equal)
    return (a, b) => {
      return (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * direction;
    }
  }


  changeSymbol(key) {
    console.log(key);
    if (key !== "_id" && key !== "username") {
      if (this.state.sort.Crit !== key) {
        return "bi bi-arrow-down-up";
      }
      if (this.state.sort.direction == 1) {
        return "bi bi-arrow-up";
      }
      else {
        return "bi bi-arrow-down";
      }
    }

  }

  addRow() {
    let myObject = {}

    this.state.header.map((element, i) => {
      myObject[element] = "";
    });

    let arr = this.state.rows;

    let arr2 = [myObject];

    let arr3 = arr.concat(arr2);

    this.setState({
      rows: arr3

    })
  }

  saveTable() {
    let body = this.state.rows;
    let value = document.querySelector('input').value

    let credUser = this.state.cred_user;
    let credPwd = this.state.cred_pwd;
    let credentials = credUser + ":" + credPwd;
    let codedAuth = Buffer.from(credentials, 'ascii').toString('base64');

    let match = this.state.serverConfig.split(';');

    fetch(`${this.state.url}table/${value}`, {         //DYNAMIC
      //mode: "no-cors",
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        "Accept": "application/json",
        'content-type': 'application/json',
        "theaders": `${this.state.header}`,
        "authentification": `${codedAuth}`,
        "serverconfig": `${match[0]}&${match[1]}`
      }
    }).then(response => { return response.json(); })
      .then(data => {
        let jsonData = data;
        this.searchTable();
        ToastSuccess("Table saved and synchronized");

      }).catch((e) => {
        ToastError("Error happened while saving! " + e);

        this.setState({
          refresh: <i className="bi bi-arrow-repeat"> RETRY</i>
        })
      })

    return null;
  }

  submitLogin() {

    this.setState({
      cred_user: document.querySelector('input').value
    })
    this.setState({
      cred_pwd: (document.querySelector('#pwd') as HTMLInputElement).value
    })

    let credentials = (document.querySelector('input').value) + ":" + ((document.querySelector('#pwd') as HTMLInputElement).value);

    let codedAuth = Buffer.from(credentials, 'ascii').toString('base64');
    let match = this.state.serverConfig.split(';');

    fetch(`${this.state.url}login`, {         //DYNAMIC
      //mode: "no-cors",
      method: 'GET',
      headers: {
        "Accept": "application/json",
        'content-type': 'application/json',
        "authentification": `${codedAuth}`,
        "serverconfig": `${match[0]}&${match[1]}`
      }
    })
      .then(response => { return response.status })
      .then(data => {
        if (data == 200) {
          this.cnt = 0;
          this.forceUpdate();
          ToastSuccess("Successfully logged in with user: " + this.state.cred_user)
        } else {
          this.cnt = 1;
          this.forceUpdate();
          ToastError("Login failed for user: " + this.state.cred_user + " Username or Password incorrect.");
        }

      }).catch((e) => {
        this.cnt = 1;
        this.forceUpdate();
        ToastError("Login failed for user: " + this.state.cred_user);
      })

  }

  searchTable() {
    this.setState({
      refresh: <i><Spinner animation="border" size="sm" />  LOADING</i>
    })
    this.cleanState();
    let value = document.querySelector('input').value
    let credUser = this.state.cred_user;
    let credPwd = this.state.cred_pwd;
    let msg;
    let credentials = credUser + ":" + credPwd;
    let codedAuth = Buffer.from(credentials, 'ascii').toString('base64');
    let match = this.state.serverConfig.split(';');

    fetch(`https://192.168.68.65:8090/getTable/${value}`, {         //DYNAMIC
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
        })
        this.setState({
          header: keysN
        });

        this.setState({
          refresh: <i className="bi bi-arrow-repeat"> (RE)LOAD</i>
        })
      }).catch((e) => {
        ToastError("AN ERROR HAPPENED WHILE READING! " + e);

        this.setState({
          refresh: <i className="bi bi-arrow-repeat"> RETRY</i>
        })
      })

    return null;
  }

  //Quelle Scroll to top/bottom https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView

  render() {
   
    if (this.cnt == 0) {
      return (
        <div id="table-wrapper">
          <ToastContainer></ToastContainer>
          <p className="p">
            <button className="btn btn-light" onClick={() => { this.saveTable() }}><i className="bi bi-check-circle"> SAVE</i></button><span> </span>
            <button className="btn btn-light" onClick={() => {
              this.addRow()

              //scroll to bottom o
              var element = document.getElementById("table-wrapper");
              element.scrollIntoView(false);

            }}><i className="bi bi-plus-circle"> ROW</i></button><span> </span>
            <button disabled={true} className="btn btn-light" onClick={() => {
              let value = document.querySelector('input').value
              this.handleChangeHeader(1, value.trim());
              this.handleChange(this.lengthHeaders, value.trim(), "");
            }}><i className="bi bi-plus-circle"> COLUMN</i></button><span> </span>

            <button className="btn tbn-sm btn-success" onClick={() => { this.searchTable() }}>{this.state.refresh}</button>
            <span> </span>
            <button className="btn tbn-sm btn-warning" onClick={() => { this.showLogin() }}><i className="bi bi-box-arrow-in-right"></i> SHOW LOGIN</button>
            <span> </span>
            <button className="btn tbn-sm btn-warning" onClick={() => { this.showHelp() }}><i className="bi bi-question-circle"></i> SHOW HELP</button>
            <span> </span>
            <input className="inputField" name="inputSpalte" ></input></p>

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
                      <th>
                        <h5>
                          <span>{this.state.header[index]}</span>
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

              //scroll to top
              var element = document.getElementById("table-wrapper");
              element.scrollIntoView(true);
            }}><i className="bi bi-box-arrow-in-up"> BACK TO TOP</i></button><span> </span>
          </div>
        </div>

      );
    } else if (this.cnt == 1) {
      return (
        <div id="table-wrapper">
          <ToastContainer></ToastContainer>
          <p className="p">
            <span> </span>
            <br></br>
            <br></br>
            <hr></hr>
            <h3>Log in with your SQL-Credentials:</h3>
            <label className="lg">SQL-Username: </label><span> </span><input className="pr" name="un" ></input>
            <br></br>
            <label className="lg">SQL-Password: </label><span>  </span><input className="pr" name="pw" id="pwd" type="password"></input>
            <br></br>
            <br></br>
            <button className="btn tbn-sm btn-success" onClick={() => { this.submitLogin() }}> Submit</button></p>
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
            <button className="btn btn-light"><i className="bi bi-check-circle"> SAVE</i></button><span> </span>
            <label className="lg">SAVES THE TABLE BACKDATABASE</label><br></br><br></br>
            <span></span>
            <button className="btn btn-light"><i className="bi bi-plus-circle"> ROW</i></button><span> </span>
            <label className="lg">ADDS AN EMPTY ROW TO THE BOTTOM OF THE TABLE </label><br></br><br></br>

            <span> </span>
            <button className="btn btn-light"><i className="bi bi-plus-circle"> COLUMN</i></button><span> </span>
            <label className="lg">ADDS A COLUMN TO THE TABLE (WITH THE GIVEN NAME) </label><br></br><br></br>

            <span> </span>
            <button className="btn tbn-sm btn-success">{this.state.refresh}</button><span> </span>
            <label className="lg">REFRESHES / (RE)LOADS THE TABLE </label><br></br><br></br>

            <span> </span>
            <button className="btn tbn-sm btn-warning" ><i className="bi bi-box-arrow-in-right"></i> SHOW LOGIN</button><span> </span>
            <label className="lg">SHOWS THE LOGIN VIEW FOR SQL-USERS </label><br></br><br></br>

            <span> </span>

          </p>
          <br></br>
          <br></br>
          <br></br>

        </div>
      );
    }

  }

  addColumn() {
    let value = document.querySelector('input').value
    console.log(value);
    this.handleChangeHeader(4, value.trim());
    return null;

  }
}
