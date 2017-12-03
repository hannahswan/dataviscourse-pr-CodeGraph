//Class for varibale graphs
class VariableGraph {

    constructor() {
        this.nodes = [];
        this.links = [];
        this.graphSVG = d3.select("#graph");
        this.positions = [-1]; //stores number of positions for each level
        this.numLevels = 0;
        this.isSim = false;
        this.width = 900;
        this.height = 600;
        this.simulation = 0;
    }

    createGraph() { }

    drawGraph() {
        let nodeSize = 25;

        //links
        let nodeList = this.nodes;
        let linkList = this.links;
        let diagonal = this.diagonal;

        var linksG = this.graphSVG.append("g")
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
            var theLinks = linksG.selectAll('line.link')
                .data(this.links)
                .enter()
                .append("line")
                .attr("class", "link")
                .attr("stroke-width", 2);
        }

        //nodes
        var nodeG = this.graphSVG.append("g")
            .attr("id", "nodesG");
        let nodes = nodeG.selectAll("circle")
            .data(this.nodes)
            .enter()
            .append("circle")
            .attr("r", nodeSize)
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .classed('node', true);

        //labels
        var labelsG = this.graphSVG.append("g")
            .attr("id", "labelsG");
        let labels = labelsG.selectAll("text")
            .data(this.nodes)
            .enter()
            .append('text')
            .attr("dy", ".35em")
            .attr("x", function(d) {
                return d.x;
            })
            .attr("y", function (d) {
                return d.y;
            })
            .attr("text-anchor", "middle")
            .text(function(d) { return d.name; })
            .style("fill", "black");

        if(this.isSim) {
            this.simulation.nodes(nodeList);

            this.simulation.force("link")
                .links(linkList);

            this.simulation.on("tick", function () {
                theLinks
                    .attr("x1", function (d) {
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

    updateGraph(functionData) {
        this.clearGraph();
        this.buildGraph(functionData);
        this.drawGraph();
    }


    clearGraph() {
        this.isSim = false;
        this.simulation = 0;
        this.graphSVG.select("#nodesG").remove();
        this.graphSVG.select("#linksG").remove();
        this.graphSVG.select("#labelsG").remove();
        this.numLevels = 0;
        this.positions = [-1];
        this.nodes = [];
        this.links = [];
    }

    buildGraph(array) {
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

            this.setSpatialPositions();

        } else {
            //Do a sim
            this.isSim = true;
            this.constructNodesAndLinks(array.value.variables);

            this.simulation = d3.forceSimulation()
                .force("center", d3.forceCenter(this.width / 2, this.height / 2))
                .force("collide", d3.forceCollide(100))
                .force("link", d3.forceLink().distance(100));

        }

    }

    highlight(data) {
        let nodes = this.graphSVG.selectAll("circle")
            .classed('highlighted', function (d) {
                    if(d.name == data.key) {
                        return true;
                    } else {
                        return false;
                    }
                });

            console.log(nodes);
    }

    constructNodesAndLinks(array) {
        let len = array.length;

        let i = 0;
        for(i; i < len; i++) {
            this.nodes.push(new Node(array[i].key,array[i].value.parentVars));
        }

        i = 0;
        for(i; i < len; i++) {
            let j = 0;
            let numLinks = array[i].value.parentVars.length;
            for(j; j < numLinks; j++ ) {
                let parent = array[i].value.parentVars[j];
                let parentID = this.getIndexOf(array, parent);
                if(parentID !== -1) {
                    this.links.push(
                        {
                            "source": this.nodes[i],
                            "target": this.nodes[parentID]
                        }
                    );
                }
            }
        }
    }

    setSpatialPositions() {
        let padding = 100;

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

        for(i; i < this.nodes[rootID].parents.length; i++) {
            let parent = this.nodes[rootID].parents[i];
            let parentID = this.getIndexOf(array, parent);

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

    diagonal(s, d) {
        let path = "M " + s.y + " " + s.x ;
        path = path + " C " + (s.y + d.y) / 2 + " " + s.x;
        path = path + ", " + (s.y + d.y) / 2 + " " + d.x + ", " + d.y + " " + d.x;
        return path;
    };
}
