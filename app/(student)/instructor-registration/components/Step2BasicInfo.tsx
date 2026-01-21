"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormikField } from "@/components/ui/formik-form";

interface BasicInfoData {
  bio: string;
  headline: string;
  expertiseAreas: string[];
}

interface Step2Props {
  onNext: (data: BasicInfoData) => void;
  onBack: () => void;
  initialData?: BasicInfoData;
}

const validationSchema = Yup.object({
  bio: Yup.string().required("Vui lòng nhập tiểu sử").min(50, "Tiểu sử phải có ít nhất 50 ký tự"),
  headline: Yup.string().required("Vui lòng nhập tiêu đề").max(100, "Tiêu đề không quá 100 ký tự"),
  expertiseAreas: Yup.string().required("Vui lòng nhập lĩnh vực chuyên môn"),
});

export default function Step2BasicInfo({ onNext, onBack, initialData }: Step2Props) {
  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Thông tin cơ bản</h2>
        <p className="text-gray-600">Giới thiệu về bản thân và lĩnh vực chuyên môn của bạn</p>
      </div>

      <div className="space-y-4">
        <Formik
            initialValues={{
              headline: initialData?.headline || "",
              bio: initialData?.bio || "",
              expertiseAreas: initialData?.expertiseAreas?.join(", ") || "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onNext({
                headline: values.headline,
                bio: values.bio,
                expertiseAreas: values.expertiseAreas.split(",").map(area => area.trim()).filter(Boolean),
              });
            }}
          >
            {({ isValid }) => (
              <Form className="space-y-6">
                <FormikField
                  name="headline"
                  label="Tiêu đề chuyên môn"
                  placeholder="VD: Chuyên gia lập trình Full-stack với 10 năm kinh nghiệm"
                />

                <FormikField
                  name="bio"
                  label="Tiểu sử"
                  placeholder="Giới thiệu về bản thân, kinh nghiệm, thành tựu..."
                  as="textarea"
                  rows={6}
                />

                <FormikField
                  name="expertiseAreas"
                  label="Lĩnh vực chuyên môn"
                  placeholder="VD: JavaScript, React, Node.js, Python (phân cách bằng dấu phẩy)"
                />

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={onBack}>
                    Quay lại
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isValid}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Tiếp theo
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
      </div>
    </div>
  );
}
