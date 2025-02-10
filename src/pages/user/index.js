import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Table,
  Modal,
  Select,
  DatePicker,
  InputNumber,
  Popconfirm,
} from 'antd';
import './user.less';
import userApi from '../../services/api/user';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';

const { getUsers, addUser, editUser, deleteUser } = userApi;
const User = () => {
  const [searchParameters, setSearchParameters] = useState({
    name: '',
  });
  const [tableData, setTableData] = useState([]);
  // 0（新增）1（编辑）
  const [modalType, setModalType] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 创建搜索form实例
  const [searchForm] = useForm();
  // 搜索事件
  const handleSearch = (val) => {
    console.log(val, 'val');
    setSearchParameters({
      name: val.keyword,
    });
  };
  const onReset = () => {
    searchForm.resetFields();
    setSearchParameters({ name: '' });
  };
  useEffect(() => {
    getTableData();
  }, [searchParameters]);
  // 创建弹窗form实例
  const [form] = useForm();
  const handleClick = (type, rowData) => {
    setIsModalOpen(true);
    if (type === 'add') {
      setModalType(0);
    } else {
      const cloneData = JSON.parse(JSON.stringify(rowData));
      cloneData.birth = dayjs(rowData.birth);
      setModalType(1);
      form.setFieldsValue(cloneData);
    }
  };
  const handleDelete = ({ id }) => {
    deleteUser({ id }).then(() => {
      getTableData();
    });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  // 成功提交的事件
  const handleOk = async () => {
    try {
      const val = await form.validateFields();
      // 日期参数
      val.birth = dayjs(val.birth).format('YYYY-MM-DD');
      if (modalType) {
        // 编辑
        await editUser(val);
      } else {
        // 新增
        await addUser(val);
      }
      handleCancel();
      getTableData();
    } catch (err) {
      console.log(err); // 捕获表单验证或请求错误
    }
  };

  // 请求列表
  const getTableData = () => {
    getUsers(searchParameters).then(({ data }) => {
      setTableData(data.list);
    });
  };
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: (val) => {
        return val ? '女' : '男';
      },
    },
    {
      title: '出生日期',
      dataIndex: 'birth',
    },
    {
      title: '地址',
      dataIndex: 'addr',
    },
    {
      title: '操作',
      render: (rowData) => {
        return (
          <div className="flex-box">
            <Button
              style={{ marginRight: '5px' }}
              onClick={() => handleClick('edit', rowData)}
            >
              编辑
            </Button>
            <Popconfirm
              title="提示"
              description="此操作将删除该用户, 是否继续?"
              okText="确认"
              cancelText="取消"
              onConfirm={() => handleDelete(rowData)}
            >
              <Button type="primary" danger>
                删除
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    getTableData();
  }, []);
  return (
    <div className="user">
      <Form form={searchForm} layout="inline" onFinish={handleSearch}>
        <Form.Item label="用户名：" name="keyword" style={{ marginBottom: 10 }}>
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item label="年龄：" name="age" style={{ marginBottom: 10 }}>
          <Input placeholder="请输入年龄" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 16 }}>
          <Button htmlType="submit" type="primary" style={{ marginRight: 16 }}>
            搜索
          </Button>
          <Button
            htmlType="button"
            onClick={onReset}
            style={{ marginRight: 16 }}
          >
            重置
          </Button>
        </Form.Item>
      </Form>

      <Button
        type="primary"
        onClick={() => handleClick('add')}
        style={{ margin: '0 16px 16px 0' }}
      >
        新增
      </Button>

      <Table columns={columns} dataSource={tableData} rowKey={'id'} />
      <Modal
        open={isModalOpen}
        title={modalType ? '编辑用户' : '新增用户'}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          labelAlign="left"
        >
          {modalType == 1 && (
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          )}
          <Form.Item
            label="姓名"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入姓名',
              },
            ]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            label="年龄"
            name="age"
            rules={[
              {
                type: 'number',
                message: '年龄必须是数字',
              },
              {
                required: true,
                message: '请输入年龄',
              },
            ]}
          >
            <InputNumber placeholder="请输入年龄" />
          </Form.Item>
          <Form.Item
            label="性别"
            name="sex"
            rules={[
              {
                required: true,
                message: '性别是必选项',
              },
            ]}
          >
            <Select
              placeholder="请选择性别"
              options={[
                { value: 0, label: '男' },
                { value: 1, label: '女' },
              ]}
            ></Select>
          </Form.Item>
          <Form.Item
            label="出生日期"
            name="birth"
            rules={[
              {
                required: true,
                message: '请选择出生日期',
              },
            ]}
          >
            <DatePicker placeholder="请选择" format="YYYY/MM/DD" />
          </Form.Item>
          <Form.Item
            label="地址"
            name="addr"
            rules={[
              {
                required: true,
                message: '请填写地址',
              },
            ]}
          >
            <Input placeholder="请填写地址" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default User;
