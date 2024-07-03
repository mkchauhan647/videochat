import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
export default function Login({ login }) {
    const dispatch = useDispatch();
    
    const [loginType, setLoginType] = useState("Sign In");
    const inputEmailRef = useRef(null);
    const inputPasswordRef = useRef(null);
    const router = useRouter();

    const handleLogin = () => {

        if (inputEmailRef.current.value === '' || inputPasswordRef.current.value === '') {
            alert('Please enter email and password');
            inputEmailRef.current.focus();
            return;
        }

        // if (loginType === "Sign In") {
        //     dispatch(login('email'));
        // }
        // else {
        //     dispatch(signup());
        // }
       const what =  dispatch(login({ provider: 'email', type: loginType, email: inputEmailRef.current.value, password: inputPasswordRef.current.value }));
        
        router.refresh();
        console.log('what',what)
        // socke 
        
    };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
              <div className="relative flex flex-col  justify-center  gap-4  border-[#333] border bg-[#333] -mt-20 p-16 ">
                  <h1 className="text-2xl text-white  absolute top-3  text-center left-0 right-0">{loginType}</h1>
          <input
            type="text"
            placeholder="Enter email"
                      className="p-2 border-[#333] border rounded-md "
                      ref={inputEmailRef}
          />
          <input
            type="password"
            placeholder="Enter password"
                      className="p-2 border-[#333] border rounded-md "
                      ref={inputPasswordRef}
          />
          <button
            className="bg-blue-400 p-3 rounded-md  mx-auto px-10 mb-3"
            onClick={() => handleLogin()}
          >
            {loginType}
          </button>

          <div className="flex gap-4 justify-between ">
            <p className="text-blue-400">
                          {loginType == "Sign In" ? "Don't have account? " : "Already have an account? "} {" "}
                          <span onClick={() => {
                              if(loginType === 'Sign Up')
                                  setLoginType('Sign In')
                              else if (loginType === 'Sign In'){
                                  
                                  setLoginType('Sign Up')
                              }
                          }} className="underline cursor-pointer">
                {loginType === "Sign In" ? "Sign Up" : "Sign In"}
              </span>
            </p>
            <p className="text-blue-400">
              Forget{" "}
              <a href="/forget-password" className="underline">
                passwrod ?{" "}
              </a>
            </p>
          </div>

          <button className="p-2 bg-red-300 mx-auto mt-5 rounded-sm" onClick={()=>dispatch(login({provider:'google',type:loginType}))}>
            {loginType} With Google
          </button>
          {/* <button className="p-2 bg-blue-300 mx-auto ">
            Signin In With Facebook
          </button> */}
        </div>
      </div>
    </>
  );
}
