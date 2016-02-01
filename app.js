var url = 'http://www.freecodecamp.com/news/hot';

var w = 600,
    h = 600;

var svg = d3.select('#chart')
            .append('svg')
            .attr('width', w)
            .attr('height', h);

var force;
var rScale = d3.scale.linear().range([13, 15]);
var edgeColScale = d3.scale.linear().range(['#DADADA', 'black'])

var update = (nodes, links) => {

    var linkArc = d => {
      var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }

    var transform = d => `translate(${d.x}, ${d.y})`;

    var tick = e => {
        path.attr("d", linkArc);
        circle.attr("transform", transform);
        text.attr('transform', transform)
    }

    force = d3.layout.force()
                .nodes(nodes)
                .links(links)
                .size([w, h])
                .linkDistance(60)
                .charge(-300)
                .on("tick", tick)
                .start();

    rScale.domain(d3.extent(nodes, d => d.value))
    edgeColScale.domain(d3.extent(links, d => d.value))

    var path = svg.append("g").selectAll("path")
        .data(force.links())
      .enter().append("path")
        .style('stroke', d => edgeColScale(d.value))
        .attr("class", d => "link")

    var circle = svg.append("g").selectAll("circle")
        .data(force.nodes())
      .enter().append("circle")
        .attr("r", d => rScale(d.value))
        .call(force.drag);

    var text = svg.append("g").selectAll("text")
        .data(force.nodes())
      .enter().append("text")
        .attr("x", 8)
        .attr("y", ".31em")
        .text(d => d.name);

};



d3.json(url, (error, data) => {
    // var network = FlickrUtils.getTagNetwork(data, 10)
    var nodes = [
        {id: '123', value: 20, name: 'cuddlysnug'},
        {id: '234', value: 19, name: 'cuddlymon'},

    ];
    var links = [
        {source: nodes[0], target: nodes[1]},
    ];

    update(nodes, links)
    console.log('nodes:', nodes)
    console.log('links:', links)
    console.log(data)
});