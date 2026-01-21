"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormikField } from "@/components/ui/formik-form";

interface AdditionalInfoData {
  socialLinks: {
    facebook: string | null;
    linkedIn: string | null;
    website: string | null;
  };
  bankInfo: string;
  taxId: string | null;
}

interface Step6Props {
  onNext: (data: AdditionalInfoData) => void;
  onBack: () => void;
  initialData?: AdditionalInfoData;
}

const validationSchema = Yup.object({
  bankInfo: Yup.string().required("Vui lòng nhập thông tin ngân hàng"),
  taxId: Yup.string().nullable(),
  facebook: Yup.string().url("URL không hợp lệ").nullable(),
  linkedIn: Yup.string().url("URL không hợp lệ").nullable(),
  website: Yup.string().url("URL không hợp lệ").nullable(),
});

export default function Step6AdditionalInfo({ onNext, onBack, initialData }: Step6Props) {
  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Thông tin bổ sung</h2>
        <p className="text-gray-600">Thông tin thanh toán và mạng xã hội</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Thông tin thanh toán</h3>
        <p className="text-sm text-gray-600">Thông tin để nhận thanh toán từ khóa học</p>
        
        <Formik
            initialValues={{
              bankInfo: initialData?.bankInfo || "",
              taxId: initialData?.taxId || "",
              facebook: initialData?.socialLinks?.facebook || "",
              linkedIn: initialData?.socialLinks?.linkedIn || "",
              website: initialData?.socialLinks?.website || "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onNext({
                bankInfo: values.bankInfo,
                taxId: values.taxId || null,
                socialLinks: {
                  facebook: values.facebook || null,
                  linkedIn: values.linkedIn || null,
                  website: values.website || null,
                },
              });
            }}
          >
            {({ isValid }) => (
              <Form className="space-y-6">
                <FormikField
                  name="bankInfo"
                  label="Thông tin ngân hàng"
                  placeholder="VD: Vietcombank - 1234567890 - Nguyễn Văn A"
                />

                <FormikField
                  name="taxId"
                  label="Mã số thuế"
                  placeholder="VD: 0123456789"
                />

                <div className="border-t pt-6 mt-6">
                  <h3 className="font-semibold mb-4">Liên kết mạng xã hội</h3>
                  
                  <div className="space-y-4">
                    <FormikField
                      name="facebook"
                      label="Facebook"
                      placeholder="https://facebook.com/yourprofile"
                    />

                    <FormikField
                      name="linkedIn"
                      label="LinkedIn"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />

                    <FormikField
                      name="website"
                      label="Website cá nhân"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

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
