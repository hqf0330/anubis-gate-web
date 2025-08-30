import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  Space, 
  message, 
  Divider,
  Row,
  Col,
  Radio
} from 'antd';
import { 
  PlusOutlined, 
  CloudUploadOutlined,
  AppstoreOutlined,
  UserOutlined,
  BranchesOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;

interface NewApplicationForm {
  name: string;
  description: string;
  gitUrl: string;
  branch: string;
  framework: string;
  buildCommand: string;
  outputDir: string;
  environment: string;
  owner: string;
  autoDeploy: boolean;
}

const NewApplicationPage: React.FC = () => {
  const [form] = Form.useForm<NewApplicationForm>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 预设的框架选项
  const frameworkOptions = [
    { label: 'React + Vite', value: 'react-vite' },
    { label: 'Vue + Vite', value: 'vue-vite' },
    { label: 'Angular', value: 'angular' },
    { label: 'Next.js', value: 'nextjs' },
    { label: 'Nuxt.js', value: 'nuxtjs' },
    { label: 'Svelte', value: 'svelte' },
    { label: '其他', value: 'other' }
  ];

  // 环境选项
  const environmentOptions = [
    { label: '开发环境', value: 'dev' },
    { label: '测试环境', value: 'test' },
    { label: '预发布环境', value: 'staging' },
    { label: '生产环境', value: 'prod' }
  ];

  const handleSubmit = async (values: NewApplicationForm) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('应用创建成功！');
      message.info('正在为您创建应用，请稍后查看应用列表');
      
      // 跳转到应用列表页面
      navigate('/release/applications');
    } catch (error) {
      message.error('创建失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/release/applications');
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>
          <PlusOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          新增应用
        </h1>
        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
          快速创建新的前端应用，配置发布参数
        </p>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            framework: 'react-vite',
            environment: 'dev',
            autoDeploy: true,
            buildCommand: 'npm run build',
            outputDir: 'dist'
          }}
        >
          {/* 基本信息 */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1890ff' }}>
              <AppstoreOutlined style={{ marginRight: '8px' }} />
              基本信息
            </h3>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="应用名称"
                  rules={[
                    { required: true, message: '请输入应用名称' },
                    { pattern: /^[a-z][a-z0-9_-]*$/, message: '应用名称只能包含小写字母、数字、下划线和连字符，且必须以字母开头' },
                    { max: 30, message: '应用名称不能超过30个字符' }
                  ]}
                >
                  <Input 
                    placeholder="请输入应用名称，如：my-app"
                    prefix={<AppstoreOutlined />}
                  />
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="framework"
                  label="技术框架"
                  rules={[{ required: true, message: '请选择技术框架' }]}
                >
                  <Select placeholder="选择技术框架">
                    {frameworkOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="应用描述"
              rules={[{ required: true, message: '请输入应用描述' }]}
            >
              <TextArea 
                rows={3}
                placeholder="请简要描述应用的功能和用途"
                maxLength={200}
                showCount
              />
            </Form.Item>
          </div>

          <Divider />

          {/* 代码仓库配置 */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#52c41a' }}>
              <BranchesOutlined style={{ marginRight: '8px' }} />
              代码仓库配置
            </h3>
            
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item
                  name="gitUrl"
                  label="Git 仓库地址"
                  rules={[
                    { required: true, message: '请输入Git仓库地址' },
                    { type: 'url', message: '请输入有效的URL地址' }
                  ]}
                >
                  <Input 
                    placeholder="https://github.com/username/repository.git"
                    prefix={<BranchesOutlined />}
                  />
                </Form.Item>
              </Col>
              
              <Col span={8}>
                <Form.Item
                  name="branch"
                  label="默认分支"
                  rules={[{ required: true, message: '请输入默认分支' }]}
                >
                  <Input 
                    placeholder="main 或 master"
                    defaultValue="main"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* 构建配置 */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#722ed1' }}>
              <SettingOutlined style={{ marginRight: '8px' }} />
              构建配置
            </h3>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="buildCommand"
                  label="构建命令"
                  rules={[{ required: true, message: '请输入构建命令' }]}
                >
                  <Input 
                    placeholder="npm run build"
                    addonBefore="构建命令"
                  />
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="outputDir"
                  label="输出目录"
                  rules={[{ required: true, message: '请输入输出目录' }]}
                >
                  <Input 
                    placeholder="dist"
                    addonBefore="输出目录"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* 部署配置 */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#fa8c16' }}>
              <CloudUploadOutlined style={{ marginRight: '8px' }} />
              部署配置
            </h3>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="environment"
                  label="部署环境"
                  rules={[{ required: true, message: '请选择部署环境' }]}
                >
                  <Select placeholder="选择部署环境">
                    {environmentOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="owner"
                  label="负责人"
                  rules={[{ required: true, message: '请输入负责人' }]}
                >
                  <Input 
                    placeholder="请输入负责人姓名"
                    prefix={<UserOutlined />}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="autoDeploy"
              label="自动部署"
            >
              <Radio.Group>
                <Radio value={true}>启用</Radio>
                <Radio value={false}>禁用</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          {/* 操作按钮 */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Space size="large">
              <Button 
                size="large" 
                onClick={handleCancel}
                style={{ minWidth: '120px' }}
              >
                取消
              </Button>
              <Button 
                type="primary" 
                size="large" 
                htmlType="submit"
                loading={loading}
                icon={<PlusOutlined />}
                style={{ minWidth: '120px' }}
              >
                {loading ? '创建中...' : '创建应用'}
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default NewApplicationPage;

export const handle = {
  i18nKey: 'route.(base)_release_applications_new',
  title: '新增应用',
  icon: 'mdi:plus-circle',
  order: 2
};
  