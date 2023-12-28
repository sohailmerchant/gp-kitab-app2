import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../../../index.css";



const SideBar = (props) => {
  const ref = useRef();

  // initialize the svg on mount:
  useEffect(() => {
    const t = `translate(0, ${props.margin.top})`;
    d3.select(ref.current)
      .html("")
      .append("g")
        .attr("transform", t)
        .attr("class", "side-bar");
  });

  // create the axes etc. for every change of relevant variables:
  useEffect(() => {
    console.log("updating side bar");
    const tooltipDiv = d3.select(".vizTooltip");
    const barSvg = d3.select(".side-bar");
    

    // build X axis scale:
    let maxTotalChMatch = d3.max(props.msStats, d => d.ch_match_total);
    let xScale = d3.scaleLinear()
      .domain([0, maxTotalChMatch])  // each book will have its own space on the X axis
      .range([ 0, props.width ]);
    // build Y axis scale:
    let yScale = d3.scaleLinear()
      .domain([props.mainBookMilestones+1,0])   // flip the axis!
      .range([props.height, 0]);


    // Add X axis:
    barSvg.selectAll(".xAxis").remove();
    barSvg.append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + props.height + ")")
      .call(d3.axisBottom(xScale)
        .tickFormat(d3.format('.2s'))
        .ticks(4)
        .tickSize(2)
      );
    // Add X axis label:  see https://stackoverflow.com/a/11194968/4045481
    barSvg.selectAll(".xLabel").remove();
    barSvg.append("text")
      .attr("class", "xLabel")
      .attr("text-anchor", "end")
      .attr("x", 150)
      .attr("dx", "-4em")
      /*.attr("y", height + 25)*/
      .text("Characters reused");

    // Add Y axis:
    barSvg.selectAll(".yAxis").remove();
    barSvg.append("g")
      .attr("class", "yAxis")
      .call(d3.axisLeft(yScale)
        .tickFormat((d) => '')  // remove tick marks in D3 v4: see https://stackoverflow.com/a/12994876/4045481
        .tickSize(0)
      );

    let barPlot = barSvg.append('g')
      .attr("class", "side-bar-plot");
    
    // add/update data:
    let barHeight = Math.min(3,props.height/props.msStats.length);
    //barPlot.selectAll(".bar").remove();
    barPlot
      .selectAll("rect")
      .data(props.msStats, d => d)
      .join(
        // create a new <rect> tag for the number of 
        // data points that are not yet in the graph:
        enter => (
          enter
            .append("rect")
              .attr("class", "bar")
            .attr("height", barHeight)
            //.attr("y", d => yScale(d.ms_id) - barHeight/2)
            .attr("y", d => yScale(d.ms_id))
            .attr("x", 0)
            .attr("width", d => xScale(d.ch_match_total) )
            .style("fill", "#3FB8AF")
            .style("stroke", "#3FB8AF")
            // add tooltip:
            .on("mouseover", function(event, d) {
                /*console.log("Milestone "+d.ms_id);
                console.log(tooltipDiv);*/
                // make the tooltip visible:
                tooltipDiv.transition()
                    .duration(200)
                    .style("opacity", .9);
                // create the text for the tooltip:
                let tooltipMsg = "Milestone "+d.ms_id+":";
                tooltipMsg += "<br/>Total characters matched: " + d3.format(",")(d.ch_match_total);
                
                // calculate position on the page:
                //console.log(d3.select(this) );
                // build the tooltip:
                tooltipDiv.html(tooltipMsg)
                    .style("left", event.pageX-100 + "px")
                    .style("top", 375 + parseInt(d3.select(this).attr("y")) + "px")
                    .style("width", "200px");  
            })
            .on("mouseout", function(event, d) {
                // hide the tooltip:
                tooltipDiv.transition()
                    .duration(200)
                    .style("opacity", 0);
            })
        ),
        /*
        // define the transition between reloads:
        update => (
            update
        ),*/
        // remove superfluous bars in the graph:
        exit => (
            exit.call(exit => exit.remove())
        )
      )    
    
  }, [props.msStats, props.height, props.mainBookMilestones, props.width]);
  
  return (
    <svg 
      ref={ref}
      id="side-bar"
      width={props.width + props.margin.left + props.margin.right}
      height={props.height + props.margin.top + props.margin.bottom}
    />
  );
}

export default SideBar