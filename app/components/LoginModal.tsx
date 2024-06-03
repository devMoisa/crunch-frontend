import React, {useState} from 'react';
import {FaLock, FaUser} from 'react-icons/fa';
import {IoMdArrowBack, IoMdClose} from 'react-icons/io';
import {api} from '~/api/api';
import {useAuth} from '~/contexts/AuthContext';
import {ToastContainer, toast} from 'react-toastify';
import ReactLoading from 'react-loading';
import authToken from '../utils/authToken';

enum FormType {
  Login = 'login',
  Register = 'register',
}

export const LoginModal: React.FC = () => {
  const {loginModalStatus, toggleLoginModalStatus} = useAuth();
  const [dynamicForm, setDynamicForm] = useState<FormType>(FormType.Login);
  const [loadingForm, setLoadingForm] = useState(false);
  const {saveToken, removeToken, checkToken} = authToken();

  const handleHideModal = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      toggleLoginModalStatus(false);
    }
  };

  const BoxLogin = () => {
    const handleRegisterNewAccount = () => {
      setDynamicForm(FormType.Register);
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event: React.FormEvent) => {
      event.preventDefault();
      setLoadingForm(true);

      try {
        const response = await api.post('/api/auth/login', {
          email,
          password,
        });

        if (response.status === 200) {
          const {access_token} = response.data;

          saveToken(access_token);
          toast.success('Success!', {
            position: 'top-right',
          });
        }
      } catch (error: any) {
        toast.error(error?.response.data.message, {
          position: 'top-right',
        });
      } finally {
        setLoadingForm(false);
      }
    };

    return (
      <>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <div className="flex items-center border-b border-gray-400 py-2">
              <FaUser className="text-gray-500 mr-2" />
              <input
                type="text"
                value={email}
                placeholder="Username or E-mail."
                className="appearance-none border-none bg-slate-100 w-full text-gray-700 mr-3 py-3 px-3 leading-tight focus:outline-none"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center border-b border-gray-400 py-2">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                value={password}
                placeholder="Password."
                className="appearance-none border-none w-full bg-slate-100 text-gray-700 mr-3 py-3 px-3 leading-tight focus:outline-none"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold w-full p-3 rounded focus:outline-none focus:shadow-outline"
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="text-center text-gray-600 text-sm mt-8">
          Don't have an account?{' '}
          <button
            onClick={handleRegisterNewAccount}
            className="text-green-500 hover:text-green-800"
          >
            Create one now.
          </button>
        </p>
      </>
    );
  };

  const BoxUserRegister = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoadingForm(true);

      try {
        const response = await api.post('/api/user/create', {
          name,
          surname,
          email,
          password,
        });

        if (response.status === 201) {
          toggleLoginModalStatus(false);
          toast.success('Success!', {
            position: 'top-right',
          });
        }
      } catch (error: any) {
        toast.error(error?.response.data.message, {
          position: 'top-right',
        });
      } finally {
        setLoadingForm(false);
      }
    };

    const handleBackToLogin = () => {
      setName('');
      setSurname('');
      setEmail('');
      setPassword('');

      setDynamicForm(FormType.Login);
    };

    return (
      <>
        <button
          className="absolute  left-5 top-5 flex items-center text-gray-500 hover:opacity-60 transition"
          onClick={handleBackToLogin}
        >
          <IoMdArrowBack size={30} /> Back
        </button>
        <h3 className="text-center  text-gray-400 mb-7">
          Please preencha the fields below to create your account.
        </h3>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <div className="flex items-center border-b border-gray-400 py-2">
              <FaUser className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Name"
                className="appearance-none border-none bg-slate-100 w-full text-gray-700 mr-3 py-3 px-3 leading-tight focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center border-b border-gray-400 py-2">
              <FaUser className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Surname"
                className="appearance-none border-none bg-slate-100 w-full text-gray-700 mr-3 py-3 px-3 leading-tight focus:outline-none"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center border-b border-gray-400 py-2">
              <FaUser className="text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="Email"
                className="appearance-none border-none bg-slate-100 w-full text-gray-700 mr-3 py-3 px-3 leading-tight focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center border-b border-gray-400 py-2">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                placeholder="Password"
                className="appearance-none border-none w-full bg-slate-100 text-gray-700 mr-3 py-3 px-3 leading-tight focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold w-full p-3 rounded focus:outline-none focus:shadow-outline"
            >
              Register
            </button>
          </div>
        </form>
      </>
    );
  };

  return (
    <>
      {loginModalStatus && (
        <div
          className="fixed z-20 top-0 bg-opacity-90 left-0 w-full flex items-center justify-center min-h-screen bg-gray-800 transition"
          onClick={handleHideModal}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-lg w-96 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {loadingForm ? (
              <div className="flex justify-center flex-col items-center">
                <ReactLoading
                  type={'spin'}
                  color={'green'}
                  height={'10%'}
                  width={'10%'}
                />
                <h5 className="mt-5 text-center font-regular text-xl">
                  Loading...
                </h5>
              </div>
            ) : (
              <>
                <button
                  className="absolute right-0 top-0 p-2 text-white bg-red-600 hover:opacity-60 transition"
                  onClick={handleHideModal}
                >
                  <IoMdClose size={30} />
                </button>
                <h2 className="text-center font-bold text-lime-600 mt-10 mb-2">
                  {dynamicForm === FormType.Login ? 'Login' : 'Register'}
                </h2>
                <h2 className="text-2xl font-bold text-center mb-8 mt-2">
                  devMoises's Store
                </h2>
                {dynamicForm === 'login' ? <BoxLogin /> : <BoxUserRegister />}
              </>
            )}
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};
