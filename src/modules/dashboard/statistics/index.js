import React from "react";
import PropTypes from "prop-types";

const Statistics = (props) => {
  const icon = (
    <span className={"display-5 text-" + props.textColor}>
      <i className={"mdi mdi-" + props.icon}></i>
    </span>
  );
  const title = <span>{props.title}</span>;
  const subtitle = <h4 className="font-medium mb-0">{props.subtitle}</h4>;
  return (
    <div className="d-flex align-items-center">
      <div className="mr-2">{icon}</div>
      <div>
        {title}
        {subtitle}
      </div>
    </div>
  );
};

Statistics.defaultProps = {
  textColor: "default",
};

Statistics.propTypes = {
  textColor: PropTypes.oneOf([
    "primary",
    "success",
    "info",
    "danger",
    "warning",
    "orange",
    "cyan",
    "default",
  ]),
  icon: PropTypes.string,
  title: PropTypes.node,
  subtitle: PropTypes.node,
};

export default Statistics;
