"use client";

import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormikField } from "@/components/ui/formik-form";
import { Plus, Trash2 } from "lucide-react";

interface Certificate {
  name: string;
  url: string;
  issuer: string;
  year: number;
}

interface Step4Props {
  onNext: (data: { certificates: Certificate[] }) => void;
  onBack: () => void;
  initialData?: { certificates: Certificate[] };
}

const validationSchema = Yup.object({
  certificates: Yup.array().of(
    Yup.object({
      name: Yup.string().required("Vui lòng nhập tên chứng chỉ"),
      url: Yup.string().url("URL không hợp lệ").required("Vui lòng nhập link chứng chỉ"),
      issuer: Yup.string().required("Vui lòng nhập tổ chức cấp"),
      year: Yup.number().required("Vui lòng nhập năm cấp").min(1950).max(new Date().getFullYear()),
    })
  ).min(1, "Vui lòng thêm ít nhất một chứng chỉ"),
});

export default function Step4Certificates({ onNext, onBack, initialData }: Step4Props) {
  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Chứng chỉ</h2>
        <p className="text-gray-600">Thêm các chứng chỉ và giấy chứng nhận của bạn</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Chứng chỉ chuyên môn</h3>
        <p className="text-sm text-gray-600">Liệt kê các chứng chỉ liên quan đến lĩnh vực giảng dạy</p>
        
        <Formik
            initialValues={{
              certificates: initialData?.certificates && initialData.certificates.length > 0
                ? initialData.certificates
                : [{ name: "", url: "", issuer: "", year: new Date().getFullYear() }],
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onNext({ certificates: values.certificates });
            }}
          >
            {({ values, isValid }) => (
              <Form className="space-y-6">
                <FieldArray name="certificates">
                  {({ push, remove }) => (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
                      {values.certificates.map((_, index) => (
                        <Card key={index} className="border-2">
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="font-semibold">Chứng chỉ #{index + 1}</h4>
                                {values.certificates.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => remove(index)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </Button>
                                )}
                              </div>

                              <FormikField
                                name={`certificates.${index}.name`}
                                label="Tên chứng chỉ"
                                placeholder="VD: AWS Certified Solutions Architect"
                              />

                              <FormikField
                                name={`certificates.${index}.issuer`}
                                label="Tổ chức cấp"
                                placeholder="VD: Amazon Web Services"
                              />

                              <FormikField
                                name={`certificates.${index}.url`}
                                label="Link chứng chỉ"
                                placeholder="https://..."
                                type="url"
                              />

                              <FormikField
                                name={`certificates.${index}.year`}
                                label="Năm cấp"
                                type="number"
                                placeholder="2023"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => push({ name: "", url: "", issuer: "", year: new Date().getFullYear() })}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm chứng chỉ
                      </Button>
                    </div>
                  )}
                </FieldArray>

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
