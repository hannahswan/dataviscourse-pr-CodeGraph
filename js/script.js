
// Loads data and initializes views

d3.json('data/codeData.json',function(error,data){

    let funGraph = new FunctionGraph(data);
    let varGraph = new VariableGraph();
    let varTable = new VarTable(varGraph);

    let table = new Table(data, varGraph, varTable);

    table.updateTable();
    funGraph.createGraph();
    funGraph.updateGraph();
});

