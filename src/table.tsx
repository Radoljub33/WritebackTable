import { keys } from "d3";
import * as React from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.css';

export class Table extends React.Component<{}, any> {

  constructor(props) {
    super(props);
    this.state = {
      rows: props.data,
      header: props.header
    };
  }
  lengthHeaders: number = 0;

  config = {
    server: "localhost",
    database: "AdventureWorks2019",
    user: "sa",
    password: "simon",
    port: 1433,
    trustServerCertificate: true
  };

  




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

    //console.log(this.state.rows);

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

  /*addColumnTiState(value) {
    this.setState({
      header: ["zijo", "truba", "yasehu", "nikada"]

    })
  }*/

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
    fetch(`https://192.168.68.65:8090/table/${value}`, {         //DYNAMIC
      //mode: "no-cors",
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        "Accept": "application/json",
        'content-type': 'application/json',
        "theaders": `${this.state.header}`
        //"authentification": `sa:simon`,
        //"authentification": `${user}:${pw}`,
        //"serverconfig": `localhost:1433&AdventureWorks2019`
        //"serverconfig": `${ser}&${db}`
      }
    }).then(response => { console.log("here"); return response.json(); })
      .then(data => {
        let jsonData = data;
        let arr = jsonData['recordsets'];
        let jsonArray = arr[0];

        let keys = Object.keys(jsonArray[0]);
        let keysN = keys;
        let dataN = jsonArray;
        console.log("data: ");
        console.log(dataN);
        console.log(keysN);


        //this.cleanState();

        /*this.setState({
          rows: dataN
        })
        this.setState ({
          header: keysN
        });*/

      })

    // console.log(this.keysN);
    // console.log(this.dataN);





    //console.log("HEY");
    return null;
  }
  searchTable() {
   
    //console.log(this.state.rows);
    this.cleanState();
    let value = document.querySelector('input').value

    fetch(`https://192.168.68.65:8090/getTable/${value}`, {         //DYNAMIC
      //mode: "no-cors",
      method: 'GET',
      headers: {
        "Accept": "application/json",
        'content-type': 'application/json'
        //"authentification": `sa:simon`,
        //"authentification": `${user}:${pw}`,
        //"serverconfig": `localhost:1433&AdventureWorks2019`
        //"serverconfig": `${ser}&${db}`
      }
    })
      .then(response => { return response.json(); })
      .then(data => {
        let jsonData = data;
        let arr = jsonData['recordsets'];
        let jsonArray = arr[0];

        let keys = Object.keys(jsonArray[0]);
        let keysN = keys;
        let dataN = jsonArray;
        console.log("data: ");
        // console.log(dataN);
        // console.log(keysN);

        this.setState({
          rows: dataN
        })
        this.setState({
          header: keysN
        });
      })

    return null;
  }
  

  render() {
    //console.clear();
    //console.log(JSON.stringify(this.state.rows));
    return (

      <div id="table-wrapper">
        

        <p className="p">
          <button className="btn btn-light" onClick={() => { this.saveTable() }}><i className="bi bi-check-circle"> SAVE</i></button><span> </span>
          <button className="btn btn-light" onClick={() => {
            this.addRow()
            //let element = document.getElementById('table-scroll');
            // element.scrollTop = element.scrollHeight
            // document.getElementById('aminSagt').scrollTop =  document.getElementById('aminSagt').scrollHeight;
            var element = document.getElementById("table-wrapper");
            element.scrollIntoView(false);
            // window.scrollTo(0,document.body.scrollHeight);
            //var myDiv = document.getElementById("table-wrapper");
            // myDiv.scrollTop = myDiv.scrollHeight;
          }}><i className="bi bi-plus-circle"> ROW</i></button><span> </span>
          <button className="btn btn-light" onClick={() => {
            let value = document.querySelector('input').value

            //var div = document.getElementById("st");
            //div.scrollTop = div.scrollHeight;
            //console.log(value);
            //this.addColumnTiState(value);
            this.handleChangeHeader(1, value.trim());
            this.handleChange(this.lengthHeaders, value.trim(), "");
          }/*this.addColumn*/}><i className="bi bi-plus-circle"> COLUMN</i></button><span> </span>
          <button className="btn tbn-sm btn-success" onClick={() => { this.searchTable() }}><i className="bi bi-arrow-repeat"> (RE)LOAD</i></button><span> </span>
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
                      {this.state.header[index]}
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
                      //console.log("row-headers: " + value);
                      let valuer = this.state.rows[index][value.trim()];
                      //console.log("row value: " + valuer);
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
            // this.addRow()
            //let element = document.getElementById('table-scroll');
            // element.scrollTop = element.scrollHeight
            // document.getElementById('aminSagt').scrollTop =  document.getElementById('aminSagt').scrollHeight;
            var element = document.getElementById("table-wrapper");
            element.scrollIntoView(true);
            // window.scrollTo(0,document.body.scrollHeight);
            //var myDiv = document.getElementById("table-wrapper");
            // myDiv.scrollTop = myDiv.scrollHeight;
          }}><i className="bi bi-box-arrow-in-up"> BACK TO TOP</i></button><span> </span>
        </div>
      </div>

    );

  }



  addColumn() {
    let value = document.querySelector('input').value
    console.log(value);
    //console.log("LOOOL" + this.lengthHeaders);

    this.handleChangeHeader(4, value.trim());
    return null;

  }


}

