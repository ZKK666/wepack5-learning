/**
 * 登录/注册页面
 *
 * 【实战功能】用户认证
 */
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks';

// 表单验证规则
const validateLogin = (values) => {
  const errors = {};
  if (!values.username) {
    errors.username = '请输入用户名';
  }
  if (!values.password) {
    errors.password = '请输入密码';
  } else if (values.password.length < 6) {
    errors.password = '密码至少6位';
  }
  return errors;
};

const validateRegister = (values) => {
  const errors = validateLogin(values);
  if (!values.email) {
    errors.email = '请输入邮箱';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = '邮箱格式不正确';
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = '请确认密码';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = '两次密码不一致';
  }
  return errors;
};

function LoginPage({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { login, register } = useAuth();

  const loginForm = useForm(
    { username: '', password: '' },
    validateLogin
  );

  const registerForm = useForm(
    { username: '', email: '', password: '', confirmPassword: '' },
    validateRegister
  );

  const handleLogin = async (values) => {
    setMessage({ type: '', text: '' });
    const result = await login(values.username, values.password);

    if (result.success) {
      setMessage({ type: 'success', text: '登录成功！' });
      onSuccess && onSuccess();
    } else {
      setMessage({ type: 'error', text: result.message || '登录失败' });
    }
  };

  const handleRegister = async (values) => {
    setMessage({ type: '', text: '' });
    const result = await register({
      username: values.username,
      email: values.email,
      password: values.password,
    });

    if (result.success) {
      setMessage({ type: 'success', text: '注册成功！请登录' });
      setIsLogin(true);
      registerForm.reset();
    } else {
      setMessage({ type: 'error', text: result.message || '注册失败' });
    }
  };

  const form = isLogin ? loginForm : registerForm;

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button
          className={`btn ${isLogin ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setIsLogin(true)}
        >
          登录
        </button>
        <button
          className={`btn ${!isLogin ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setIsLogin(false)}
        >
          注册
        </button>
      </div>

      {message.text && (
        <div className={`tip-box ${message.type === 'error' ? 'warning' : 'success'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={form.handleSubmit(isLogin ? handleLogin : handleRegister)}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>用户名</label>
          <input
            type="text"
            name="username"
            value={form.values.username}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            placeholder="请输入用户名"
            style={{ width: '100%', maxWidth: '100%' }}
          />
          {form.touched.username && form.errors.username && (
            <span style={{ color: '#dc3545', fontSize: '12px' }}>
              {form.errors.username}
            </span>
          )}
        </div>

        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>邮箱</label>
            <input
              type="email"
              name="email"
              value={form.values.email || ''}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              placeholder="请输入邮箱"
              style={{ width: '100%', maxWidth: '100%' }}
            />
            {form.touched.email && form.errors.email && (
              <span style={{ color: '#dc3545', fontSize: '12px' }}>
                {form.errors.email}
              </span>
            )}
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>密码</label>
          <input
            type="password"
            name="password"
            value={form.values.password}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            placeholder="请输入密码"
            style={{ width: '100%', maxWidth: '100%' }}
          />
          {form.touched.password && form.errors.password && (
            <span style={{ color: '#dc3545', fontSize: '12px' }}>
              {form.errors.password}
            </span>
          )}
        </div>

        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>确认密码</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.values.confirmPassword || ''}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              placeholder="请再次输入密码"
              style={{ width: '100%', maxWidth: '100%' }}
            />
            {form.touched.confirmPassword && form.errors.confirmPassword && (
              <span style={{ color: '#dc3545', fontSize: '12px' }}>
                {form.errors.confirmPassword}
              </span>
            )}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={form.isSubmitting}
          style={{ width: '100%' }}
        >
          {form.isSubmitting ? '处理中...' : (isLogin ? '登录' : '注册')}
        </button>
      </form>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>测试账号: admin / 123456</p>
      </div>
    </div>
  );
}

export default LoginPage;
