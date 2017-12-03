/** Class implementing the variable list as a table. */
class VarTable {

    constructor(graphObject) {

        //Maintain reference to the graph Object;
        this.graph = graphObject;

    }

    //Updates list of variables based on function
    updateTable(functionData) {
        let svgWidth = 900 / 6;
        let barWidth = 100;
        let padding = 10;

        //Create table rows
        let varTable = d3.select("#variableTable").select("tbody");
        varTable.selectAll(".dataRow").remove();
        let graph = this.graph;
        let rows = varTable.selectAll(".dataRow")
            .data(functionData);
        let newRows = rows.enter()
            .append("tr")
            .attr("class","dataRow")
            .classed(".dataRow",true)
            .on("click",function (d) {
                graph.highlight(d);
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
