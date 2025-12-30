// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
// } from '@/components/ui/alert-dialog';
// import { Button } from '@/components/ui/button';
// import { router, useForm } from '@inertiajs/react';
// import { Company, Sponsors } from './types';
// import React, { useState } from 'react';
// import { FileText, Upload, X, AlertCircle } from 'lucide-react';
// import { toast } from 'sonner';
//
// interface OnboardingTabProps {
//     company: Company;
// }
//
// export default function OnboardingTab({ company }: OnboardingTabProps) {
//
//
//     // Calculate checklist stats
//     const totalChecklists =
//         company.total_checklist_count || company.checklists?.length || 0;
//     const completedChecklists =
//         company.completed_checklist_count ||
//         company.checklists?.filter((item) => item.is_completed).length ||
//         0;
//     const checklistPercentage =
//         company.checklist_percentage ||
//         (totalChecklists > 0
//             ? Math.round((completedChecklists / totalChecklists) * 100)
//             : 0);
//
//     return (
//         <div className="space-y-4">
//             <div className="flex justify-between">
//                 <h3 className="mb-3 text-xs font-semibold text-gray-900">
//                     Onboarding Progress
//                 </h3>
//             </div>
//
//             {/* Progress Section */}
//             <div className="space-y-3">
//                 <div>
//                     <div className="mb-1 flex items-center justify-between">
//                         <span className="text-xs font-medium text-gray-700">
//                             Documentation & Checklist
//                         </span>
//                         <span className="text-xs font-semibold text-blue-600">
//                             {checklistPercentage}%
//                         </span>
//                     </div>
//                     <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
//                         <div
//                             className="h-full rounded-full bg-blue-500"
//                             style={{ width: `${checklistPercentage}%` }}
//                         ></div>
//                     </div>
//                     <p className="mt-1 text-[10px] text-gray-500">
//                         {completedChecklists} of {totalChecklists} items
//                         completed
//                     </p>
//                 </div>
//             </div>
//
//             {/* Checklist Items (if available) */}
//             {company.checklists && company.checklists.length > 0 && (
//                 <div className="border-t pt-4">
//                     <h4 className="mb-2 text-xs font-semibold text-gray-900">
//                         Checklist Items
//                     </h4>
//                     <div className="space-y-2">
//                         {company.checklists.map((item) => (
//                             <ChecklistItem
//                                 key={item.id}
//                                 item={item}
//                                 company={company}
//                             />
//                         ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
//
// interface ChecklistItemProps {
//     item: {
//         id: number;
//         title: string;
//         is_completed: boolean;
//     };
//     company: Company;
// }
//
// function ChecklistItem({ item, company }: ChecklistItemProps) {
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [isDialogOpen, setIsDialogOpen] = useState(false);
//
//     const { data, setData, post, processing, errors, reset } = useForm({
//         remarks: '',
//         checklist_item_id: item.id,
//         attachment: null as File | null,
//     });
//
//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0] || null;
//         setSelectedFile(file);
//         setData('attachment', file);
//     };
//
//     const removeFile = () => {
//         setSelectedFile(null);
//         setData('attachment', null);
//         // Reset file input
//         const fileInput = document.getElementById(`attachment-${item.id}`) as HTMLInputElement;
//         if (fileInput) fileInput.value = '';
//     };
//
//     const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//
//         const formData = new FormData();
//         formData.append('remarks', data.remarks);
//         formData.append('checklist_item_id', data.checklist_item_id.toString());
//         if (data.attachment) {
//             formData.append('attachment', data.attachment);
//         }
//
//         post(`/companies/${company.id}/remarks`, {
//             forceFormData: true,
//             onSuccess: () => {
//                 setIsDialogOpen(false);
//                 reset();
//                 setSelectedFile(null);
//             },
//             onError: () => {
//                 // Keep dialog open to show errors
//             },
//         });
//     };
//
//     const handleCancel = () => {
//         setIsDialogOpen(false);
//         reset();
//         setSelectedFile(null);
//     };
//
//     return (
//         <div className="flex justify-between items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
//             <div className="flex items-center gap-3">
//                 <div className={`flex h-6 w-6 items-center justify-center rounded ${item.is_completed ? 'bg-green-100' : 'bg-gray-100'}`}>
//                     {item.is_completed ? (
//                         <span className="text-xs font-medium text-green-600">✓</span>
//                     ) : (
//                         <span className="text-xs font-medium text-gray-600">{item.id}</span>
//                     )}
//                 </div>
//                 <span className={`text-sm ${item.is_completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
//                     {item.title}
//                 </span>
//             </div>
//             <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//                 <AlertDialogTrigger asChild>
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setIsDialogOpen(true)}
//                         disabled={item.is_completed}
//                     >
//                         <FileText className="h-4 w-4 mr-2" />
//                         {item.is_completed ? 'View Remarks' : 'Add Remarks'}
//                     </Button>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent className="max-w-lg">
//                     <AlertDialogHeader>
//                         <AlertDialogTitle className="flex items-center gap-2">
//                             <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100">
//                                 <FileText className="h-5 w-5 text-blue-600" />
//                             </div>
//                             <div>
//                                 <div className="text-sm font-normal text-gray-500">Add Remarks</div>
//                                 <div>{item.title}</div>
//                             </div>
//                         </AlertDialogTitle>
//                         <AlertDialogDescription className="pt-2">
//                             Add supporting remarks and upload documents for this checklist item.
//                         </AlertDialogDescription>
//                     </AlertDialogHeader>
//
//                     <form onSubmit={handleSubmit}>
//                         <div className="grid gap-4 py-4">
//                             {/* Hidden input for checklist_item_id */}
//                             <input
//                                 type="hidden"
//                                 name="checklist_item_id"
//                                 value={item.id}
//                             />
//
//                             {/* Remarks Field */}
//                             <div className="space-y-2">
//                                 <label htmlFor={`remarks-${item.id}`} className="text-sm font-medium">
//                                     Remarks <span className="text-red-500">*</span>
//                                 </label>
//                                 <textarea
//                                     id={`remarks-${item.id}`}
//                                     value={data.remarks}
//                                     onChange={(e) => setData('remarks', e.target.value)}
//                                     required
//                                     rows={4}
//                                     className={`w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.remarks ? 'border-red-300' : 'border-gray-300'}`}
//                                     placeholder="Enter detailed remarks here..."
//                                 />
//                                 {errors.remarks && (
//                                     <div className="flex items-center gap-1 text-sm text-red-600">
//                                         <AlertCircle className="h-4 w-4" />
//                                         <span>{errors.remarks}</span>
//                                     </div>
//                                 )}
//                                 <p className="text-xs text-gray-500">
//                                     Minimum 10 characters required
//                                 </p>
//                             </div>
//
//                             {/* File Upload Field */}
//                             <div className="space-y-2">
//                                 <label htmlFor={`attachment-${item.id}`} className="text-sm font-medium">
//                                     Supporting Document (Optional)
//                                 </label>
//
//                                 {selectedFile ? (
//                                     <div className="rounded-lg border border-green-200 bg-green-50 p-3">
//                                         <div className="flex items-center justify-between">
//                                             <div className="flex items-center gap-2">
//                                                 <FileText className="h-5 w-5 text-green-600" />
//                                                 <div>
//                                                     <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
//                                                     <p className="text-xs text-gray-500">
//                                                         {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                             <Button
//                                                 type="button"
//                                                 variant="ghost"
//                                                 size="sm"
//                                                 onClick={removeFile}
//                                             >
//                                                 <X className="h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 ) : (
//                                     <div className="relative">
//                                         <input
//                                             type="file"
//                                             id={`attachment-${item.id}`}
//                                             onChange={handleFileChange}
//                                             className="hidden"
//                                             accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
//                                         />
//                                         <label
//                                             htmlFor={`attachment-${item.id}`}
//                                             className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors"
//                                         >
//                                             <Upload className="h-8 w-8 text-gray-400" />
//                                             <span className="mt-2 text-sm font-medium text-gray-900">
//                                                 Click to upload or drag and drop
//                                             </span>
//                                             <span className="mt-1 text-xs text-gray-500">
//                                                 Max file size: 5MB. Allowed: JPG, PNG, PDF, DOC, XLS
//                                             </span>
//                                         </label>
//                                     </div>
//                                 )}
//
//                                 {errors.attachment && (
//                                     <div className="flex items-center gap-1 text-sm text-red-600">
//                                         <AlertCircle className="h-4 w-4" />
//                                         <span>{errors.attachment}</span>
//                                     </div>
//                                 )}
//                             </div>
//
//                             {/* General errors */}
//                             {errors.checklist_item_id && (
//                                 <div className="rounded-md bg-red-50 p-3">
//                                     <div className="flex items-center gap-2 text-sm text-red-800">
//                                         <AlertCircle className="h-4 w-4" />
//                                         <span>{errors.checklist_item_id}</span>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//
//                         <AlertDialogFooter>
//                             <AlertDialogCancel
//                                 type="button"
//                                 onClick={handleCancel}
//                                 disabled={processing}
//                             >
//                                 Cancel
//                             </AlertDialogCancel>
//                             <AlertDialogAction
//                                 type="submit"
//                                 disabled={processing || !data.remarks.trim()}
//                                 className="bg-blue-600 hoveaar:bg-blue-700"
//                             >
//                                 {processing ? (
//                                     <>
//                                         <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
//                                         Saving...
//                                     </>
//                                 ) : (
//                                     'Save Remarks'
//                                 )}
//                             </AlertDialogAction>
//                         </AlertDialogFooter>
//                     </form>
//                 </AlertDialogContent>
//             </AlertDialog>
//         </div>
//     );
// }
