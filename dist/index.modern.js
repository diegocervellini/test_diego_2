import React, { Component } from 'react';

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var styles = {"test":"_3ybTi"};

var ExampleComponent = function ExampleComponent(_ref) {
  var text = _ref.text;
  return /*#__PURE__*/React.createElement("div", {
    className: styles.test
  }, "Example Component: ", text);
};
var Pippo = /*#__PURE__*/function (_Component) {
  _inheritsLoose(Pippo, _Component);

  function Pippo() {
    var _this;

    _this = _Component.call(this) || this;
    _this.state = {
      text: "TEXT DEFAULT!!"
    };
    return _this;
  }

  var _proto = Pippo.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.setState({
      text: this.props.text || this.state.text
    });
  };

  _proto.render = function render() {
    return /*#__PURE__*/React.createElement("div", null, this.state.text);
  };

  return Pippo;
}(Component);

export { ExampleComponent, Pippo };
//# sourceMappingURL=index.modern.js.map
