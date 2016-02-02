
var url = 'http://www.freecodecamp.com/news/hot';
d3.json(url, (error, data) => {
    if (error) {console.log('ERR:', error)}

    console.log('data[0]:', data[0])
    
    var getDomainOnly = url => {
        url = url.match(/\/{2}(.*?)\//g);
        if (url) {
            url = url.toString().replace(/\//g, '');
            url = url.replace(/www./g, '')
            console.log(`'${url}'`);
            return url;
        }
    }

    var links = []
    // links.push(  {source: "alanbuchanan", target: "quora.com", type: "licensing"},
    //   {source: "alanbuchanan", target: "f.com", type: "licensing"},
    //   {source: "alanbuchanan", target: "g.com", type: "licensing"},
    //   {source: "alanbuchanan", target: "medium.com", type: "licensing"},
    //   {source: "alanbuchanan", target: "medium.com", type: "licensing"},
    //   {source: "alanbuchanan", target: "medium.com", type: "licensing"},
    //   {source: "alanbuchanan", target: "medium.com", type: "resolved"},
    //   {source: "alanbuchanan", target: "medium.com", type: "suit"},
    //   {source: "tony", target: "medium.com", type: "suit"},)

    data.forEach((e, i) => {
        links.push({source: e.author.username, target: getDomainOnly(e.link), type: 'licensing', image: e.author.picture})
    })

    var nodes = {};

    // Compute the distinct nodes from the links.
    links.forEach(function(link) {
      link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, image: link.image});
      link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
    });

    console.log('nodes:', nodes)
    console.log('links:', links)

    var rScale = d3.scale.linear().range([1, 3])

    var width = 800,
        height = 800;

    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(60)
        .charge(-100)
        .on("tick", tick)
        .start();

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);



    // Per-type markers, as they don't inherit styles.
    svg.append("defs").selectAll("marker")
        .data(["suit", "licensing", "resolved"])
      .enter().append("marker")
        .attr("id", function(d) { return d; })
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
      .append("path")
        .attr("d", "M0,-5L10,0L0,5")

    var tip = d3.tip().attr('class', 'd3-tip').html(d => d.name);
    svg.call(tip);

    var path = svg.append("g").selectAll("path")
        .data(force.links())
      .enter().append("path")
        .attr("class", function(d) { return "link " + d.type; })
        .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

    var circle = svg.append("g").selectAll("circle")
        .data(force.nodes())
      .enter().append("circle")
        .attr("r", d => rScale(d.weight))
        .call(force.drag)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

    // var text = svg.append("g").selectAll("text")
    //     .data(force.nodes())
    //   .enter().append("text")
    //     .attr("x", 8)
    //     .attr("y", ".31em")
    //     .text(function(d) { return d.name; });

    var avatarSize = 30;

    var image = svg.append("g").selectAll("image")
        .data(force.nodes())
      .enter().append("svg:image")
        .attr('xlink:href', d => d.image || null)
        .attr("width", avatarSize)
        .attr("height", avatarSize)
        .attr("x", -avatarSize / 2)
        .attr("y", -avatarSize / 2)
        .call(force.drag)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

        //TODO: the author images aren't showing up properly

    // Use elliptical arc path segments to doubly-encode directionality.
    function tick() {
      path.attr("d", linkArc);
      circle.attr("transform", transform);
      // text.attr("transform", transform);
      image.attr('transform', transform)
    }

    function linkArc(d) {
      var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }

    function transform(d) {
      return "translate(" + d.x + "," + d.y + ")";
    }
})