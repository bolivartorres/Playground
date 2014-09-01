var nodes = [
    {name: "Sookie"},
    {name: "Bill"},
    {name: "Eric"},
    {name: "Sam"},
    {name: "Tara"},
    {name: "Lafayette"},
    {name: "Pam"},
    {name: "Jessica"}
];

var links = [
    {source:0, target:1},
    {source:1, target:2},
    {source:2, target:6},
    {source:1, target:7},
    {source:0, target:3},
    {source:4, target:5},
    {source:0, target:4},
    {source:0, target:5}
];

function initGraph(){
    var width = 960,
        height = 500;

    var rectWidth = 100,
        rectHeight= 50;


    var color = d3.scale.category20();

    var zoom = d3.behavior.zoom()
        .scaleExtent([0, 10])
        .on("zoom", zoomed);

    var force = d3.layout.force()
        .gravity(0)
        .charge(-120)
        .linkDistance(rectWidth + rectHeight)
        .size([width, height]);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
    .call(zoom)
    .append("g");
        
    
    var rect = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none");
        
    
    var container = svg.append("g");
        

    force
          .nodes(nodes)
          .links(links)
          .start();

    var link = container.append("g")
        .attr("class", "link")
        .selectAll(".link")
        .data(links)
    .enter().append("line");
    
    var node;
    
    renderLevel1();

    
    
    
    function renderLevel1(){
        container.selectAll(".node").remove()
        node = container.append("g")
            .attr("zoomLevel", "1")
            .attr("class", "node")
            .selectAll(".node")
            .data(nodes)
        .enter().append("circle")
            .attr("r", 10)
            .call(force.drag);
        
        node.append("title")
            .text(function(d) { return d.name; });
    }

    function renderLevel2(){
    }

    function renderLevel3(){
        container.selectAll(".node").remove()
        node = container.append("g")
            .attr("zoomLevel", "3")
            .attr("class", "node")
            .selectAll(".node")
            .data(nodes)
        .enter().append("g")
            .attr("groupName", "rectCirc")
            .append("rect")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .call(force.drag)
        
        container.selectAll("[groupName=rectCirc]").each(function(d){
            var rect = d.select("rect");
                d.append("circle")
                    .attr("class", "node")
                    .attr("cx", rect.x)
                    .attr("cy", rect.y)
                    .attr("r", 10);
        });

          /*var node = svg.selectAll(".node")
              .data(nodes)
            .enter().append("circle")
              .attr("class", "node")
              .attr("r", 10)
              .style("fill", "blue")
              .call(force.drag);*/

        node.append("title")
            .text(function(d) { return d.name; });

    }
    
    force.on("tick", function() {
        
        if(node[0].parentNode.attributes.zoomLevel.value == "1"){
            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
        }
        else if(node[0].parentNode.attributes.zoomLevel.value == "3"){
            node.attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; });
            link.attr("x1", function(d) { return d.source.x + rectWidth/2; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x + rectWidth/2; })
                .attr("y2", function(d) { return d.target.y; });
        }

    });

    function zoomed() {
        if(node[0].parentNode.attributes.zoomLevel.value == "1" && d3.event.scale > 1.5){
            force.stop()
            renderLevel3();
            force.start()
            container.attr("transform", "translate(" + d3.event.translate + ")scale(" + 1 + ")");
            zoom.scale(1);
        }
        else if(node[0].parentNode.attributes.zoomLevel.value == "3" && d3.event.scale < 1){
            force.stop()
            renderLevel1();
            force.start()
            container.attr("transform", "translate(" + d3.event.translate + ")scale(" + 1 + ")");
            zoom.scale(1);
        }
        else{
            container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }
        
    }

}


