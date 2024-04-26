import React, { useRef } from 'react';
import { Form, Input, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadImageForm = () => {
  const formRef = useRef(null); // Ref to the form

  const handleButtonClick = () => {
    if (formRef.current) {
      formRef.current.submit(); // Submit the form
    }
  };

  const onFinish = (values) => {
    console.log('Received values:', values);
    // Handle form submission, e.g., send data to server
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (<>
    <Form
      ref={formRef}
      name="upload-image-form"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[
          {
            required: true,
            message: 'Please input the title!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="image"
        label="Image"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[
          {
            required: true,
            message: 'Please upload an image!',
          },
        ]}
      >
        <Upload name="logo" action="/upload.do" listType="picture">
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    <Button type="primary" onClick={handleButtonClick}>
      Submit
    </Button>
  </>
  );
};

export default UploadImageForm;
