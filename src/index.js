import "./index.scss";
import PindropMap from "./charts/PindropMap";
let queue = [];
let data = null;
const settings = {
  viz__map: el => {
    const tooltip = d => (
      <div>
        <div className="tooltip__category">
          <div className="tooltip__category__list-item">
            <span className="tooltip__category__list-item__label">Team:</span>
            <span className="tooltip__category__list-item__value">
              {d["interviewee"]}
            </span>
          </div>
          <div className="tooltip__category__list-item">
            <span className="tooltip__category__list-item__label">
              Location:
            </span>
            <span className="tooltip__category__list-item__value">
              {d["city"]}
              {", "}
              {d["state"]}
            </span>
          </div>
        </div>
      </div>
    );
    ReactDOM.render(
      <PindropMap
        geometry="us"
        data={data.map}
        width={1000}
        height={600}
        tooltipTemplate={tooltip}
        title={data.meta[0].title}
        subtitle={data.meta[0].description}
      />,
      el
    );
  }
};
fetch("https://na-data-projects.s3.amazonaws.com/data/pit/field_research.json")
  .then(response => response.json())
  .then(_data => {
    data = _data;
    for (let i = 0; i < queue.length; i++) queue[i]();
  });
window.renderDataViz = function(el) {
  let id = el.getAttribute("id");
  let chart = settings[id];
  if (!chart) return;
  if (data) {
    chart(el);
  } else {
    queue.push(() => chart(el));
  }
};
