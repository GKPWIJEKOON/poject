import React, { useEffect, useState } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { 
  createLearningPlan, 
  getLearningPlans, 
  updateLearningPlan, 
  deleteLearningPlan,
  addTopicToPlan,
  updateTopic,
  deleteTopic,
  addResourceToTopic,
  updateResource,
  deleteResource
} from '../../Redux/LearningPlan/Action';
import { Button, Modal, Form, Input, DatePicker, Checkbox, List, Card, Space, message, Collapse, Tag, Alert, Spin } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  LinkOutlined,
  FileAddOutlined,
  BookOutlined
} from '@ant-design/icons';
import moment from 'moment';
import "./LearningPlan.css";

const { Panel } = Collapse;
const { TextArea } = Input;

const LearningPlan = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { learningPlan } = useSelector((store) => store);
  const [planForm] = Form.useForm();
  const [topicForm] = Form.useForm();
  const [resourceForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePanelKey, setActivePanelKey] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planModal, setPlanModal] = useState({ visible: false, mode: 'create', currentPlan: null });
  const [topicModal, setTopicModal] = useState({ visible: false, mode: 'create', currentTopic: null, planId: null });
  const [resourceModal, setResourceModal] = useState({ visible: false, mode: 'create', currentResource: null, topicId: null });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        if (isMounted) setLoading(true);
        await dispatch(getLearningPlans(token));
      } catch (err) {
        if (isMounted) setError("Failed to load learning plans. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (token) fetchData();
    return () => { isMounted = false; };
  }, [dispatch, token]);

  const handleCreatePlan = async (values) => {
    try {
      await dispatch(createLearningPlan({ jwt: token, planData: values }));
      setPlanModal({ ...planModal, visible: false });
      planForm.resetFields();
      message.success('Learning plan created successfully');
    } catch (err) {
      message.error(err.message || 'Failed to create learning plan');
    }
  };

  const handleUpdatePlan = async (values) => {
    try {
      await dispatch(updateLearningPlan({ jwt: token, planId: planModal.currentPlan.id, planData: values }));
      setPlanModal({ ...planModal, visible: false });
      planForm.resetFields();
      message.success('Learning plan updated successfully');
    } catch (err) {
      message.error(err.message || 'Failed to update learning plan');
    }
  };

  const handleDeletePlan = (planId) => {
    Modal.confirm({
      title: 'Delete Learning Plan',
      content: 'Are you sure you want to delete this learning plan?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await dispatch(deleteLearningPlan({ jwt: token, planId }));
          message.success('Learning plan deleted successfully');
        } catch (err) {
          message.error(err.message || 'Failed to delete learning plan');
        }
      }
    });
  };

  const handleCreateTopic = async (values) => {
    try {
      if (!topicModal.planId) {
        message.error('No plan selected for the topic');
        return;
      }
      await dispatch(addTopicToPlan({
        jwt: token,
        planId: topicModal.planId,
        topicData: {
          ...values,
          targetCompletionDate: values.targetCompletionDate?.format('YYYY-MM-DD') || null
        }
      }));
      setTopicModal({ ...topicModal, visible: false });
      topicForm.resetFields();
      message.success('Topic added successfully');
    } catch (err) {
      message.error(err.message || 'Failed to add topic');
    }
  };

  const handleUpdateTopic = async (values) => {
    try {
      await dispatch(updateTopic({
        jwt: token,
        topicId: topicModal.currentTopic.id,
        topicData: {
          ...values,
          targetCompletionDate: values.targetCompletionDate?.format('YYYY-MM-DD') || null
        }
      }));
      setTopicModal({ ...topicModal, visible: false });
      topicForm.resetFields();
      message.success('Topic updated successfully');
    } catch (err) {
      message.error(err.message || 'Failed to update topic');
    }
  };

  const handleDeleteTopic = (topicId) => {
    Modal.confirm({
      title: 'Delete Topic',
      content: 'Are you sure you want to delete this topic?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await dispatch(deleteTopic({ jwt: token, topicId }));
          message.success('Topic deleted successfully');
        } catch (err) {
          message.error(err.message || 'Failed to delete topic');
        }
      }
    });
  };

  const handleCreateResource = async (values) => {
    try {
      await dispatch(addResourceToTopic({
        jwt: token,
        topicId: resourceModal.topicId,
        resourceData: values
      }));
      setResourceModal({ ...resourceModal, visible: false });
      resourceForm.resetFields();
      message.success('Resource added successfully');
    } catch (err) {
      message.error(err.message || 'Failed to add resource');
    }
  };

  const handleUpdateResource = async (values) => {
    try {
      await dispatch(updateResource({
        jwt: token,
        resourceId: resourceModal.currentResource.id,
        resourceData: values
      }));
      setResourceModal({ ...resourceModal, visible: false });
      resourceForm.resetFields();
      message.success('Resource updated successfully');
    } catch (err) {
      message.error(err.message || 'Failed to update resource');
    }
  };

  const handleDeleteResource = (resourceId) => {
    Modal.confirm({
      title: 'Delete Resource',
      content: 'Are you sure you want to delete this resource?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await dispatch(deleteResource({ jwt: token, resourceId }));
          message.success('Resource deleted successfully');
        } catch (err) {
          message.error(err.message || 'Failed to delete resource');
        }
      }
    });
  };

  const showPlanModal = (mode = 'create', plan = null) => {
    setPlanModal({ visible: true, mode, currentPlan: plan });
    if (mode === 'edit') {
      planForm.setFieldsValue({ title: plan.title, description: plan.description });
    }
  };

  const showTopicModal = (mode = 'create', topic = null, planId = null) => {
    setTopicModal({ visible: true, mode, currentTopic: topic, planId });
    if (mode === 'edit') {
      topicForm.setFieldsValue({
        title: topic.title,
        description: topic.description,
        completed: topic.completed,
        targetCompletionDate: topic.targetCompletionDate ? moment(topic.targetCompletionDate) : null
      });
    }
  };

  const showResourceModal = (mode = 'create', resource = null, topicId = null) => {
    setResourceModal({ visible: true, mode, currentResource: resource, topicId });
    if (mode === 'edit') {
      resourceForm.setFieldsValue({
        url: resource.url,
        description: resource.description
      });
    }
  };

  const handlePanelChange = (key) => {
    setActivePanelKey(key);
    if (key.length > 0) {
      const planId = key[0];
      const selected = learningPlan.plans.find(plan => plan.id === planId);
      setSelectedPlan(selected);
    } else {
      setSelectedPlan(null);
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <Alert message="Error" description={error} type="error" showIcon />
        <Button type="primary" onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Spin size="large" />
        <p>Loading your learning plans...</p>
      </div>
    );
  }

  return (
    <div className="learning-plan-container p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">My Learning Plans</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showPlanModal('create')}>
          New Plan
        </Button>
      </div>

      <Input.Search
        placeholder="Search by title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        allowClear
        style={{ maxWidth: 300, marginBottom: 16 }}
      />

      {learningPlan.plans.length === 0 ? (
        <Alert message="No learning plans found." type="info" showIcon />
      ) : (
        <Collapse
          activeKey={activePanelKey}
          onChange={handlePanelChange}
          accordion
        >
          {learningPlan.plans
            .filter(plan => plan.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(plan => (
              <Panel
                header={<span className="font-medium">{plan.title}</span>}
                key={plan.id}
                extra={
                  <Space>
                    <EditOutlined onClick={(e) => { e.stopPropagation(); showPlanModal('edit', plan); }} />
                    <DeleteOutlined onClick={(e) => { e.stopPropagation(); handleDeletePlan(plan.id); }} />
                  </Space>
                }
              >
                <p className="mb-4 text-gray-600">{plan.description}</p>
                <div className="flex justify-end mb-4">
                  <Button icon={<BookOutlined />} onClick={() => showTopicModal('create', null, plan.id)}>Add Topic</Button>
                </div>
                {plan.topics.map(topic => (
                  <Card key={topic.id} title={topic.title} size="small" style={{ marginBottom: '16px' }}
                    extra={
                      <Space>
                        <EditOutlined onClick={() => showTopicModal('edit', topic, plan.id)} />
                        <DeleteOutlined onClick={() => handleDeleteTopic(topic.id)} />
                      </Space>
                    }
                  >
                    <p>{topic.description}</p>
                    <p>Status: <Tag color={topic.completed ? 'green' : 'orange'}>{topic.completed ? 'Completed' : 'Pending'}</Tag></p>
                    <p>Target Date: {topic.targetCompletionDate ? moment(topic.targetCompletionDate).format('LL') : 'N/A'}</p>
                    <div className="flex justify-end">
                      <Button icon={<FileAddOutlined />} onClick={() => showResourceModal('create', null, topic.id)}>
                        Add Resource
                      </Button>
                    </div>
                    {topic.resources.map(resource => (
                      <Card key={resource.id} title={resource.url} size="small" style={{ marginTop: '8px' }}
                        extra={
                          <Space>
                            <EditOutlined onClick={() => showResourceModal('edit', resource, topic.id)} />
                            <DeleteOutlined onClick={() => handleDeleteResource(resource.id)} />
                          </Space>
                        }
                      >
                        <p>{resource.description}</p>
                      </Card>
                    ))}
                  </Card>
                ))}
              </Panel>
            ))}
        </Collapse>
      )}

      {/* Modals below — with added description validation */}
      <Modal visible={planModal.visible} title={planModal.mode === 'create' ? 'Create Plan' : 'Edit Plan'} onCancel={() => setPlanModal({ ...planModal, visible: false })} footer={null} centered>
        <Form form={planForm} onFinish={planModal.mode === 'create' ? handleCreatePlan : handleUpdatePlan}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter the title of the plan' }]}>
            <Input placeholder="Enter title" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: 'Please enter a description' },
              { min: 10, message: 'Description must be at least 10 characters' }
            ]}
          >
            <TextArea placeholder="Enter description" rows={4} />
          </Form.Item>
          <div className="text-center">
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={loading}>
              {planModal.mode === 'create' ? 'Create Plan' : 'Update Plan'}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal visible={topicModal.visible} title={topicModal.mode === 'create' ? 'Create Topic' : 'Edit Topic'} onCancel={() => setTopicModal({ ...topicModal, visible: false })} footer={null} centered>
        <Form form={topicForm} onFinish={topicModal.mode === 'create' ? handleCreateTopic : handleUpdateTopic}>
          <Form.Item name="title" label="Topic Title" rules={[{ required: true, message: 'Please enter a topic title' }]}>
            <Input placeholder="Enter topic title" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: 'Please enter topic description' },
              { min: 10, message: 'Description must be at least 10 characters' }
            ]}
          >
            <TextArea placeholder="Enter description" rows={4} />
          </Form.Item>
          <Form.Item name="completed" valuePropName="checked" label="Completed">
            <Checkbox>Is this topic completed?</Checkbox>
          </Form.Item>
          <Form.Item name="targetCompletionDate" label="Target Completion Date">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <div className="text-center">
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={loading}>
              {topicModal.mode === 'create' ? 'Create Topic' : 'Update Topic'}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal visible={resourceModal.visible} title={resourceModal.mode === 'create' ? 'Create Resource' : 'Edit Resource'} onCancel={() => setResourceModal({ ...resourceModal, visible: false })} footer={null} centered>
        <Form form={resourceForm} onFinish={resourceModal.mode === 'create' ? handleCreateResource : handleUpdateResource}>
          <Form.Item name="url" label="Resource URL" rules={[{ required: true, message: 'Please provide a URL for the resource' }]}>
            <Input prefix={<LinkOutlined />} placeholder="Enter URL" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Resource Description"
            rules={[
              { required: true, message: 'Please provide a description of the resource' },
              { min: 10, message: 'Description must be at least 10 characters' }
            ]}
          >
            <TextArea rows={4} placeholder="Enter description" />
          </Form.Item>
          <div className="text-center">
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={loading}>
              {resourceModal.mode === 'create' ? 'Create Resource' : 'Update Resource'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default LearningPlan;
