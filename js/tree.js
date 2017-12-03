/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        this.nodes = [];
        this.links = [];
        this.treeSVG = d3.select("#tree");
        this.positions = [-1]; //stores number of positions for each level
        this.numLevels = 0;
        this.isSim = false;
        this.width = 900;
        this.height = 900;
        this.simulation = 0;
    }

    createTree() { }

    drawTree() {
        let nodeSize = 25;

        //links
        let nodeList = this.nodes;
        let linkList = this.links;
        let diagonal = this.diagonal;

        var linksG = this.treeSVG.append("g")
            .attr("id", "linksG");

        if(!this.isSim) {
            linksG.selectAll('path.link')
                .data(this.links)
                .enter()
                .append("path")
                .attr("class", "link")
                .attr("stroke-width", 2)
                .attr('d', function (d) {
                    let nd = {x: nodeList[d[0]].y, y: nodeList[d[0]].x};
                    let prt = {x: nodeList[d[1]].y, y: nodeList[d[1]].x};
                    return diagonal(nd, prt);
                });
        } else {
            console.log("I'm in here. ", this.links);
            var theLinks = linksG.selectAll('line.link')
                .data(this.links)
                .enter()
                .append("line")
                .attr("class", "link")
                .attr("stroke-width", 2);
        }

        //nodes
        var nodeG = this.treeSVG.append("g")
            .attr("id", "nodesG");
        let nodes = nodeG.selectAll("circle")
            .data(this.nodes)
            .enter()
            .append("circle")
            .attr("r", nodeSize)
            .attr("cx", function (d) {
                //return d.level * 50 + 50;
                return d.x;
            })
            .attr("cy", function (d) {
                //return d.position * 50 + 50;
                return d.y;
            })
            //.attr("class", "node")
            .classed('node', true);

        //labels
        var labelsG = this.treeSVG.append("g")
            .attr("id", "labelsG");
        let labels = labelsG.selectAll("text")
            .data(this.nodes)
            .enter()
            .append('text')
            .attr("dy", ".35em")
            .attr("x", function(d) {
                return d.x;
                //return d.children || d._children ? d.y + padding - 8 : d.y + padding + 10;
            })
            .attr("y", function (d) {
                return d.y;
            })
            .attr("text-anchor", "middle")
            .text(function(d) { return d.name; })
            .style("fill", "black");

        console.log(theLinks);

        if(this.isSim) {
            this.simulation.nodes(nodeList);
            // The tension force (the forceLink that we named "link" above) also needs to know
            // about the link data that we finally have - we couldn't give it earlier, because it
            // hadn't been loaded yet!

            //console.log(links);

            this.simulation.force("link")
                .links(linkList);

            // Finally, let's tell the simulation how to update the graphics
            this.simulation.on("tick", function () {
                // Every "tick" of the simulation will create / update each node's coordinates;
                // we need to use those coordinates to move the lines and circles into place
                theLinks
                    .attr("x1", function (d) {
                        //console.log(d);
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

                nodes
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    });

                labels
                    .attr("x", function(d) {
                        return d.x;
                    })
                    .attr("y", function (d) {
                        return d.y;
                    })
            });
        }

    }

    updateTree(functionData/*, treeID*/) {
        this.clearTree();
        this.buildTree(functionData);
        this.drawTree();
    }


    clearTree() {
        console.log("Attempting to clear the tree, ",this.isSim);
        this.isSim = false;
        this.simulation = 0;
        this.treeSVG.select("#nodesG").remove();
        this.treeSVG.select("#linksG").remove();
        this.treeSVG.select("#labelsG").remove();
        this.numLevels = 0;
        this.positions = [-1];
        this.nodes = [];
        this.links = [];
        console.log(this.simulation);
    }

    buildTree(array) {
        //console.log(array);
        let retVal = array.value.returnVariable;

        //if there a return var - organize by return var
        if (retVal !== "0") {
            let index = this.getIndexOf(array.value.variables, retVal);
            let parentArray = array.value.variables[index].value.parentVars;
            this.nodes.push(new Node(retVal,parentArray));
            let child = 0;
            let currLevel = 0;
            this.nodes[child].setLevelandPosition(currLevel, this.positions);

            //for each parent, do this again, until the parents are the arguements.
            this.assignPositions(array.value.variables, child, currLevel);
            //console.log(this.links);

            this.setSpatialPositions();

        } else {
            console.log("No return value");
            //Do a sim
            this.isSim = true;
            this.constructNodesAndLinks(array.value.variables);

            this.simulation = d3.forceSimulation()
                // forceLink creates tension along each link, keeping connected nodes together
                /*.force("link", d3.forceLink().id(function (d,i) {
                    return i;
                }))*/
                // forceManyBody creates a repulsive force between nodes, keeping them away from each other
                //.force("charge", d3.forceManyBody())
                // forceCenter acts like gravity, keeping the whole visualization in the middle of the screen
                .force("center", d3.forceCenter(this.width / 2, this.height / 2))
                .force("collide", d3.forceCollide(100))
                .force("link", d3.forceLink().distance(100));
        }

    }

    constructNodesAndLinks(array) {
        console.log("Organize list of nodes and links. ",array);
        let len = array.length;

        let i = 0;
        for(i; i < len; i++) {
            //console.log("Working on ", array[i].key, " whose parents are ", array[i].value.parentVars);
            this.nodes.push(new Node(array[i].key,array[i].value.parentVars));
            /*let j = 0;
            let numLinks = array[i].value.parentVars.length;
            for(j; j < numLinks; j++ ) {
                let parent = array[i].value.parentVars[j];
                let parentID = this.getIndexOf(array, parent);
                if(parentID !== -1) {
                    //console.log("link ", i, ", ",parentID);
                    this.links.push({source: this.nodes[i], target: this.nodes[parentID])
                }
            }*/
        }

        i = 0;
        for(i; i < len; i++) {
            //console.log("Working on links for ", array[i].key, " whose parents are ", array[i].value.parentVars);
            //this.nodes.push(new Node(array[i].key,array[i].value.parentVars));
            let j = 0;
            let numLinks = array[i].value.parentVars.length;
            for(j; j < numLinks; j++ ) {
                let parent = array[i].value.parentVars[j];
                let parentID = this.getIndexOf(array, parent);
                if(parentID !== -1) {
                    //console.log("link ", i, ", ",parentID);
                    this.links.push(
                        {
                            "source": this.nodes[i],
                            "target": this.nodes[parentID]
                        }
                    );
                }
            }
        }

        //console.log("After construction, ", this.links);
    }

    setSpatialPositions() {
        let padding = 100;

        //console.log(this.positions);
        //console.log(this.numLevels);

        let len = this.nodes.length;
        let i = 0;
        for (i; i < len; i++) {
            let x = this.nodes[i].level * padding + 50;
            let y = this.nodes[i].position * padding + 50;
            this.nodes[i].setSpatialPosition(x, y);
        }
    }

    assignPositions(array, rootID, currLevel) {
        //for each parent
        let i = 0;
        currLevel = currLevel + 1;
        if(currLevel > this.numLevels) {
            this.numLevels = currLevel;
            this.positions.push(-1);
        }
        //console.log(this.nodes);

        for(i; i < this.nodes[rootID].parents.length; i++) {
            let parent = this.nodes[rootID].parents[i];
            let parentID = this.getIndexOf(array, parent);

            //console.log(this.nodes[rootID].name," -> ", array[parentID].key);

            //add to nodes (even if it's already been added
            let grandParents = array[parentID].value.parentVars;
            let nodeID = this.nodes.length
            this.nodes.push(new Node(parent,grandParents));

            //add [child, parent] to links
            this.links.push([rootID, nodeID]);

            //assign level and position
            this.nodes[nodeID].setLevelandPosition(currLevel, this.positions);

            //call assignPositions with parent as root
            if(grandParents.length > 0) {
                this.assignPositions(array, nodeID, currLevel);
            }
        }

    }

    getIndexOf(array, key) {
        let i = 0;
        for(i; i< array.length; i++){
            if(array[i].key === key) {
                return i;
            }
        }
        return -1;
    }

    /*getNodeIndexOf(key) {
        let ind = 0;
        for(ind; ind < this.nodes[length]; ind++){
            if(this.nodes[ind].name == key) {
                return ind;
            }
        }
        return -1;
    }*/

    diagonal(s, d) {
        let path = "M " + s.y + " " + s.x ;
        path = path + " C " + (s.y + d.y) / 2 + " " + s.x;
        path = path + ", " + (s.y + d.y) / 2 + " " + d.x + ", " + d.y + " " + d.x;
        return path;
    };
}
