import {
  Eye,
  EyeClosed,
  Key,
  Loader2,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    password: string;
  }>({
    fullName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { isSigningUp, signUp } = useAuthStore();

  const ValidateFormData = () => {
    if (
      !formData.fullName.trim() &&
      !/\S+@\S+\.\S+/.test(formData.email) &&
      !formData.password
    )
      toast.error("All fields are required");
    if (!formData.fullName.trim()) toast.error("Full Name is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      toast.error("Email must be a valid email address");
    if (!formData.password) toast.error("Password is required ");
    if (formData.password.length < 6)
      toast.error("Password must be of at least 6 character");
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validated = ValidateFormData();
    if (validated) signUp(formData);
  };

  return (
    <div className="min-h-screen grid  lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="mb-8 text-center">
            <div className="flex flex-col items-center gap-2 group">
              <div className="flex items-center justify-center group-hover:bg-primary/20 transition-colors bg-primary/10 rounded-xl size-12">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get Started with your free Account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5  text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="Eg: John doe"
                  onChange={(e) =>
                    setFormData(
                      (currData) =>
                        (currData = { ...currData, fullName: e.target.value })
                    )
                  }
                  value={formData.fullName}
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5  text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="Enter Email"
                  onChange={(e) =>
                    setFormData(
                      (currData) =>
                        (currData = { ...currData, email: e.target.value })
                    )
                  }
                  value={formData.email}
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="size-5  text-base-content/40" />
                </div>
                <input
                  type={showPassword ? `text` : `password`}
                  className={`input input-bordered w-full pl-10`}
                  placeholder=""
                  onChange={(e) =>
                    setFormData(
                      (currData) =>
                        (currData = { ...currData, password: e.target.value })
                    )
                  }
                  value={formData.password}
                />
                <button
                  onClick={() => setShowPassword((sp) => !sp)}
                  className="absolute inset-y-0 right-0 pr-3 z-50 hover:cursor-pointer  flex items-center"
                >
                  {showPassword ? (
                    <Eye className="size-5  text-base-content/40" />
                  ) : (
                    <EyeClosed className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <div className="text-center">
            <div className="text-base-content/60">
              Already have an Account{" "}
              <Link to={`/login`} className="link link-primary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* right side */}
      <AuthImagePattern
        title="Join Our Community"
        subtitle="Connect with friends and foe"
      />
    </div>
  );
};

export default SignupPage;
