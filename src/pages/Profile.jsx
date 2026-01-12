import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "@/features/auth";
import { fetchUserProfile, updateUserProfile } from "@/features/auth";
import { CardSkeleton } from "@/components/common/SkeletonLoader";
import toast from "@/utils/toast";
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaWallet, FaCalendar } from "react-icons/fa";

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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account information</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your account information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          {!isEditing ? (
            // View Mode
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white 
                             hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              </div>

              <div className="space-y-4">
                <InfoRow icon={<FaUser />} label="Name" value={profileData?.name} />
                <InfoRow icon={<FaEnvelope />} label="Email" value={profileData?.email} />
                <InfoRow icon={<FaPhone />} label="Mobile" value={profileData?.mobile} />
                <InfoRow icon={<FaIdCard />} label="PAN" value={profileData?.pan} />
                <InfoRow 
                  icon={<FaCalendar />} 
                  label="Member Since" 
                  value={new Date(profileData?.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} 
                />
              </div>
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Edit Profile</h2>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FaUser className="text-gray-400" />
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700
                               bg-white dark:bg-gray-900 px-3 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FaPhone className="text-gray-400" />
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
                    className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700
                               bg-white dark:bg-gray-900 px-3 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10-digit mobile number"
                  />
                </div>

                {/* Read-only fields */}
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-500">
                    <FaEnvelope className="text-gray-400" />
                    Email (Cannot be changed)
                  </label>
                  <input
                    type="text"
                    value={profileData?.email}
                    disabled
                    className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700
                               bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm
                               text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-500">
                    <FaIdCard className="text-gray-400" />
                    PAN (Cannot be changed)
                  </label>
                  <input
                    type="text"
                    value={profileData?.pan}
                    disabled
                    className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700
                               bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm
                               text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 rounded-md bg-green-600 text-white font-medium
                             hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
                             transition-colors"
                >
                  {saving ? "Saving..." : "Save Changes"}
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
                  className="flex-1 py-2 rounded-md border border-gray-300 dark:border-gray-700
                             hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Account Summary */}
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
            <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center gap-2">
                  <FaWallet className="text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium">Available Balance</span>
                </div>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  ₹{profileData?.balance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-blue-50 dark:bg-blue-900/20 p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> For security reasons, you cannot change your email and PAN after registration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-200 dark:border-gray-800 last:border-0">
      <div className="text-gray-400">{icon}</div>
      <div className="flex-1">
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}