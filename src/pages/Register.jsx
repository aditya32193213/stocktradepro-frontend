import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ThemeToggle from "@/components/common/ThemeToggle";
import { registerUser } from "@/features/auth";
import toast from "@/utils/toast";

const schema = yup.object({
  name: yup.string().min(2, "Name must be at least 2 characters").max(100).required("Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  mobile: yup.string().matches(/^[0-9]{10}$/, "Mobile must be exactly 10 digits").required("Mobile is required"),
  pan: yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN format").required("PAN is required"),
  password: yup.string().min(8, "Min 8 characters").matches(/[A-Z]/, "One uppercase").matches(/[a-z]/, "One lowercase").matches(/[0-9]/, "One number").matches(/[@$!%*?&#]/, "One special char").required("Password is required"),
});

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const toastId = toast.loading("Creating account...");
    const result = await dispatch(registerUser(data));
    toast.dismiss(toastId);
    
    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created! Please login.");
      navigate("/login");
    } else {
      toast.error(typeof result.payload === "string" ? result.payload : "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-8">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input {...register("name")} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm" placeholder="John Doe" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input {...register("email")} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm" placeholder="john@example.com" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mobile</label>
              <input {...register("mobile")} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm" placeholder="9876543210" />
              {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">PAN</label>
              <input {...register("pan")} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm uppercase" placeholder="ABCDE1234F" />
              {errors.pan && <p className="text-xs text-red-500 mt-1">{errors.pan.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" {...register("password")} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm" placeholder="••••••••" />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-md bg-green-600 py-2 text-white font-medium hover:bg-green-700 disabled:opacity-50 transition-colors">
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
        
        {/* ✅ NEW: GOOGLE AUTH BUTTON */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => toast.error("Google Auth requires backend configuration (Coming Soon)")}
            className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
            Sign up with Google
          </button>
        </div>

        <p className="mt-4 text-sm text-center text-gray-500">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}