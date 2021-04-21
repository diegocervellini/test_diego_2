import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var CustomTooltip = /*#__PURE__*/function (_Component) {
  _inheritsLoose(CustomTooltip, _Component);

  function CustomTooltip(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    _this.state = {};
    return _this;
  }

  var _proto = CustomTooltip.prototype;

  _proto.render = function render() {
    var placement = this.props.placement || "top";
    var delay = this.props.delay || {
      show: 250,
      hide: 400
    };
    var tooltip = this.props.tooltip || "";
    var children = this.props.children || /*#__PURE__*/React.createElement("div", null, "Error children");
    return /*#__PURE__*/React.createElement(OverlayTrigger, {
      placement: placement,
      delay: {
        delay: delay
      },
      overlay: /*#__PURE__*/React.createElement(Tooltip, null, tooltip)
    }, children);
  };

  return CustomTooltip;
}(Component);

export { CustomTooltip as Tooltip };
//# sourceMappingURL=index.modern.js.map
