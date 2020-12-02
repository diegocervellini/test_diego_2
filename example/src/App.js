import React from 'react'
import { Row, Col } from "antd";
import { ColorPicker, CropImage } from 'test_diego_2'
import 'test_diego_2/dist/index.css'

const App = () => {
  return (
    <div>
      <Row>
        <Col>
          <div>Color Picker</div>
          <div>
            <ColorPicker onChange={(r) => { console.error(r) }}></ColorPicker>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div>CropImage</div>
          <div>
            <CropImage onSave={() => { }} onClose={() => { }}></CropImage>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default App