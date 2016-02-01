var url = 'http://www.freecodecamp.com/news/hot';

var w = 600,
    h = 600;

var svg = d3.select('#chart')
            .append('svg')
            .attr('width', w)
            .attr('height', h);

var force;
var rScale = d3.scale.linear().range([4, 15]);
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
        image.attr("transform", transform);
        text.attr('transform', transform)
        circle.attr('transform', transform)
    }

    force = d3.layout.force()
                .nodes(nodes)
                .links(links)
                .size([w, h])
                .linkDistance(60)
                .charge(-300)
                .gravity(0.1)
                .on("tick", tick)
                .start();

    rScale.domain(d3.extent(nodes, d => d.value))
    edgeColScale.domain(d3.extent(links, d => d.value))

    var path = svg.append("g").selectAll("path")
        .data(force.links())
      .enter().append("path")
        .style('stroke', d => edgeColScale(d.value))
        .attr("class", d => "link")

    var imgSide = 30;
    var imgMiddlePoint = imgSide / 2;

    var circle = svg.append("g").selectAll("circle")
        .data(force.nodes())
      .enter().append("circle")
        .attr("r", d => rScale(d.value))
        .call(force.drag);

    var image = svg.append("g").selectAll("image")
        .data(force.nodes())
      .enter().append("svg:image")
        .attr('xlink:href', d => d.image || null)
        .attr("width", imgSide)
        .attr("height", imgSide)
        .attr("x", -imgMiddlePoint)
        .attr("y", -imgMiddlePoint)
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
    
    var getDomainOnly = url => {
        url = url.match(/\/{2}(.*?)\//g);
        return url.toString().replace(/\//g, '')
    }

    var nodes = [
        {value: 0, name: data[0].author.username, image: data[0].author.picture},
        {value: 0, name: data[1].author.username, image: data[1].author.picture},
        {value: 0, name: data[2].author.username, image: data[2].author.picture},
        {value: 1, name: getDomainOnly(data[0].link), url: data[0].link},
        {value: 1, name: getDomainOnly(data[1].link), url: data[1].link},
        {value: 1, name: getDomainOnly(data[2].link), url: data[2].link},
        {value: 1, name: getDomainOnly(data[3].link), url: data[3].link},
        {value: 1, name: getDomainOnly(data[4].link), url: data[4].link},
        {value: 1, name: getDomainOnly(data[5].link), url: data[5].link},

    ];
    var links = [
        {source: nodes[0], target: nodes[3]},
        {source: nodes[0], target: nodes[4]},
        {source: nodes[0], target: nodes[5]},
        {source: nodes[1], target: nodes[3]},
        {source: nodes[2], target: nodes[3]},
        {source: nodes[2], target: nodes[8]},
    ];

    update(nodes, links)
    console.log('nodes:', nodes)
    console.log('links:', links)
    console.log(data)
});0