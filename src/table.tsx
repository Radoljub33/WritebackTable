import { keys } from "d3";
import * as React from "react";
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

    fetch(`https://192.168.68.65:8090/table/HumanResources.Department`, {         //DYNAMIC
            //mode: "no-cors",
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "Accept": "application/json",
                'content-type': 'application/json'
                //"authentification": `sa:simon`,
                //"authentification": `${user}:${pw}`,
                //"serverconfig": `localhost:1433&AdventureWorks2019`
                //"serverconfig": `${ser}&${db}`
            }
        }).then(response => { console.log(response); console.log("ok") });

           // console.log(this.keysN);
           // console.log(this.dataN);

            
      


    //console.log("HEY");
    return null;
  }
  searchTable() {
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
            this.setState ({
              header: keysN
            });})

    return null;
  }

  render() {
    console.clear();
    //console.log(JSON.stringify(this.state.rows));
    return (
      <div >

        <p className="p">
          <button className="button" onClick={() => {this.saveTable()}}>Tabelle speichern</button>
          <button className="button" onClick={() => {
            this.addRow()
          }}>Zeile hinzufügen</button>
          <button className="button" onClick={() => {
            let value = document.querySelector('input').value
            //console.log(value);
            //this.addColumnTiState(value);
            this.handleChangeHeader(1, value.trim());
            this.handleChange(this.lengthHeaders, value.trim(), "");
          }/*this.addColumn*/}>Spalte hinzufügen mit Titel: </button>
          <input className="inputField" name="inputSpalte" ></input>
          <button className="button" onClick={() => {this.searchTable()}}>Tabelle laden</button></p>

        <br></br>
        <br></br>
        <br></br>
        <table className="table table-bordered" >
          <thead>
            <tr>
              {this.state.header.map((row, index) => {
                this.lengthHeaders++;
                return (
                  <th>
                    {this.state.header[index]}

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

