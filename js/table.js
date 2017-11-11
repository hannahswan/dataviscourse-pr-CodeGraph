/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(data, treeObject) {

        //TODO:: This has to be a graph
        this.tree = treeObject;

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = data.slice();

        ///** Store data */
        this.data = data;

        this.bar = {
            "height": 20
        };
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains
        let svgWidth = 900 / 6;
        let barWidth = 100;
        let padding = 10;

       console.log(this.tableElements);

     
    }


    /**
     * Adds elements to table
     */
    updateTable() {
        let svgWidth = 900 / 6;
        let barWidth = 100;
        let padding = 10;
        let gameScale = this.gameScale;
        let gameColorScale = this.goalColorScale;
        let goalScale = this.goalScale;
        let goalColorScale = this.goalColorScale;
        let treeUpdate = this.tree.updateTree;
        let treeClear = this.tree.clearTree;
        let treeID = this.tree;

        console.log(treeClear);

        //Create table rows
        let matchTable = d3.select("#functionTable").select("tbody");
        matchTable.selectAll(".dataRow").remove();
        let tree = this.tree;
        let rows = matchTable.selectAll(".dataRow")
            .data(this.tableElements);
        let newRows = rows.enter()
            .append("tr")
            .attr("class","dataRow")
            .classed(".dataRow",true)
            .on("click",function (d) {
                tree.updateTree(d);
            });

        ///////////////////////////////////////////////////////////////////////
        //FUNCTION NAMES
        //Append th elements for the function names
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
