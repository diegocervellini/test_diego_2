import React, { Component } from "react";
import { Row, Col, Tooltip } from "antd";
import { CloseCircleOutlined, SaveOutlined, DownloadOutlined } from "@ant-design/icons";
import uuidV4 from "uuid/v4";
import Resizer from 'react-image-file-resizer';
import Cropper from 'cropperjs';

import ImageService from "./ImageService";

import "./cropper.css"

// https://fengyuanchen.github.io/cropperjs/


class CropImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            src: null,
            croppedImageUrl: null
        }

        this.downloadCroppedImg = this.downloadCroppedImg.bind(this);
        this.fileChangedHandler = this.fileChangedHandler.bind(this);
        this.parseCroppedImage = this.parseCroppedImage.bind(this);
    }

    /*************************************************************************/
    /************************** STANDARD *************************************/
    /*************************************************************************/
    componentDidMount() {
        var self = this;

        var src = this.props.src;
        var fileSrc = this.props.fileSrc;
        this.fileChangedHandler(fileSrc)
            .then((res) => {
                self.setState({
                    src: res
                }, () => {

                    const image = document.getElementById('image');
                    self.cropper = new Cropper(image, {
                        zoomable: false,
                        data: {
                            x: 0,
                            y: 0,
                            width: self.props.startWidthCrop,
                            height: self.props.startHeightCrop
                        },
                        crop(event) {
                            var width = event.detail.width;
                            var height = event.detail.height;

                            var minCroppedWidth = self.props.minWidth;
                            var maxCroppedWidth = self.props.minWidth;
                            var minCroppedHeight = self.props.minHeight;
                            var maxCroppedHeight = self.props.maxHeight;

                            if (
                                width < minCroppedWidth
                                || height < minCroppedHeight
                                || width > maxCroppedWidth
                                || height > maxCroppedHeight
                            ) {
                                self.cropper.setData({
                                    width: Math.max(minCroppedWidth, Math.min(maxCroppedWidth, width)),
                                    height: Math.max(minCroppedHeight, Math.min(maxCroppedHeight, height)),
                                });
                            }
                        },
                        cropend(event) {
                            var croppedCanvas = self.cropper.getCroppedCanvas();

                            var result = document.getElementById('result');
                            result.innerHTML = '';
                            result.appendChild(croppedCanvas);

                            self.setState({
                                croppedImageUrl: croppedCanvas.toDataURL()
                            })
                        }
                    });

                })
            })
            .catch((e) => {
                self.setState({
                    src: src
                })
            })
    }

    fileChangedHandler(input) {
        var self = this;
        return new Promise(function (resolve, reject) {
            try {
                var newWidth = self.props.imgWidth;
                var newHeight = self.props.imgHeight;
                if (input && (newWidth != null || newHeight != null)) {
                    Resizer.imageFileResizer(
                        input,
                        newWidth,
                        newHeight,
                        'PNG',
                        100,
                        0,
                        uri => {
                            resolve(uri);
                        },
                        'base64',
                        newWidth,
                        newHeight
                    );
                }
            } catch (e) {
                console.error("Error resizing image; " + e);
                reject(e);
            }
        })
    }

    /*************************************************************************/
    /************************** UPLOAD MANAGEMENT ****************************/
    /*************************************************************************/
    downloadCroppedImg() {
        if (this.state.croppedImageUrl != null) {
            fetch(this.state.croppedImageUrl, {
                method: "GET",
                headers: {}
            })
                .then(response => {
                    response.arrayBuffer().then(function (buffer) {
                        const url = window.URL.createObjectURL(new Blob([buffer]));
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", "image.png"); //or any other extension
                        document.body.appendChild(link);
                        link.click();
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    parseCroppedImage() {
        var self = this;
        var cropImg = this.state.croppedImageUrl;
        fetch(cropImg)
            .then((result) => {
                return result.blob();
            })
            .then((blobFile) => {
                return new File([blobFile], "cropped.png", { type: "image/png" });
            })
            .then((newFile) => {
                newFile.uid = uuidV4();
                newFile.url = cropImg;

                return ImageService.batchCompress(newFile);
            })
            .then((response) => {
                var files = response.map(f => {
                    f.uid = uuidV4();
                    return f;
                });

                self.props.onSave(cropImg, files)
            })
    }

    /*************************************************************************/
    /************************** RENDER ***************************************/
    /*************************************************************************/
    render() {
        var localization = this.props.localization != null ? this.props.localization : {};
        var onSaveCallback = this.props.onSave;
        var onCloseCallback = this.props.onClose;

        return (
            <div>
                {onSaveCallback == null &&
                    <div>
                        Missing 'onSave' props containing callback function.
                    </div>
                }
                {onCloseCallback == null &&
                    <div>
                        Missing 'onClose' props containing callback function.
                    </div>
                }
                {onSaveCallback != null && onCloseCallback != null &&
                    <div>
                        <Row style={{ paddingBottom: "1rem", textAlign: "right" }}>
                            <Col sm={24}>
                                <div className="float-right">
                                    {this.state.src != null && this.state.croppedImageUrl != null &&
                                        <Tooltip title={"Download"}>
                                            <DownloadOutlined
                                                style={{ "fontSize": 26, "color": "#1890ff" }}
                                                onClick={this.downloadCroppedImg} />
                                        </Tooltip>
                                    }
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {this.state.src != null && this.state.croppedImageUrl != null &&
                                        <Tooltip title={localization.Save || "Save"}>
                                            <SaveOutlined
                                                style={{ "fontSize": 26, "color": "#1890ff" }}
                                                onClick={() => { this.parseCroppedImage() }} />
                                        </Tooltip>
                                    }
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <Tooltip title={localization.Cancel || "Cancel"}>
                                        <CloseCircleOutlined
                                            style={{ fontSize: 26, color: "grey" }}
                                            onClick={onCloseCallback} />
                                    </Tooltip>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <img style={{ width: "100%", overflowX: "scroll", overflowY: "scroll" }} id="image" src={this.state.src} />
                            </Col>
                            <Col sm={12}>
                                <div style={{ width: "100%", overflowX: "scroll", overflowY: "scroll" }} id="result" />
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        )
    }
}
export default CropImage;