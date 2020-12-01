import React, { Component } from "react";
import styles from './styles.module.css'

export const ExampleComponent = ({ text }) => {
  return <div className={styles.test}>Example Component: {text}</div>
}

export class Pippo extends Component {
  constructor() {
    super();

    this.state = {
      text: "TEXT DEFAULT!!"
    }
  }

  componentDidMount() {
    this.setState({
      text: this.props.text || this.state.text
    })
  }

  render() {
    return (
      <div>
        {this.state.text}
      </div>
    )
  }
}