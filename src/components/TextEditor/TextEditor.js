import React, { Component } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Row, Col, Typography } from "antd";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Text = Typography.Text;
const _ = require('lodash');

class MainTextEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: null,
            defaultState: EditorState.createEmpty(),
            error_message: this.props.error_message,
            MAX_LENGTH: this.props.maxLengthData ? this.props.maxLengthData : 1000000000000
        };

        this.parseData = this.parseData.bind(this);
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
    }

    /*************************************************************************/
    /************************** STANDARD *************************************/
    /*************************************************************************/
    componentDidMount() {
        try {
            var data = this.props.data;
            var lang = this.props.lang;
            this.parseData(data, lang);
        } catch (e) {
            console.warn("Error in TextEditor component; " + e);
        }
    }

    componentWillReceiveProps(nextProps) {
        var curr_lang = this.state.lang;
        var next_lang = nextProps.lang;
        if (next_lang != null && curr_lang != next_lang) {
            this.parseData(this.props.data, nextProps.lang);
        }

        if (nextProps.data != this.state.data) {
            this.parseData(nextProps.data, this.props.lang);
        }
        if (nextProps.error_message != this.state.error_message) {
            this.setState({
                error_message: nextProps.error_message
            })
        }
    }

    parseData(data, lang) {
        if (data != null) {
            var tmp = htmlToDraft(data);
            tmp = ContentState.createFromBlockArray(tmp);
            tmp = EditorState.createWithContent(tmp);

            this.setState({
                lang: lang,
                data: data,
                defaultState: EditorState.moveFocusToEnd(tmp)
            })
        } else {
            this.setState({
                lang: lang
            })
        }
    }

    /*************************************************************************/
    /************************** STANDARD *************************************/
    /*************************************************************************/
    uploadImageCallBack = (file) => {
        if (this.props.onUploadImage) {
            //TODO:
        }
        // return new Promise((resolve, reject) => {
        //     const xhr = new XMLHttpRequest();
        //     var url = API.API_BASE_URL + "/Containers/" + this.props.type + "/upload"
        //     xhr.open("POST", url);
        //     const data = new FormData();
        //     data.append("data", file);
        //     xhr.send(data);
        //     xhr.addEventListener("load", () => {
        //         const res = JSON.parse(xhr.responseText);
        //         if (res.result) {
        //             const response = JSON.parse(
        //                 '{ "data": {"link": "' +
        //                 API.API_BASE_URL +
        //                 "/Containers/" +
        //                 this.props.type +
        //                 "/download/" +
        //                 res.result.files.data[0].name +
        //                 '" }}'
        //             );
        //             resolve(response);
        //         } else {
        //             reject(new Error("Unable to upload image!"));
        //         }
        //     });
        //     xhr.addEventListener("error", () => {
        //         const error = JSON.parse(xhr.responseText);
        //         reject(error);
        //     });
        // });
    };

    clearText = (text) => {
        var rx = /(<img.*float:.*\/>*)/g;
        var str = text;

        String.prototype.insert = function (index, string) {
            if (index > 0)
                return (
                    this.substring(0, index + 1) +
                    string +
                    this.substring(index + 1, this.length)
                );
            else return string + this;
        };

        var match;
        var str2 = "";

        while ((match = rx.exec(str))) {
            var str2 = str.insert(
                rx.lastIndex - 1,
                '<div style="clear: both;"></div>'
            );
        }

        if (str2 == "") {
            return str;
        } else {
            return str2;
        }
    };
    _getLengthOfSelectedText = () => {
        const currentSelection = this.state.defaultState.getSelection();
        const isCollapsed = currentSelection.isCollapsed();

        let length = 0;

        if (!isCollapsed) {
            const currentContent = this.state.defaultState.getCurrentContent();
            const startKey = currentSelection.getStartKey();
            const endKey = currentSelection.getEndKey();
            const startBlock = currentContent.getBlockForKey(startKey);
            const isStartAndEndBlockAreTheSame = startKey === endKey;
            const startBlockTextLength = startBlock.getLength();
            const startSelectedTextLength = startBlockTextLength - currentSelection.getStartOffset();
            const endSelectedTextLength = currentSelection.getEndOffset();
            const keyAfterEnd = currentContent.getKeyAfter(endKey);
            console.log(currentSelection);
            if (isStartAndEndBlockAreTheSame) {
                length +=
                    currentSelection.getEndOffset() - currentSelection.getStartOffset();
            } else {
                let currentKey = startKey;

                while (currentKey && currentKey !== keyAfterEnd) {
                    if (currentKey === startKey) {
                        length += startSelectedTextLength + 1;
                    } else if (currentKey === endKey) {
                        length += endSelectedTextLength;
                    } else {
                        length += currentContent.getBlockForKey(currentKey).getLength() + 1;
                    }

                    currentKey = currentContent.getKeyAfter(currentKey);
                }
            }
        }

        return length;
    };

    // _handleBeforeInput = () => {
    //   const currentContent = this.state.defaultState.getCurrentContent();
    //   const currentContentLength = currentContent.getPlainText("").length;
    //   const selectedTextLength = this._getLengthOfSelectedText();

    //   if (currentContentLength - selectedTextLength > this.state.MAX_LENGTH - 1) {
    //     console.error("you can type max ten characters");

    //     return "handled";
    //   }
    // };

    // _handlePastedText = (pastedText) => {
    //   const currentContent = this.state.defaultState.getCurrentContent();
    //   const currentContentLength = currentContent.getPlainText("").length;
    //   const selectedTextLength = this._getLengthOfSelectedText();

    //   if (
    //     currentContentLength + pastedText.length - selectedTextLength >
    //     this.state.MAX_LENGTH
    //   ) {
    //     console.log("you can type max ten characters");

    //     return "handled";
    //   }
    // };

    /*************************************************************************/
    /************************** RENDER ***************************************/
    /*************************************************************************/
    onEditorStateChange(editorState) {
        const editorValue = draftToHtml(
            convertToRaw(editorState.getCurrentContent())
        );

        var new_text = this.clearText(editorValue);
        this.setState({
            data: new_text,
            defaultState: editorState
        }, () => {
            this.props.onChange(new_text);
        });
    }

    /*************************************************************************/
    /************************** RENDER ***************************************/
    /*************************************************************************/
    render() {
        var readOnly = this.props.readOnly || this.props.disabled;

        var borderColor = this.state.error_message == null || this.state.error_message == "" ? "#d9d9d9" : "#ff4d4f";
        var toolbarStyle = { borderTopColor: "white", borderRightColor: "white", borderLeftColor: "white", borderBottomColor: "#d9d9d9" };
        var wrapperStyle = { border: "1px solid", borderColor: borderColor };
        if (readOnly == true) {
            wrapperStyle = { border: "1px solid", borderColor: borderColor, color: "rgba(0, 0, 0, 0.25)", backgroundColor: "#f5f5f5", cursor: "not-allowed", opacity: "1" };
        }

        var onChangeCallback = this.props.onChange;

        return (
            <div>
                {onChangeCallback == null &&
                    <div>
                        Missing 'onChange' props containing callback function.
                    </div>
                }
                {onChangeCallback != null &&
                    <div>
                        <Row>
                            <Col sm={24}>
                                <Editor
                                    readOnly={readOnly}
                                    toolbarHidden={readOnly}
                                    toolbarStyle={toolbarStyle}
                                    wrapperStyle={wrapperStyle}
                                    wrapperClassName="demo-wrapper"
                                    editorClassName="demo-editor"
                                    localization={{ locale: this.state.lang }}
                                    toolbar={{
                                        options: [
                                            "inline",
                                            "blockType",
                                            "fontSize",
                                            "list",
                                            "textAlign",
                                            "link",
                                            "image",
                                            "remove",
                                            "history",
                                        ],
                                        inline: { inDropdown: true },
                                        list: { inDropdown: true },
                                        textAlign: { inDropdown: true },
                                        link: { inDropdown: true },
                                        history: { inDropdown: true },
                                        image: {
                                            uploadCallback: this.uploadImageCallBack,
                                            previewImage: true,
                                            inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                                            alt: { present: true, mandatory: false },
                                            defaultSize: { width: "100%", height: "100%" },
                                        },
                                    }}
                                    editorState={this.state.defaultState}
                                    onEditorStateChange={this.onEditorStateChange}>
                                </Editor>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Text type="danger">{this.state.error_message}</Text>
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        );
    }
}

export default MainTextEditor;