import React from 'react';
import { Card, Tabs } from 'antd';
import { connect } from 'dva';
import InstanceMonitor from './monitor'

const { TabPane } = Tabs;


class TabB extends React.Component {
  timer = 0;

  componentDidMount () {
    this.timer = setInterval(() => {
      console.log('tabb did');
    }, 1000);
  }

  componentWillUnmount () {
    console.log('tabb unmount');
    clearInterval(this.timer);
  }

  render () {
    return <p>TabB</p>;
  }
}

@connect(({ instance }) => ({
  list: instance.list,
}))
class Actuator extends React.Component {
  state = {
    activeKey: '1',
  }

  componentDidMount () {
  }

  changeTab = (key) => {
    this.setState({ activeKey: key });
  }

  render () {
    const { activeKey } = this.state;

    return (
      <Card bordered={ false } hoverable={ false } style={ { marginTop: -15, marginLeft: -15 } }>
        <Tabs activeKey={ this.state.activeKey } onChange={ this.changeTab }>
          <TabPane tab="基础信息" key="1">
            {
              activeKey === '1'
              &&
              <InstanceMonitor dispatch={ this.props.dispatch } id={ this.props.match.params[0] }/>
            }
          </TabPane>
          <TabPane tab="应用配置" key="2">
            {
              activeKey === '2'
              && <TabB/>
            }
          </TabPane>
        </Tabs>
      </Card>
    );
  }
};
export default Actuator;
