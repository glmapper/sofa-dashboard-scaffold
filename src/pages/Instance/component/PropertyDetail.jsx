import React from "react";
import {Modal} from 'antd';
import styles from '../monitor.less';

/**
 * 用于展示属性详情的弹窗
 */
class PropertyDetail extends React.Component {

  convertToList(data, ref, prefix) {
    if (ref === undefined || data === undefined) {
      ref = []
    }
    const thisPrefix = prefix === undefined ? "" : prefix;
    if (data.children === undefined) {
      ref.push({
        "name": data.name,
        "value": data.value,
        prefix: thisPrefix
      })
    } else {
      for (const child of data.children) {
        const nextPrefix = thisPrefix.length === 0 ? data.name : thisPrefix + ' > ' + data.name;
        this.convertToList(child, ref, nextPrefix)
      }
    }
    return ref
  }

  render() {
    const list = this.convertToList(this.props.data);
    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        width="85%"
        onCancel={this.props.dismiss}
        onOk={this.props.dismiss}>

        {
          list.map(item => {
            return (
              <div key={item.prefix + item.name} className={styles["item-info"]}>
                <span className={styles["item-info-span-title"]}>{item.name}</span><br/>
                <span className={styles["item-info-span-content"]}>
                  {item.value === "" ? "<none>" : item.value}
                </span>
                <span className={styles["tooltips"]}>{item.prefix}</span>
              </div>
            );
          })
        }

      </Modal>
    );
  }

}

export default PropertyDetail;
