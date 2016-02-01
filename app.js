var url = 'https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=bce47572d3495252126d1d9a817e8077&extras=tags%2Ccount_views&per_page=500&format=json&nojsoncallback=1';

var w = 600,
    h = 600;

var svg = d3.select('#chart')
            .append('svg')
            .attr('width', w)
            .attr('height', h);

var force;
var rScale = d3.scale.linear().range([5, 15]);
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
    var network = FlickrUtils.getTagNetwork(data, 10)
    update(network.nodes, network.edges);
    console.log('nodes:', network.nodes);
    console.log('links:', network.edges)
});