import React, { Component } from "react";
import { Row, Col, Upload, Modal } from "antd";
import { UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";

import "./uploadImage.css";

class UploadImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            previewVisible: false,
            previewImage: null
        }

        this.onRemove = this.onRemove.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
        this.onSelectFile = this.onSelectFile.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    /*************************************************************************/
    /************************** STANDARD *************************************/
    /*************************************************************************/
    componentDidMount() {
        var initialList = this.props.defaultImagesList || [];
        this.setState({
            fileList: initialList
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.defaultImagesList != this.state.fileList) {
            this.setState({
                fileList: nextProps.defaultImagesList
            })
        }
    }

    /*************************************************************************/
    /************************** UPLOAD MANAGEMENT ****************************/
    /*************************************************************************/
    onRemove(file) {
        this.setState({
            fileList: []
        });
    };

    beforeUpload(file) {
        this.setState({
            fileList: [file],
            fileListimg: [file]
        });
        return false;
    };

    onSelectFile(file, list, e) {
        var self = this;
        if (file && file.file && file.fileList.length > 0) {
            const reader = new FileReader();
            const readFile = file.file;
            reader.addEventListener("load", () => {
                if (self.props.onceUploaded) {
                    var base64File = reader.result;
                    self.props.onceUploaded(base64File, readFile);
                }
            });
            reader.readAsDataURL(file.file);
        }
    };

    /*************************************************************************/
    /************************** MODAL ****************************************/
    /*************************************************************************/
    openModal(e) {
        if (e && e.url) {
            this.setState({
                previewVisible: true,
                previewImage: e.url
            })
        }
    }

    closeModal() {
        this.setState({
            previewVisible: false,
            previewImage: null
        })
    }

    /*************************************************************************/
    /************************** RENDER ***************************************/
    /*************************************************************************/
    render() {
        const { disabled } = this.props;

        var onceUploadedCallback = this.props.onceUploaded;
        return (
            <div>
                {onceUploadedCallback == null &&
                    <div>
                        Missing 'onceUploaded' props containing callback function.
                    </div>
                }
                {onceUploadedCallback != null &&
                    <div>
                        <Row>
                            <Col sm={24}>
                                <Upload
                                    disabled={disabled}
                                    accept="image/*"
                                    listType="picture-card"
                                    fileList={this.state.fileList}
                                    onRemove={this.onRemove}
                                    beforeUpload={this.beforeUpload}
                                    onChange={this.onSelectFile}
                                    onPreview={this.openModal}>
                                    {this.state.fileList.length == 0 &&
                                        <UploadOutlined />
                                    }
                                </Upload>

                                <Modal
                                    title={<div style={{ color: "rgba(255, 0, 0, 0.0)" }}>Preview</div>}
                                    closeIcon={<CloseCircleOutlined style={{ fontSize: 26, color: "grey" }} />}
                                    destroyOnClose={true}
                                    visible={this.state.previewVisible}
                                    footer={null}
                                    zIndex={1050}
                                    onCancel={this.closeModal}
                                    maskClosable={false}>
                                    <img
                                        alt="category"
                                        style={{ width: "100%" }}
                                        src={this.state.previewImage}
                                    />
                                </Modal>
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        )
    }
}
export default UploadImage;