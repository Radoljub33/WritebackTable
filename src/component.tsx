import * as React from "react";

export class ReactCircleCard extends React.Component<{}>{
    render() {
        return (
            <div className="circleCard">
                <table>
                    <tr>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Age</th>
                    </tr>
                    <tr>
                        <td>Jill</td>
                        <td>Smith</td>
                        <td>50</td>
                    </tr>
                    <tr>
                        <td>Eve</td>
                        <td>Jackson</td>
                        <td>94</td>
                    </tr>
                </table>

                <table>
                    <tr>
                        <th>Element</th>
                        <th>Value</th>
                    </tr>
                    
                </table>
                <img src="https://www.controlling-strategy.com/assets/images/c/logo-3c05d039.png" alt="Girl in a jacket" width="500" height="600"></img>
               
            </div>
            

        )
    }
}

export default ReactCircleCard;