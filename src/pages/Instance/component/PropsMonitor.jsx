import React from "react";
import {Card} from 'antd';
import styles from '../monitor.less';

import PropertyTreeGraph from './PropertyTreeGraph';
import PropertyDetail from './PropertyDetail';


/**
 * 应用属性变量相关展示组件
 */
class PropsMonitor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      graph: window.location.hash === props.graphAnchor,
      detail: window.location.hash === props.detailAnchor,
    }; // 使用锚点控制详情页面展示
  }

  switchGraph(visible) {
    this.setState({graph: visible});
    window.location.hash = visible ? this.props.graphAnchor : "#";
  }

  switchDetail(visible) {
    this.setState({detail: visible});
    window.location.hash = visible ? this.props.detailAnchor : "#";
  }

  render() {
    const hasData = this.props.data['overview'] !== undefined
      && this.props.data['overview'].length > 0;
    return (
      <Card title={this.props.title} bordered={false}
            extra={<a href="javascript:;" onClick={() => this.switchGraph(true)}>Graph</a>}
            style={{width: this.props.width ? this.props.width : "44%", paddingLeft: "2%", paddingRight: "2%"}}>
        <div>
          <div>
            {
              //展示由接口生成的 overview 信息
              hasData ? this.props.data['overview'].map(item => {
                return (
                  <div key={item.key} className={styles["item-info"]}>
                    <span className={styles["item-info-span-title"]}>{this.trimText(item.key, 40)}</span>
                    <span
                      className={[
                        styles["item-info-span-content"],
                        styles["text-right"]
                      ].join(' ')}>{item.value}</span>
                  </div>
                )
              }) : (<p>No data</p>)
            }
            {
              hasData ? (
                <div key={'...'} className={styles["item-info"]}>
                  <span className={styles["item-info-span-title"]}>
                    <a href="javascript:;"
                       className={styles["item-info-more"]}
                       onClick={() => this.switchDetail(true)}>
                       more ...
                    </a>
                  </span>
                </div>
              ) : []
            }
          </div>
          <div>
            {
              //Graph 模态框
              this.props.data.detail === undefined ? (<div></div>) : (
                <PropertyTreeGraph
                  title={this.props.title || "Properties"}
                  visible={this.state.graph}
                  dismiss={() => this.switchGraph(false)}
                  data={this.props.data.detail}/>)
            }
          </div>
          <div>
            {
              //Graph 模态框
              this.props.data.detail === undefined ? (<div></div>) : (
                <PropertyDetail
                  title={this.props.title || "Properties"}
                  visible={this.state.detail}
                  dismiss={() => this.switchDetail(false)}
                  data={this.props.data.detail}/>)
            }
          </div>
        </div>
      </Card>
    )
  }

  trimText(origin, limit) {
    return origin.length > limit ? origin.substring(0, limit) + "..." : origin;
  }
}

export default PropsMonitor;
