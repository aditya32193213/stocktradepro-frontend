import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "@/features/auth";
import { fetchUserProfile, updateUserProfile } from "@/features/auth";
import { CardSkeleton } from "@/components/common/SkeletonLoader";
import toast from "@/utils/toast";
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaWallet, FaCalendar, FaEdit, FaCheck, FaTimes, FaShieldAlt, FaClock, FaChartLine } from "react-icons/fa";

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
  });

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const result = await dispatch(fetchUserProfile());
      if (result.payload) {
        setProfileData(result.payload);
        setFormData({
          name: result.payload.name || "",
          mobile: result.payload.mobile || "",
        });
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.mobile.trim() || formData.mobile.length !== 10) {
      toast.error("Valid 10-digit mobile number is required");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Updating profile...");

    try {
      const result = await dispatch(updateUserProfile(formData));
      
      toast.dismiss(toastId);
      
      if (result.payload) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        await loadProfile();
      } else {
        toast.error(result.error?.message || "Failed to update profile");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("An error occurred while updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CardSkeleton />
          </div>
          <div className="space-y-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Premium Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
          
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-xl">
                <FaUser className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
                  {profileData?.name || "User Profile"}
                </h1>
                <p className="text-blue-100 text-sm md:text-base font-medium flex items-center gap-2">
                  <FaShieldAlt className="text-sm" />
                  Manage your account & personal information
                </p>
              </div>
            </div>
            
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="group px-6 py-3 rounded-xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <FaEdit className="group-hover:rotate-12 transition-transform" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Profile Card */}
          <div className="lg:col-span-2 rounded-3xl border border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl overflow-hidden">
            
            {/* Top Accent Border */}
            <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>
            
            <div className="p-8">
              {!isEditing ? (
                // View Mode
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                      Personal Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard 
                      icon={<FaUser />} 
                      label="Full Name" 
                      value={profileData?.name}
                      gradient="from-blue-500 to-indigo-500"
                    />
                    <InfoCard 
                      icon={<FaEnvelope />} 
                      label="Email Address" 
                      value={profileData?.email}
                      gradient="from-indigo-500 to-violet-500"
                    />
                    <InfoCard 
                      icon={<FaPhone />} 
                      label="Mobile Number" 
                      value={profileData?.mobile}
                      gradient="from-violet-500 to-purple-500"
                    />
                    <InfoCard 
                      icon={<FaIdCard />} 
                      label="PAN Card" 
                      value={profileData?.pan}
                      gradient="from-purple-500 to-pink-500"
                    />
                  </div>

                  <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/60 dark:border-blue-800/60">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                        <FaCalendar className="text-xl" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Member Since</div>
                        <div className="text-lg font-black text-gray-900 dark:text-white">
                          {new Date(profileData?.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full"></div>
                      Edit Profile
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="md:col-span-2">
                      <label className="text-sm font-black text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3 uppercase tracking-wider">
                        <FaUser className="text-blue-500" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border-2 border-gray-300 dark:border-gray-700
                                   bg-white dark:bg-gray-900 px-5 py-4 text-base font-medium
                                   focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                                   transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-600"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Mobile Field */}
                    <div className="md:col-span-2">
                      <label className="text-sm font-black text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3 uppercase tracking-wider">
                        <FaPhone className="text-blue-500" />
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        value={formData.mobile}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 10) {
                            setFormData({ ...formData, mobile: value });
                          }
                        }}
                        maxLength={10}
                        className="w-full rounded-xl border-2 border-gray-300 dark:border-gray-700
                                   bg-white dark:bg-gray-900 px-5 py-4 text-base font-medium
                                   focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                                   transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-600"
                        placeholder="10-digit mobile number"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1">
                        Enter a valid 10-digit mobile number
                      </p>
                    </div>

                    {/* Read-only Email */}
                    <div>
                      <label className="text-sm font-black text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-3 uppercase tracking-wider">
                        <FaEnvelope className="text-gray-400" />
                        Email (Cannot be changed)
                      </label>
                      <input
                        type="text"
                        value={profileData?.email}
                        disabled
                        className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-800
                                   bg-gray-100 dark:bg-gray-800 px-5 py-4 text-base font-medium
                                   text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>

                    {/* Read-only PAN */}
                    <div>
                      <label className="text-sm font-black text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-3 uppercase tracking-wider">
                        <FaIdCard className="text-gray-400" />
                        PAN (Cannot be changed)
                      </label>
                      <input
                        type="text"
                        value={profileData?.pan}
                        disabled
                        className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-800
                                   bg-gray-100 dark:bg-gray-800 px-5 py-4 text-base font-medium
                                   text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <button
                      type="submit"
                      disabled={saving}
                      className="group flex-1 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 
                                 text-white font-black text-base shadow-lg shadow-green-600/30
                                 hover:shadow-xl hover:shadow-green-600/40 hover:scale-105
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                 transition-all duration-300 flex items-center justify-center gap-3"
                    >
                      <FaCheck className="group-hover:scale-110 transition-transform" />
                      {saving ? "Saving Changes..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: profileData?.name || "",
                          mobile: profileData?.mobile || "",
                        });
                      }}
                      className="group flex-1 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700
                                 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-black text-base
                                 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600
                                 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105"
                    >
                      <FaTimes className="group-hover:rotate-90 transition-transform" />
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Balance Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-gray-200/60 dark:border-gray-800/60 bg-gradient-to-br from-green-500 to-emerald-600 p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-white shadow-lg">
                    <FaWallet className="text-2xl" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xl text-white text-xs font-bold uppercase tracking-wider">
                    Active
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-green-100 text-sm font-bold uppercase tracking-wider">Available Balance</p>
                  <p className="text-5xl font-black text-white tracking-tight">
                    ₹{profileData?.balance.toLocaleString()}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center justify-between text-green-100">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <FaChartLine className="text-xs" />
                      Portfolio Value
                    </span>
                    <span className="text-sm font-bold">Real-time</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="rounded-3xl border border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>
              
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <FaClock className="text-blue-500" />
                  Quick Stats
                </h3>
                
                <div className="space-y-3">
                  <StatItem 
                    label="Account Status" 
                    value="Active" 
                    valueClass="text-green-600 dark:text-green-400"
                  />
                  <StatItem 
                    label="Verification" 
                    value="Verified" 
                    valueClass="text-blue-600 dark:text-blue-400"
                  />
                  <StatItem 
                    label="Account Type" 
                    value="Individual" 
                    valueClass="text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="rounded-3xl border border-blue-200/60 dark:border-blue-800/60 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <FaShieldAlt className="text-lg" />
                </div>
                <div>
                  <h4 className="font-black text-blue-900 dark:text-blue-100 mb-2">Security Notice</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                    For security reasons, you cannot change your <strong>email</strong> and <strong>PAN</strong> after registration. Contact support if you need assistance.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Premium Info Card Component
function InfoCard({ icon, label, value, gradient }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white dark:bg-gray-900 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      <div className="relative flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            {label}
          </div>
          <div className="text-base font-black text-gray-900 dark:text-white truncate">
            {value || "Not provided"}
          </div>
        </div>
      </div>
      
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
    </div>
  );
}

// Stat Item Component
function StatItem({ label, value, valueClass }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
      <span className={`text-sm font-black ${valueClass}`}>{value}</span>
    </div>
  );
}