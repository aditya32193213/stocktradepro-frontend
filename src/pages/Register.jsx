import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ThemeToggle from "@/components/common/ThemeToggle";
import { registerUser } from "@/features/auth";
import toast from "@/utils/toast";

const schema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .required("Name is required"),
  
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  
  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, "Mobile must be exactly 10 digits")
    .required("Mobile is required"),
  
  pan: yup
    .string()
    .matches(
      /^[A-Z]{5}[0-9]{4}[A-Z]$/,
      "Invalid PAN format (e.g., ABCDE1234F)"
    )
    .required("PAN is required"),
  
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/~`])/,
      "Password must contain uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),
});

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const toastId = toast.loading("Creating your account...");
    
    try {
      const result = await dispatch(registerUser(data));
      
      toast.dismiss(toastId);
      
      if (registerUser.fulfilled.match(result)) {
        toast.success("Registration successful! Please login.");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        toast.error(result.payload || "Registration failed");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center 
                    bg-gray-50 dark:bg-gray-950 
                    text-gray-900 dark:text-gray-100 px-4">

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-lg">
        <h1 className="text-2xl font-semibold mb-1">Register</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Create your StockTradePro account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              {...register("name")}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700
                         bg-white dark:bg-gray-900 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              {...register("email")}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700
                         bg-white dark:bg-gray-900 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="text-sm font-medium">Mobile Number</label>
            <input
              {...register("mobile")}
              maxLength={10}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700
                         bg-white dark:bg-gray-900 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="9876543210"
            />
            {errors.mobile && (
              <p className="text-xs text-red-500 mt-1">{errors.mobile.message}</p>
            )}
          </div>

          {/* PAN */}
          <div>
            <label className="text-sm font-medium">PAN Number</label>
            <input
              {...register("pan")}
              maxLength={10}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700
                         bg-white dark:bg-gray-900 px-3 py-2 text-sm uppercase
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ABCDE1234F"
            />
            {errors.pan && (
              <p className="text-xs text-red-500 mt-1">{errors.pan.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              {...register("password")}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700
                         bg-white dark:bg-gray-900 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Min 8 characters with uppercase, lowercase, number & special character
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-green-600 py-2 text-white font-medium 
                       hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors transform active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Creating account...
              </span>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}