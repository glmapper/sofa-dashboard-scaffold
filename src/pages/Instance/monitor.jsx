import React from "react";
import { connect } from "dva";
import { Card } from 'antd';
import styles from './monitor.less';
import DataSet from "@antv/data-set";
import { Chart, Coord, Geom, Label, Tooltip, View } from "bizcharts";

/**
 * 应用信息展示控制台
 */
@connect(({ monitor }) => ({
  monitor: monitor,
}))
class InstanceMonitor extends React.Component {

  componentDidMount () {
    this.load('fetchEnv');
    this.load('fetchHealth');
    this.load('fetchMappings');
    this.load('fetchLoggers');
    this.load('fetchInfo');
    this.load('fetchMemory');
    this.load('fetchThread');
  }

  load = (type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monitor/' + type,
      payload: {
        instanceId: this.props.id
      }
    })
  };

  render () {
    return (
      <div>
        <div style={ { display: 'flex' } }>
          <PropsMonitor data={ this.props.monitor.env }
                        graph={ "#env/graph" }
                        detail={ "#info/detail" }/>
          <PropsMonitor data={ this.props.monitor.info }
                        graph={ "#info/graph" }
                        detail={ "#info/detail" }/>
        </div>
      </div>
    )
  };
}

/**
 * 应用属性变量相关展示组件
 */
class PropsMonitor extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      graph: window.location.hash === props.graph,
      detail: window.location.hash == props.detail,
    }; // 使用锚点控制详情页面展示
  }

  switchGraph (visible) {
    this.setState({ graph: visible });
    window.location.hash = visible ? this.props.graph : "#";
  }

  switchDetail (visible) {
    this.setState({ detail: visible });
    window.location.hash = visible ? this.props.detail : "#";
  }

  render () {
    return (
      <Card title="Environment" bordered={ false }
            extra={ <a href="javascript:;" onClick={ () => this.switchGraph(true) }>Graph</a> }
            style={ { width: "44%", padding: "2%" } }>
        <div>
          <!-- 展示由接口生成的 overview 信息 -->
          <div>
            {
              (this.props.data['overview'] === undefined ? [] : this.props.data['overview'])
                .map(item => {
                  return (
                    <div key={ item.key } className={ styles["item-info"] }>
                      <span className={ styles["item-info-span-title"] }>{ item.key }</span>
                      <span className={ styles["item-info-span-content"] }>{ item.value }</span>
                    </div>
                  );
                })
            }
            <div key={ '...' } className={ styles["item-info"] }>
            <span className={ styles["item-info-span-title"] }>
              <a href="javascript:;"
                 className={ styles["item-info-more"] }
                 onClick={ () => this.switchDetail(true) }>
                more ...
              </a>
            </span>
              <span className={ styles["item-info-span-content"] }></span>
            </div>
          </div>
          <!-- Graph 模态框 -->
          <div style={ { visibility: this.state.graph ? 'visible' : 'hidden' } }>
            {
              this.props.data.detail === undefined ? (<div></div>) : (
                <PropertyTreeGraph dismiss={ () => this.switchGraph(false) }
                                   data={ this.props.data.detail }/>)
            }
          </div>
          <!-- Detail 模态框 -->
          <div style={ { visibility: this.state.detail ? 'visible' : 'hidden' } }>
            <a href="javascript:;" onClick={ () => this.switchDetail(false) }>close</a>
            {/*{*/ }
            {/*  this.props.data.detail == undefined ? (<div></div>) : (*/ }
            {/*    */ }
            {/*  )*/ }
            {/*}*/ }
          </div>
        </div>
      </Card>
    )
  }
}

/**
 * 用于展示树状结构的属性图
 */
class PropertyTreeGraph extends React.Component {
  render () {
    const dv = new DataSet.View().source(this.props.data, {
      type: "hierarchy",
      pureData: true
    });
    dv.transform({
      type: "hierarchy.indented",
      // this layout algorithm needs to use pure data
      direction: "LR",

      getHGap () {
        return 10;
      },

      getVGap () {
        return 10;
      },

      getHeight () {
        return 10;
      },

      getWidth (d) {
        return 10 * d.name.length;
      }
    });
    return (
      <div className={ styles['monitor-detail-bg'] } onClick={ this.props.dismiss }>
        <Chart
          className={ styles['monitor-detail-content'] }
          height={ this.props.height || window.innerHeight * .98 }
          width={ window.innerWidth * .78 }>
          <Coord reflect="y"/>
          <Tooltip/>
          <View
            data={ dv.getAllLinks().map(link => ({
              x: [link.source.x, link.target.x],
              y: [link.source.y, link.target.y],
              source: link.source.id,
              target: link.target.id
            })) }>
            <Geom
              type="edge"
              position="x*y"
              shape="smooth"
              color="grey"
              opacity={ .5 }
            />
          </View>
          <View
            data={ dv.getAllNodes().map(node => ({
              hasChildren: !!(node.children && node.children.length),
              name: node.data.name,
              value: node.data.value,
              side: node.side || "root",
              x: node.x,
              y: node.y
            })) }>
            <Geom type="point" position="x*y" color="hasChildren" tooltip="value">
              <Label
                content="name"
                textStyle={ (text, item) => {
                  return {
                    fill: "grey",
                    fontSize: 11,
                    textBaseline: "middle",
                  };
                } }
                offset={ 5 }/>
            </Geom>
          </View>
        </Chart>
      </div>
    );
  }
}

class PropertyDetail extends React.Component {


}

export default InstanceMonitor;
