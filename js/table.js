/** table to list of functions */
class Table {
    
    constructor(data, varGraphObject, varTable) {

        this.varGraph = varGraphObject;

        this.tableElements = data.slice();

        this.varTable = varTable;

        this.codeData = data;
    }
    
    updateTable() {
        /*let svgWidth = 900 / 6;
        let barWidth = 100;
        let padding = 10;*/
        let graphUpdate = this.varGraph.updateGraph;
        let graphClear = this.varGraph.clearGraph;
        let graphID = this.varGraph;
        let varTable = this.varTable;

        let functionTable = d3.select("#functionTable").select("tbody");
        functionTable.selectAll(".dataRow").remove();
        let varGraph = this.varGraph;
        let rows = functionTable.selectAll(".dataRow")
            .data(this.tableElements);
        let newRows = rows.enter()
            .append("tr")
            .attr("class","dataRow")
            .classed(".dataRow",true)
            .on("click",function (d) {
                varTable.updateTable(d.value.variables)
                varGraph.updateGraph(d);
            });


        let th = newRows.selectAll("tr").data(function (d) {
            let data = {
                "type": "text",
                "value": d.key
            }
            return [data];
        })
        th.enter().append("th")
            .text(function (d) { return d.value; });

    };

}
