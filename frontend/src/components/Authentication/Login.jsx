import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { UserContext } from "../Context/Context";
import { toast,ToastContainer } from "react-toastify";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    useremail: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const {loginUser, token} = useContext(UserContext);

  const navigate = useNavigate();


  //Check if the user is logged in
  useEffect(() => {
    if (token) {
      navigate("/users");
    }
  }, []);

  //Set user info
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };


  //Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.useremail) {
      newErrors.useremail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.useremail)) {
      newErrors.useremail = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoging = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const data = await loginUser(formData)
        if(data.token){
          toast.success("User logged in. Redirecting", {position : "top-center"})
          localStorage.setItem("token", data.token)
          setFormData({
            useremail: "",
            password: ""
          })
         setTimeout(()=>{
          navigate("/users");
         },1000)
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };
  

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg ">
        {/* Header */}
        <div className="text-center ">
          <h2 className="text-3xl font-extrabold text-[#009900]">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600 ">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-[#009900] hover:text-green-700"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6 ">
          {/* Email Field */}
          <div>
            <label
              htmlFor="useremail"
              className="block text-sm font-medium text-gray-700 "
            >
              Email address
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="useremail"
                name="useremail"
                type="email"
                autoComplete="email"
                value={formData.useremail}
                onChange={handleChange}
                className={`appearance-none block w-full  pl-10 pr-3 py-2 border ${
                  errors.useremail ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009900] focus:border-transparent`}
                placeholder="Enter your email"
              />
            </div>
            {errors.useremail && (
              <p className="mt-1 text-sm text-red-500">{errors.useremail}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 "
            >
              Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none block w-full pl-10 pr-10 py-2  border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009900] focus:border-transparent`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-[#009900] hover:text-green-700"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group cursor-pointer  relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#009900] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009900] transition-colors duration-200"
              onClick={handleLoging}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Login;
