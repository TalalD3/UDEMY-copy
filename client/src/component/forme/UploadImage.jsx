import { Button, Form, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

const UploadImage = () => {
    const [image, setImage] = useState([]);
    const [fileList, setFileList] = useState([]);

    const cloudName = import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME;
    const resourceType = 'image';

    return(
    <>
        <span className='filed-title mr'>Course Image </span>
        <Form.Item
            name="image"
            valuePropName='fileList'
            getValueFromEvent={(event) => event?.fileList}
            style={{ width: "100%", marginRight: 0, marginTop: 10 }}
            rules={[{ required: true, message: 'Please insert one image' }]}
        >
            <ImgCrop rotationSlider aspect={5 / 3} >
                <Upload
                    // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    defaultFileList={fileList}
                    listType="picture"
                    maxCount={1}
                    onChange={(e) => setFileList([e.file])}
                // customRequest={(e) => setFileList([e.file])}
                >
                    <Button icon={<UploadOutlined />}>Add</Button>
                    {/* <img src={URL.createObjectURL(fileList)} /> */}
                    {
                        // fileList[0]?.name
                    }
                </Upload>
            </ImgCrop>
        </Form.Item>
    </>




    );
};
export default UploadImage;