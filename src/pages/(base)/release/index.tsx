import React from 'react';
import { Card, Row, Col, Statistic, Button, Space } from 'antd';
import { 
  AppstoreOutlined, 
  CloudUploadOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  PlusOutlined 
} from '@ant-design/icons';

const ReleaseSystemPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>
          <CloudUploadOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          发布系统
        </h1>
        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
          统一管理应用发布、部署和运维的综合性平台
        </p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总应用数"
              value={28}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="运行中"
              value={25}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="部署中"
              value={2}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="异常应用"
              value={1}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 快速操作 */}
      <Card title="快速操作" style={{ marginBottom: '24px' }}>
        <Space size="large">
          <Button type="primary" icon={<PlusOutlined />} size="large">
            新增应用
          </Button>
          <Button icon={<CloudUploadOutlined />} size="large">
            批量部署
          </Button>
          <Button icon={<AppstoreOutlined />} size="large">
            应用监控
          </Button>
        </Space>
      </Card>

      {/* 系统介绍 */}
      <Card title="系统介绍">
        <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#333' }}>
          发布系统是一个集应用管理、部署发布、监控运维于一体的综合性平台。
          通过统一的界面，您可以轻松管理所有应用的发布流程，实现自动化部署，
          提高开发效率，降低运维成本。
        </p>
        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          <Col span={8}>
            <h4 style={{ color: '#1890ff' }}>🎯 应用管理</h4>
            <p>统一管理所有应用的生命周期，包括创建、配置、部署和下线。</p>
          </Col>
          <Col span={8}>
            <h4 style={{ color: '#52c41a' }}>🚀 自动化部署</h4>
            <p>支持多种部署策略，实现一键部署，快速上线。</p>
          </Col>
          <Col span={8}>
            <h4 style={{ color: '#722ed1' }}>📊 监控运维</h4>
            <p>实时监控应用状态，提供详细的运行数据和告警信息。</p>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export const handle = {
  i18nKey: 'route.(base)_release',
  title: '发布系统',
  icon: 'mdi:rocket',
  order: 2
};

export default ReleaseSystemPage;
