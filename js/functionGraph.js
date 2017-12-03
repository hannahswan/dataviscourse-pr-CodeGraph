/** Class implementing the graph view for functions. */
class FunctionGraph {

    constructor(data) {
        this.data = data.slice();
        this.nodes = [];
        this.links = [];
        this.graphSVG = d3.select("#graph");
        this.positions = [-1]; //stores number of positions for each level
        this.numLevels = 0;
        this.width = 900;
        this.height = 600;
        this.simulation = 0;
    }

    createGraph() {
        console.log(this.data);

        let len = this.data.length;
        let i = 0;
        for(i; i < len; i++) {
            this.nodes.push(new Node(this.data[i].key, this.data[i].value.functionCalls))
        }
        i=0;
        for(i; i < len; i++) {
            let j = 0;
            let numCalls = this.data[i].value.functionCalls.length;
            for(j; j < numCalls; j++) {
                let parentID = this.getNodeIndexOf(this.data[i].value.functionCalls[j].key);
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

        console.log(this.nodes);
        console.log(this.links);

        this.simulation = d3.forceSimulation()
            .force("center", d3.forceCenter(this.width / 2, this.height / 2))
            .force("collide", d3.forceCollide(100))
            .force("link", d3.forceLink().distance(100));

        console.log(this.simulation);
    }

    drawGraph() {
        let nodeSize = 25;

        //links
        let nodeList = this.nodes;
        let linkList = this.links;

        var linksG = this.graphSVG.append("g")
            .attr("id", "linksG");


        console.log("I'm in here. ", this.links);
        var theLinks = linksG.selectAll('line.link')
            .data(this.links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("stroke-width", 2);


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

        console.log(this.simulation);


        this.simulation.nodes(nodeList);

        this.simulation.force("link")
            .links(linkList);

        this.simulation.on("tick", function () {
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

    updateGraph(functionData) {
        this.drawGraph();
    }


    clearGraph() {
        this.simulation = 0;
        this.graphSVG.select("#nodesG").remove();
        this.graphSVG.select("#linksG").remove();
        this.graphSVG.select("#labelsG").remove();
        this.numLevels = 0;
        this.positions = [-1];
        this.nodes = [];
        this.links = [];
    }

    getNodeIndexOf(key) {
        let ind = 0;
        for(ind; ind < this.nodes.length; ind++){
            if(this.nodes[ind].name == key) {
                return ind;
            }
        }
        return -1;
    }

}
