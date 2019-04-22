import React, {Component} from 'react';
import * as d3 from "d3";
import ReactFauxDOM from 'react-faux-dom';
import '../Statistics/css/Chart.css';


/****************************  bPO2ChartComp  ******************************/


class LiveChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            err: false,
            body_width: 1000
        };
    }

    componentWillMount() {
    }

    componentDidUpdate(prevProps, prevState) {
    }

    render() {

        let chartData = this.props.data;
        let dataType = this.props.dataType;

        if (chartData && this.props.data.length > 0) {
            let data = chartData;

            let margin = {top: 40, right: 20, bottom: 30, left: 30},
                width = 900 - margin.left - margin.right,
                height = 200 - margin.top - margin.bottom;

            // parse the date / time
            let parseTime = d3.timeParse();

            // set the ranges
            let x = d3.scaleTime().range([0, width]);
            let y = d3.scaleLinear().range([height, 0]);


            // define the line
            let valueLine = d3.line()
                .x(function (d) {
                    return x(d.dateTime);
                })
                .y(function (d) {
                    return y(d.stats);
                });

            const div = new ReactFauxDOM.Element('div');
            let parent = d3.select(div);

            let svg = parent.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("class", "chart-line")
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");


            data.forEach(function (d) {
                d.dateTime = new Date(d.dateTime);
                d.stats = +d.stats;
            });


            x.domain(d3.extent(data, function (d) {
                return d.dateTime;
            }));
            y.domain([0, d3.max(data, function (d) {
                return d.stats;
            })]);

            // Add the valueline path.
            svg.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", valueLine)
                .attr("class", dataType);

            // Add the X Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add the Y Axis
            svg.append("g")
                .call(d3.axisLeft(y));

            return div.toReact();
        }

        else {
            return (
                <p></p>
            )
        }

    }
}


export default LiveChart;