import React from 'react';
import reactMixin from 'react-mixin';
import { ExpandedStateHandlerMixin } from './mixins';
import JSONArrow from './JSONArrow';

/**
 * Renders nested values (eg. objects, arrays, lists, etc.)
 */

const styles = {
  base: {
    position: 'relative',
    paddingTop: 3,
    paddingBottom: 3,
    marginLeft: 14
  },
  label: {
    margin: 0,
    padding: 0,
    display: 'inline-block'
  },
  span: {
    cursor: 'default'
  },
  spanType: {
    marginLeft: 5,
    marginRight: 5
  }
};

@reactMixin.decorate(ExpandedStateHandlerMixin)
export default class JSONNestedNode extends React.Component {
  defaultProps = {
    data: [],
    nodeExpanded: false,
    initialExpanded: false,
    allExpanded: false,
    level: 0
  };

  // cache store for the number of items string we display
  itemString = false;

  // flag to see if we still need to render our child nodes
  needsChildNodes = true;

  // cache store for our child nodes
  renderedChildren = [];

  constructor(props) {
    super(props);

    // calculate individual node expansion if necessary
    var nodeExpanded = this.props.nodeExpanded ?
        this.props.nodeExpanded(this.props.keyName, this.props.data, this.props.level) : false;
    this.state = {
      expanded: this.props.initialExpanded || this.props.allExpanded || nodeExpanded,
      createdChildNodes: false
    };
  }

  render() {
    let childListStyle = {
      padding: 0,
      margin: 0,
      listStyle: 'none',
      display: (this.state.expanded) ? 'block' : 'none'
    };
    let containerStyle;
    let spanStyle = {
      ...styles.span,
      color: this.props.theme.base0B
    };
    containerStyle = {
      ...styles.base
    };
    if (this.state.expanded) {
      spanStyle = {
        ...spanStyle,
        color: this.props.theme.base03
      };
    }

    if (this.state.expanded && this.needsChildNodes) {
      this.needsChildNodes = false;
      var props = Object.assign({}, this.props);
      props.level +=1;
      this.renderedChildren = this.props.getChildNodes({
        ...props
      });
    }

    const itemType = <span style={styles.spanType}>{this.props.nodeTypeIndicator}</span>;
    const renderedItemString = this.props.renderItemString({
      data: this.props.data,
      getItemString: this.props.getItemString,
      itemString: this.itemString,
      itemType
    });

    return (
      <li style={containerStyle}>
        <JSONArrow theme={this.props.theme} open={this.state.expanded} onClick={::this.handleClick} style={this.props.styles.getArrowStyle(this.state.expanded)} />
        <label style={{
          ...styles.label,
          color: this.props.theme.base0D,
          ...this.props.styles.getLabelStyle(this.props.nodeType, this.state.expanded)
        }} onClick={::this.handleClick}>
          {this.props.labelRenderer(...this.props.keyPath)}:
        </label>
        <span style={{
          ...spanStyle,
          ...this.props.styles.getItemStringStyle(this.props.nodeType, this.state.expanded)
        }} onClick={::this.handleClick}>
          {renderedItemString}
        </span>
        <ul style={{
          ...childListStyle,
          ...this.props.styles.getListStyle(this.props.nodeType, this.state.expanded)
        }}>
          {this.renderedChildren}
        </ul>
      </li>
    );
  }
}
