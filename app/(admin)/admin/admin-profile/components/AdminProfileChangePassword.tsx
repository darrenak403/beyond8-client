"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Check } from "lucide-react";
import { useChangePassword } from "@/hooks/useAuth";

export default function AdminProfileChangePassword() {
  const { mutateChangePassword, isLoading } = useChangePassword();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const passwordRequirements = {
    minLength: formData.newPassword.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.newPassword),
    hasLowerCase: /[a-z]/.test(formData.newPassword),
    hasNumber: /[0-9]/.test(formData.newPassword),
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.confirmPassword !== "";
  const isCurrentPasswordValid = formData.currentPassword.length >= 6;
  const isNewPasswordValid = allRequirementsMet && formData.newPassword.length > 0;
  const isConfirmPasswordValid = passwordsMatch;

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.currentPassword) {
      setError("Vui lòng nhập mật khẩu hiện tại");
      return;
    }

    if (!allRequirementsMet) {
      setError("Mật khẩu mới không đáp ứng yêu cầu");
      return;
    }

    if (!passwordsMatch) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    mutateChangePassword(
      {
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      },
      {
        onSuccess: () => {
          setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">
          <Lock className="w-4 h-4 inline mr-2" />
          Mật khẩu hiện tại
        </Label>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            value={formData.currentPassword}
            onChange={(e) => handleChange("currentPassword", e.target.value)}
            placeholder="Nhập mật khẩu hiện tại"
            className={`pr-20 transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isCurrentPasswordValid ? "border-green-500 focus-visible:ring-green-500" : ""}`}
          />
          {isCurrentPasswordValid && (
            <Check className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
          )}
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">
          <Lock className="w-4 h-4 inline mr-2" />
          Mật khẩu mới
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={formData.newPassword}
            onChange={(e) => handleChange("newPassword", e.target.value)}
            placeholder="Nhập mật khẩu mới"
            className={`pr-20 transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${isNewPasswordValid ? "border-green-500 focus-visible:ring-green-500" : ""}`}
          />
          {isNewPasswordValid && (
            <Check className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
          )}
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          <Lock className="w-4 h-4 inline mr-2" />
          Xác nhận mật khẩu mới
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            className={`pr-20 transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              isConfirmPasswordValid
                ? "border-green-500 focus-visible:ring-green-500"
                : formData.confirmPassword && !isConfirmPasswordValid
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }`}
          />
          {isConfirmPasswordValid && (
            <Check className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
          )}
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {formData.confirmPassword && (
          <p className={`text-sm flex items-center gap-2 ${passwordsMatch ? "text-green-600" : "text-red-600"}`}>
            <Check className={`w-4 h-4 ${passwordsMatch ? "opacity-100" : "opacity-30"}`} />
            {passwordsMatch ? "Mật khẩu khớp" : "Mật khẩu không khớp"}
          </p>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
        <div className="space-y-2 text-sm">
          <p className="font-medium text-gray-700">Yêu cầu mật khẩu:</p>
          <div className="space-y-1">
            {[
              { met: passwordRequirements.minLength, text: "Ít nhất 8 ký tự" },
              { met: passwordRequirements.hasUpperCase, text: "Có chữ hoa" },
              { met: passwordRequirements.hasLowerCase, text: "Có chữ thường" },
              { met: passwordRequirements.hasNumber, text: "Có số" },
            ].map((req, idx) => (
              <div key={idx} className={`flex items-center gap-2 transition-colors ${req.met ? "text-green-600" : "text-gray-500"}`}>
                <Check className={`w-4 h-4 ${req.met ? "opacity-100" : "opacity-30"}`} />
                <span>{req.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-end w-full md:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
              setError("");
            }}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !formData.currentPassword || !allRequirementsMet || !passwordsMatch}
            className="min-w-[140px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded-full bg-white/20" />
                <span>Đang xử lý...</span>
              </div>
            ) : (
              "Đổi mật khẩu"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
