import React from "react";
import ChartContainer from "../../components/ChartContainer";
import BaseMap from "../../components/BaseMap";
import Tooltip from "../../components/Tooltip";
import MapPin from "./MapPin";
import { forceSimulation, forceCollide, forceX, forceY } from "d3-force";

class PindropMap extends React.Component {
  constructor(props) {
    super(props);
    // set initial state to empty values, will update once the BaseMap component fetches topojson data
    this.state = {
      projection: () => [0, 0],
      mousePos: [0, 0],
      d: this.props.data[0],
      data: this.props.data
    };
  }

  projectionInit(projection) {
    this.setState({ projection });
    this.runSimulation(projection);
  }

  runSimulation(projection) {
    const _data = this.state.data;
    const forceLayout = forceSimulation(_data)
      .force(
        "forceX",
        forceX(d => {
          return projection([+d.lon, +d.lat])[0];
        })
      )
      .force(
        "forceY",
        forceY(d => {
          return projection([+d.lon, +d.lat])[1];
        })
      )
      .force(
        "collide",
        forceCollide(d => {
          return 5;
        }).strength(0.5)
      )
      .stop();

    for (let i = 0; i < 120; i++) {
      forceLayout.tick();
    }
    this.setState({ data: _data });
  }

  showTooltip(isActive, d, mousePos) {
    this.setState({
      isActive,
      d,
      mousePos
    });
  }

  hideTooltip(isActive) {
    this.setState({ isActive });
  }

  render() {
    const lon = this.props.lon || "lon";
    const lat = this.props.lat || "lat";
    const {
      title,
      subtitle,
      source,
      geometry,
      width,
      height,
      tooltipTemplate
    } = this.props;
    const { data, projection, isActive, d, mousePos } = this.state;
    return (
      <ChartContainer title={title} subtitle={subtitle} source={source}>
        <BaseMap
          geometry={geometry}
          width={width}
          height={height}
          projectionInit={this.projectionInit.bind(this)}
        >
          {data.map((d, i) => {
            if (!d.x || !d.y === 0) return null;
            return (
              <MapPin
                x={d.x}
                y={d.y}
                d={d}
                key={i}
                showTooltip={this.showTooltip.bind(this)}
                hideTooltip={this.hideTooltip.bind(this)}
              />
            );
          })}
        </BaseMap>
        {tooltipTemplate ? (
          <Tooltip
            d={d}
            mousePos={mousePos}
            isActive={isActive}
            tooltipTemplate={tooltipTemplate}
          />
        ) : null}
      </ChartContainer>
    );
  }
}
export default PindropMap;
