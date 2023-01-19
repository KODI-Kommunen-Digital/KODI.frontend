import React, { useRef,useEffect ,useState, /*useContext*/ } from "react";
//import AuthContext from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import HEIDI_Logo from "../Resource/HEIDI_Logo.png";
import "../index.css";
//import axios from "../api/axios";


//const LOGIN_URL = '/auth';

const LoginPage = () => {

  //const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  //const errRef = useRef();

  const [forgotPasswd, setForgotPasswd] = useState(false);
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  //const [errMsg, setErrMsg] = useState('');
  //const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = "Heidi - Login";
  }, []);

  useEffect(() => {
    userRef.current.focus();
  }, []);
  // useEffect(() => {
  //   setErrMsg('');
  // }, [user,pwd]);


  let navigate = useNavigate();
  const routeChangeToDashboard = () => {
    let path = `/Dashboard`;
    navigate(path);
  };
  const routeChangeToRegister = () => {
    let path = `/Register`;
    navigate(path);
  };

  const forgotPassword = () => {
    setForgotPasswd(true);
  };
  const onCancel = () => {
    setForgotPasswd(false);
  };

  // const handleUsernameChange = (event) =>{
  //   setUsername(event.target.value)
  // }
  // const handlePasswordChange = (event) =>{
  //   setPassword(event.target.value)
  // }

  const handleSubmit = async(event) => {
    event.preventDefault();

    console.log({'username':user,
                 'password':pwd })
    setUser('');
    setPwd('');
    routeChangeToDashboard()

    // Code to integrate the authentication



    //setSuccess(true)
    //try {
    //   const response = await axios.post(LOGIN_URL, 
    //     JSON.stringify({user,pwd}), {
    //       headers: {'Content-Type':'application/json'},
    //       withCredentials: true
    //     }
    //   );
    //   console.log(JSON.stringify(response?.data));
      // console.log(user,pwd)
      // setUser('');
      // setPwd('');
      // setSuccess(true)
    // } catch (err) {
    //   if(!err?.response){
    //     setErrMsg('no server response');
    //   }else if(err.response?.status===400){
    //     setErrMsg('Missing Username or Password');
    //   }else if(err.response?.status ===401){
    //     setErrMsg('Unauthorized');
    //   }else{
    //     setErrMsg('Login Failed');
    //   }
    //   errRef.current.focus();
    // }
    // Send a request to the server with the username and password
  }

  return (
      <div class="i">
        <div class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div class="w-full max-w-md space-y-8">
            <div>
              <img
                class="mx-auto h-20 w-auto"
                src={HEIDI_Logo}
                alt="HEDI- Heimat Digital"
              />
              <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>
            <form onSubmit={handleSubmit} class="mt-8 space-y-6" action="#" method="POST">
              <input type="hidden" name="remember" value="true" />
              <div class="-space-y-px space-y-4 rounded-md shadow-sm">
                <div>
                  <label htmlFor="username" class="sr-only">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    ref={userRef}
                    name="username"
                    value={user}
                    autoComplete="on"
                    onChange={(e)=>setUser(e.target.value)}
                    required
                    class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 hover:scale-102 hover:border-sky-800 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Username"
                  />
                </div>
                <div>
                  <label for="password" class="sr-only">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={pwd}
                    onChange={(e)=>setPwd(e.target.value)}
                    required
                    class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 hover:scale-102 hover:border-sky-800 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    for="remember-me"
                    class="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div class="text-sm">
                  <span
                    onClick={forgotPassword}
                    class="font-medium text-black cursor-pointer hover:text-sky-400"
                  >
                    Forgot your password?
                  </span>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  value="Submit"
                  id="finalbutton"
                  class="group relative flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white hover:text-slate-400 focus:outline-none focus:ring-2 focus:text-gray-400 focus:ring-offset-2"
                >
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      class="h-5 w-5 text-gray-50 group-hover:text-slate-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  Sign in
                </button>
              </div>
              <div class="text-sm">
                Not a member?
                <span
                  onClick={routeChangeToRegister}
                  class="font-medium cursor-pointer text-black hover:text-sky-400"
                >
                  {" "}
                  Click here{" "}
                </span>
                to Register
              </div>
            </form>
            {forgotPasswd && (
              <>
                <div id="myDIV" class="text-sm">
                  Forgot Password? Please confirm your email address. You will
                  receive a link via your email to create a new password.
                  <label for="email-address" class="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    class="mt-1 mb-1 relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 hover:scale-102 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Email address"
                  />
                  <div class="flex gap-2">
                    <button
                      type="submit"
                      id="finalbutton"
                      onClick={routeChangeToDashboard}
                      class="group relative flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white hover:text-slate-400 focus:outline-none focus:ring-2 focus:text-gray-400 focus:ring-offset-2"
                    >
                      Send Link
                    </button>
                    <button
                      type="Cancel"
                      id="finalbutton"
                      onClick={onCancel}
                      class="group relative flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white hover:text-slate-400 focus:outline-none focus:ring-2 focus:text-gray-400 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
  );
};
export default LoginPage;
