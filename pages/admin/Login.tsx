import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, settings } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/admin');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative">
        <div className="mb-6">
           <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors">
              <ArrowLeft size={16} className="mr-1" /> Back to Website
           </Link>
        </div>

        <div className="text-center mb-8">
          <div className="bg-black text-white p-3 rounded-full inline-block mb-4">
            <Camera size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-500">{settings.siteName}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="admin"
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
             <input 
               type="password" 
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
               placeholder="admin"
             />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-black text-white py-2 rounded font-bold hover:bg-gray-800 transition-colors">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;