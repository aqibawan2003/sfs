import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaEyeSlash, FaLock, FaShieldAlt } from 'react-icons/fa';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/login`, { email, password });
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminData', JSON.stringify(response.data.admin));
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || 'We could not sign you in with those details.');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-[#f4f6f3] text-[#20251f]">
      <section className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-[#1b2b21] p-12 xl:p-16 flex-col justify-between">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10" />
        <Link to="/" className="relative z-10 inline-flex items-center gap-3 w-fit text-white">
          <img src="/images/logo.png" alt="Student Facility System" className="h-10 w-10 object-contain" />
          <span className="font-semibold tracking-tight">Student Facility System</span>
        </Link>
        <div className="relative z-10 max-w-md">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#aebdaf]">Staff access</p>
          <h1 className="text-4xl xl:text-5xl font-semibold leading-[1.12] tracking-tight text-white">Manage daily platform operations in one place.</h1>
          <p className="mt-5 max-w-sm text-[15px] leading-7 text-[#c5cec6]">Review provider applications, manage accounts, and respond to student enquiries.</p>
        </div>
        <div className="relative z-10 flex items-center gap-3 text-sm text-[#aebdaf]">
          <FaShieldAlt className="text-[#d9e2d7]" />
          <span>Restricted to authorised SFS staff</span>
        </div>
      </section>

      <section className="flex min-h-screen flex-1 items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[430px]">
          <Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-[#5e685d] hover:text-[#26382b] lg:hidden"><FaArrowLeft className="text-xs" /> Back to website</Link>
          <div className="mb-8 lg:hidden"><img src="/images/logo.png" alt="Student Facility System" className="h-11 w-11 object-contain" /></div>
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold text-[#697565]">Administration</p>
            <h2 className="text-3xl font-semibold tracking-tight text-[#1c241e]">Sign in to your account</h2>
            <p className="mt-3 text-sm leading-6 text-[#667066]">Use the email address assigned to your staff account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            <div>
              <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-[#303a32]">Work email</label>
              <input id="admin-email" name="email" type="email" autoComplete="username" onChange={(e) => setEmail(e.target.value)} value={email} required placeholder="name@institution.edu" className="h-12 w-full rounded-lg border border-[#d5dbd3] bg-white px-4 text-[15px] text-[#20251f] outline-none transition placeholder:text-[#9aa29a] focus:border-[#697565] focus:ring-4 focus:ring-[#697565]/10" />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-[#303a32]">Password</label>
              <div className="relative">
                <input id="admin-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} value={password} required placeholder="Enter your password" className="h-12 w-full rounded-lg border border-[#d5dbd3] bg-white px-4 pr-12 text-[15px] text-[#20251f] outline-none transition placeholder:text-[#9aa29a] focus:border-[#697565] focus:ring-4 focus:ring-[#697565]/10" />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-[#788078] hover:text-[#354238]">{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
              </div>
            </div>
            {loginError && <div role="alert" className="rounded-lg border border-[#e8c8c1] bg-[#fff4f1] px-4 py-3 text-sm text-[#8f3b28]">{loginError}</div>}
            <button type="submit" disabled={loginLoading} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#435447] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#354439] focus:outline-none focus:ring-4 focus:ring-[#697565]/20 disabled:cursor-not-allowed disabled:opacity-60">
              <FaLock className="text-xs opacity-80" /> {loginLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 border-t border-[#dfe4dd] pt-6 text-center text-sm text-[#687168]">Looking for the student portal? <Link to="/loginform" className="font-semibold text-[#435447] hover:underline">Student sign in</Link></div>
          <p className="mt-8 text-center text-xs leading-5 text-[#929992]">If you are unable to access your account, contact the system administrator.</p>
        </div>
      </section>
    </main>
  );
};

export default AdminLogin;
