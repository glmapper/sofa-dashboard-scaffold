import React from "react";
import {Modal} from 'antd';
import DataSet from "@antv/data-set";
import {Chart, Coord, Geom, Label, Tooltip, View,} from "bizcharts";

/**
 * 用于展示属性图的弹窗
 */
class PropertyTreeGraph extends React.Component {

  render() {
    const dv = new DataSet.View().source(this.props.data, {
      type: "hierarchy",
      pureData: true
    });
    dv.transform({
      type: "hierarchy.indented",
      // this layout algorithm needs to use pure data
      direction: "LR",
    });
    return (
      <Modal title={this.props.title}
             width="85%"
             visible={this.props.visible}
             onCancel={this.props.dismiss}
             onOk={this.props.dismiss}>
        <Chart width={window.innerWidth * .8}>
          <Coord reflect="y"/>
          <Tooltip/>
          <View
            data={dv.getAllLinks().map(link => ({
              x: [link.source.x, link.target.x],
              y: [link.source.y, link.target.y],
              source: link.source.id,
              target: link.target.id
            }))}>
            <Geom
              type="edge"
              position="x*y"
              shape="smooth"
              color="grey"
              opacity={.5}
            />
          </View>
          <View
            data={dv.getAllNodes().map(node => ({
              hasChildren: !!(node.children && node.children.length),
              name: node.data.name,
              value: node.data.value,
              side: node.side || "root",
              x: node.x,
              y: node.y
            }))}>
            <Geom type="point" position="x*y" color="hasChildren" tooltip="value">
              <Label
                content="name"
                textStyle={() => {
                  return {
                    fill: "grey",
                    fontSize: 11,
                    textBaseline: "middle",
                  };
                }}
                offset={5}/>
            </Geom>
          </View>
        </Chart>
      </Modal>
    );
  }
}

export default PropertyTreeGraph;
