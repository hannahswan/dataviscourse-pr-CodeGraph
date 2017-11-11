/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {

    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(functionName) {

    };


    updateTree(functionName) {
        // ******* TODO: PART VII *******

        var tree = d3.tree().size([800, 300]);

        console.log(functionName.value.variables);


    
    }

    
    clearTree() {

    }

    diagonal(s, d) {
        let path = "M " + s.y + " " + s.x ;
        path = path + " C " + (s.y + d.y) / 2 + " " + s.x;
        path = path + ", " + (s.y + d.y) / 2 + " " + d.x + ", " + d.y + " " + d.x;
        return path;
    };
}
