"use client";

import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormikField } from "@/components/ui/formik-form";
import { Plus, Trash2 } from "lucide-react";

interface WorkExperience {
  company: string;
  role: string;
  from: string;
  to: string;
}

interface Step5Props {
  onNext: (data: { workExperience: WorkExperience[] }) => void;
  onBack: () => void;
  initialData?: { workExperience: WorkExperience[] };
}

const validationSchema = Yup.object({
  workExperience: Yup.array().of(
    Yup.object({
      company: Yup.string().required("Vui lòng nhập tên công ty"),
      role: Yup.string().required("Vui lòng nhập vị trí"),
      from: Yup.string().required("Vui lòng nhập thời gian bắt đầu"),
      to: Yup.string().required("Vui lòng nhập thời gian kết thúc"),
    })
  ).min(1, "Vui lòng thêm ít nhất một kinh nghiệm làm việc"),
});

export default function Step5WorkExperience({ onNext, onBack, initialData }: Step5Props) {
  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Kinh nghiệm làm việc</h2>
        <p className="text-gray-600">Chia sẻ kinh nghiệm làm việc của bạn</p>
      </div>

      <div className="space-y-4">
        <Formik
            initialValues={{
              workExperience: initialData?.workExperience && initialData.workExperience.length > 0
                ? initialData.workExperience
                : [{ company: "", role: "", from: "", to: "" }],
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onNext({ workExperience: values.workExperience });
            }}
          >
            {({ values, isValid }) => (
              <Form className="space-y-6">
                <FieldArray name="workExperience">
                  {({ push, remove }) => (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
                      {values.workExperience.map((_, index) => (
                        <Card key={index} className="border-2">
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="font-semibold">Kinh nghiệm #{index + 1}</h4>
                                {values.workExperience.length > 1 && (
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
                                name={`workExperience.${index}.company`}
                                label="Công ty"
                                placeholder="VD: FPT Software"
                              />

                              <FormikField
                                name={`workExperience.${index}.role`}
                                label="Vị trí"
                                placeholder="VD: Senior Full-stack Developer"
                              />

                              <div className="grid grid-cols-2 gap-4">
                                <FormikField
                                  name={`workExperience.${index}.from`}
                                  label="Từ"
                                  type="month"
                                />

                                <FormikField
                                  name={`workExperience.${index}.to`}
                                  label="Đến"
                                  type="month"
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
                        onClick={() => push({ company: "", role: "", from: "", to: "" })}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm kinh nghiệm
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
