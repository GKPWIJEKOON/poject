import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProgressUpdates,
  createProgressUpdate,
  updateProgressUpdate,
  deleteProgressUpdate
} from "../../Redux/LearningProgress/Action";
import {
  Button,
  Modal,
  Form,
  Input,
  List,
  message,
  Select
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  ToolOutlined,
  RocketOutlined
} from "@ant-design/icons";
import "./LearningProgress.css"; // 👈 Make sure this CSS file is created

const { Option } = Select;

const LearningProgress = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const { updates } = useSelector((store) => store.learningProgress);

  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch(getProgressUpdates(token));
  }, [dispatch]);

  const handleSubmit = (values) => {
    if (editing) {
      dispatch(updateProgressUpdate(token, editing.id, values));
      message.success("Update edited successfully!");
    } else {
      dispatch(createProgressUpdate(token, values));
      message.success("New update added!");
    }
    form.resetFields();
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleTemplateChange = (value) => {
    if (value === "tutorial") {
      form.setFieldsValue({
        title: "📚 Completed a Tutorial",
        content: "Finished learning [topic] tutorial."
      });
    } else if (value === "skill") {
      form.setFieldsValue({
        title: "🛠️ Learned a New Skill",
        content: "I learned how to [skill]."
      });
    } else if (value === "project") {
      form.setFieldsValue({
        title: "🚀 Built a Project",
        content: "I developed a project using [technology]."
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">📈 Learning Progress Updates</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Update
        </Button>
      </div>

      <List
        dataSource={updates}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => {
                  setEditing(item);
                  form.setFieldsValue(item);
                  setIsModalOpen(true);
                }}
              />,
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
                onClick={() => {
                  dispatch(deleteProgressUpdate(token, item.id));
                  message.success("Update deleted!");
                }}
              />
            ]}
          >
            <List.Item.Meta
              title={item.title}
              description={item.content}
            />
          </List.Item>
        )}
      />

      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        title={editing ? "Edit Update ✏️" : "Add Progress Update 🚀"}
      >
        
      </Modal>
    </div>
  );
};

export default LearningProgress;
