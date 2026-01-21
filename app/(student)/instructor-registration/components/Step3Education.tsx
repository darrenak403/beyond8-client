"use client";

import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormikField } from "@/components/ui/formik-form";
import { Plus, Trash2 } from "lucide-react";

interface Education {
  school: string;
  degree: string;
  start: number;
  end: number;
}

interface Step3Props {
  onNext: (data: { education: Education[] }) => void;
  onBack: () => void;
  initialData?: { education: Education[] };
}

const validationSchema = Yup.object({
  education: Yup.array().of(
    Yup.object({
      school: Yup.string().required("Vui lòng nhập tên trường"),
      degree: Yup.string().required("Vui lòng nhập bằng cấp"),
      start: Yup.number().required("Vui lòng nhập năm bắt đầu").min(1950).max(new Date().getFullYear()),
      end: Yup.number().required("Vui lòng nhập năm kết thúc").min(1950).max(new Date().getFullYear() + 10),
    })
  ).min(1, "Vui lòng thêm ít nhất một học vấn"),
});

export default function Step3Education({ onNext, onBack, initialData }: Step3Props) {
  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Học vấn</h2>
        <p className="text-gray-600">Thêm thông tin về trình độ học vấn của bạn</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Quá trình học tập</h3>
        <p className="text-sm text-gray-600">Liệt kê các bằng cấp và chứng chỉ của bạn</p>
        
        <Formik
            initialValues={{
              education: initialData?.education && initialData.education.length > 0
                ? initialData.education
                : [{ school: "", degree: "", start: new Date().getFullYear(), end: new Date().getFullYear() }],
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onNext({ education: values.education });
            }}
          >
            {({ values, isValid }) => (
              <Form className="space-y-6">
                <FieldArray name="education">
                  {({ push, remove }) => (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
                      {values.education.map((_, index) => (
                        <Card key={index} className="border-2">
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="font-semibold">Học vấn #{index + 1}</h4>
                                {values.education.length > 1 && (
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
                                name={`education.${index}.school`}
                                label="Tên trường"
                                placeholder="VD: Đại học Bách Khoa Hà Nội"
                              />

                              <FormikField
                                name={`education.${index}.degree`}
                                label="Bằng cấp"
                                placeholder="VD: Cử nhân Khoa học Máy tính"
                              />

                              <div className="grid grid-cols-2 gap-4">
                                <FormikField
                                  name={`education.${index}.start`}
                                  label="Năm bắt đầu"
                                  type="number"
                                  placeholder="2015"
                                />

                                <FormikField
                                  name={`education.${index}.end`}
                                  label="Năm kết thúc"
                                  type="number"
                                  placeholder="2019"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => push({ school: "", degree: "", start: new Date().getFullYear(), end: new Date().getFullYear() })}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm học vấn
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
