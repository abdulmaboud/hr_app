import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification, Spin, Divider } from 'antd';
import axios from 'axios';

const ProfileView = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const storedUsername = localStorage.getItem('username');

        if (!storedUsername) {
          notification.error({
            message: 'Error',
            description: 'No username found. Please log in again.',
          });
          return;
        }

        const userResponse = await axios.get(`http://localhost:8080/users/${storedUsername}`);
        const userData = userResponse.data;
        setUser(userData);

        if (userData.tenantId) {
          const tenantResponse = await axios.get(`http://localhost:8080/tenants/${userData.tenantId}`);
          setTenant(tenantResponse.data);
        }

        form.setFieldsValue({
          username: userData.username,
          email: userData.email,
          company: userData.company
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to fetch profile data. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [form]);

  const onUpdateProfile = async (values) => {
    setLoading(true);
    try {
      const updatedUser = {
        ...user, // Include existing user data
        ...values // Overwrite with updated fields from the form
      };

      await axios.post('http://localhost:8080/user/update', updatedUser);
      notification.success({
        message: 'Success',
        description: 'Profile updated successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to update profile. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (values) => {
    setLoading(true);
    try {
      const storedUsername = localStorage.getItem('username');
      await axios.post('http://localhost:8080/user/changePassword', null, {
        params: {
          username: storedUsername,
          oldPassword: values.oldPassword,
          newPassword: values.newPassword
        }
      });
      notification.success({
        message: 'Success',
        description: 'Password changed successfully.',
      });
      passwordForm.resetFields();
    } catch (error) {
      console.error('Error changing password:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to change password. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#fff', minHeight: '360px' }}>
      <h2>User Profile</h2>

      {loading ? (
        <Spin />
      ) : (
        <>
          <Form
            form={form}
            layout="vertical"
            onFinish={onUpdateProfile}
            style={{ marginBottom: '24px' }}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please enter your username' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Company"
              name="company"
              rules={[{ required: true, message: 'Please enter your company' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Profile
              </Button>
            </Form.Item>
          </Form>

          <Divider />

          <h3>Tenant Information (View Only)</h3>
          <Form layout="vertical">
            <Form.Item label="Tenant ID">
              <Input value={tenant?.id || ''} disabled />
            </Form.Item>

            <Form.Item label="Tenant Name">
              <Input value={tenant?.name || ''} disabled />
            </Form.Item>

            <Form.Item label="Tenant Domain">
              <Input value={tenant?.domain || ''} disabled />
            </Form.Item>

            <Form.Item label="Tenant Email">
              <Input value={tenant?.email || ''} disabled />
            </Form.Item>
          </Form>

          <Divider />

          <h3>Change Password</h3>
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={onChangePassword}
          >
            <Form.Item
              label="Old Password"
              name="oldPassword"
              rules={[{ required: true, message: 'Please enter your old password' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[{ required: true, message: 'Please enter your new password' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirmNewPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('The two passwords that you entered do not match!');
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
};

export default ProfileView; 