import React from "react";
import { connect } from "dva";

@connect(({ monitor }) => ({
  monitor: monitor,
}))
class InstanceMonitor extends React.Component {

  componentDidMount () {
    this.load('fetchEnv')
    this.load('fetchHealth')
    this.load('fetchMappings')
    this.load('fetchLoggers')
    this.load('load')
    this.load('fetchMemory')
    this.load('fetchThread')
  }

  load = (type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monitor/' + type,
      payload: {
        instanceId: this.props.id
      }
    })
  }

  render () {
    return (
      <div>
        <EnvMonitor id={ this.props.id } data={ this.props.monitor.env }/>
      </div>
    )
  }
}

class EnvMonitor extends React.Component {

  render () {
    return (
      <div>
        <div id="env-graph"></div>
      </div>
    )
  }

}

export default InstanceMonitor;
