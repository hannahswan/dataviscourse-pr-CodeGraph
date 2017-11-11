    /**
     * Loads in the table information from codeData.json 
     */
d3.json('data/codeData.json',function(error,data){
    let tree = new Tree();
    tree.createTree(data);

    let table = new Table(data,tree);

    table.createTable();
    table.updateTable();
});

