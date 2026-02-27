'use client'

import { GraduationCap, Briefcase, Award, Languages } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InstructorPublicProfile } from '@/lib/api/services/fetchProfile'
import SafeImage from '@/components/ui/SafeImage'

interface InstructorBioProps {
  instructor?: InstructorPublicProfile
  activeTab: 'intro' | 'experience' | 'certificates'
}

export default function InstructorBio({ instructor, activeTab }: InstructorBioProps) {
  if (!instructor) return null

  // Intro Tab Content
  if (activeTab === 'intro') {
    return (
      <div className="space-y-6">
        {/* Bio Section */}
        {instructor.bio && (
          <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors rounded-4xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-4xl">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                Giới thiệu
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative">
                {/* Quote decoration */}
                <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-purple-600 to-pink-600 rounded-full" />
                <div className="pl-6">
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap italic">
                    {instructor.bio}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Expertise Areas */}
        {instructor.expertiseAreas && instructor.expertiseAreas.length > 0 && (
          <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors rounded-4xl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-4xl">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                Lĩnh vực chuyên môn
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {instructor.expertiseAreas.map((area, index) => (
                  <div
                    key={index}
                    className="group p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Award className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {area}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Teaching Languages */}
        {instructor.teachingLanguages && instructor.teachingLanguages.length > 0 && (
          <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors rounded-4xl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-4xl">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Languages className="w-5 h-5 text-purple-600" />
                </div>
                Ngôn ngữ giảng dạy
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3">
                {instructor.teachingLanguages.map((lang, index) => (
                  <div
                    key={index}
                    className="group px-4 py-3 rounded-xl bg-white border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-semibold text-purple-700">
                        {lang}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Experience Tab Content
  if (activeTab === 'experience') {
    return (
      <div className="space-y-6">
        {/* Work Experience */}
        {instructor.workExperience && instructor.workExperience.length > 0 && (
          <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors rounded-4xl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-4xl">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                </div>
                Kinh nghiệm làm việc
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                {instructor.workExperience.map((exp, index) => (
                  <div
                    key={index}
                    className="relative p-5 rounded-2xl border-2 border-purple-100 bg-white hover:border-purple-300 transition-all"
                  >
                    {/* Year Badge - Top Right */}
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                        <span className="text-xs font-semibold text-purple-700">
                          {new Date(exp.from).getFullYear()} - {exp.isCurrentJob ? 'Hiện nay' : new Date(exp.to!).getFullYear()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 pr-32">
                      {/* Icon Badge */}
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-purple-600" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">{exp.role}</h4>
                          <p className="text-sm font-semibold text-purple-600">{exp.company}</p>
                        </div>
                        
                        {exp.description && (
                          <p className="text-sm text-gray-600 leading-relaxed pt-2">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Education */}
        {instructor.education && instructor.education.length > 0 && (
          <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors rounded-4xl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-4xl">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>
                Học vấn
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                {instructor.education.map((edu, index) => (
                  <div
                    key={index}
                    className="relative p-5 rounded-2xl border-2 border-purple-100 bg-white hover:border-purple-300 transition-all"
                  >
                    {/* Year Badge - Top Right */}
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200">
                        <span className="text-xs font-semibold text-pink-700">
                          {edu.start} - {edu.end}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 pr-32">
                      {/* Icon Badge */}
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-pink-600" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">{edu.degree}</h4>
                          <p className="text-sm font-semibold text-pink-600">{edu.school}</p>
                        </div>
                        
                        {edu.fieldOfStudy && (
                          <p className="text-sm text-gray-700 font-medium">
                            {edu.fieldOfStudy}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Certificates Tab Content
  if (activeTab === 'certificates') {
    return (
      <div className="space-y-6">
        {instructor.certificates && instructor.certificates.length > 0 ? (
          <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors rounded-4xl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-4xl">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                Chứng chỉ
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                {instructor.certificates.map((cert, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border-2 border-purple-100 bg-white hover:border-purple-300 transition-all overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row gap-0">
                      {/* Certificate Image - Left */}
                      <div className="md:w-1/3 bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
                        {cert.url ? (
                          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-purple-200 bg-white">
                            <SafeImage
                              src={cert.url}
                              alt={cert.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-full aspect-[4/3] rounded-xl border-2 border-purple-200 bg-white flex items-center justify-center">
                            <Award className="w-16 h-16 text-purple-400" />
                          </div>
                        )}
                      </div>

                      {/* Certificate Info - Right */}
                      <div className="md:w-2/3 p-6 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-1">{cert.name}</h4>
                            <p className="text-sm font-medium text-purple-600">{cert.issuer}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                              <span className="text-xs font-semibold text-purple-700">
                                Năm cấp: {cert.year}
                              </span>
                            </div>
                          </div>
                        </div>

                        {cert.url && (
                          <div className="mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-900 rounded-xl font-semibold"
                              asChild
                            >
                              <a href={cert.url} target="_blank" rel="noopener noreferrer">
                                Xem chứng chỉ
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-purple-100 rounded-4xl">
            <CardContent className="py-12 text-center">
              <Award className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <p className="text-gray-500">Chưa có chứng chỉ nào</p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return null
}
