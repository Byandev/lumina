// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from '@/components/ui/dialog';
//
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
//
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
//
// import { useForm } from '@inertiajs/react';
// import {
//     AlertCircle,
//     Calendar,
//     CheckCircle,
//     DollarSign,
//     FileText,
//     Package,
//     Plus,
//     Target,
//     TrendingUp,
//     Trash2,
//     Edit,
//     Upload,
//     X,
//     Loader2,
// } from 'lucide-react';
// import { ChangeEvent, useState, useRef } from 'react';
// import { Textarea } from '@headlessui/react';
//
// interface PerformanceRecord {
//     id?: number;
//     start_date: string;
//     end_date: string;
//     phase: string;
//     no_of_items: number;
//     avg_ads_spent: string;
//     roas: string;
//     rts: string;
//     highlights: string;
//     challenges: string;
//     action_plan: string;
//     attachment_path: string | null;
// }
//
// type FormData = {
//     start_date: string;
//     end_date: string;
//     phase: string;
//     no_of_items: number;
//     avg_ads_spent: string;
//     roas: string;
//     rts: string;
//     highlights: string;
//     challenges: string;
//     action_plan: string;
//     attachment_path: File | null;
// };
//
// export default function PerformanceTab() {
//     const [isOpen, setIsOpen] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [editingRecord, setEditingRecord] =
//         useState<PerformanceRecord | null>(null);
//     const [fileName, setFileName] = useState<string>('');
//     const fileInputRef = useRef<HTMLInputElement>(null);
//
//     // Mock data
//     const [performanceRecords, setPerformanceRecords] = useState<
//         PerformanceRecord[]
//     >([
//         {
//             id: 1,
//             start_date: '2024-01-01',
//             end_date: '2024-01-31',
//             phase: 'Testing',
//             no_of_items: 150,
//             avg_ads_spent: '5000.00',
//             roas: '3.5',
//             rts: '85.5',
//             highlights:
//                 'Successful launch with strong initial sales. Exceeded sales targets by 20%.',
//             challenges:
//                 'Initial ad costs were higher than expected. Inventory management issues.',
//             action_plan:
//                 'Optimize ad targeting and reduce CPA. Implement better inventory tracking.',
//             attachment_path: '/reports/q1-2024.pdf',
//         },
//     ]);
//
//     const { data, setData, post, put, processing, errors, reset, clearErrors } =
//         useForm<FormData>({
//             start_date: '',
//             end_date: '',
//             phase: '',
//             no_of_items: 0,
//             avg_ads_spent: '0.00',
//             roas: '0.00',
//             rts: '0.00',
//             highlights: '',
//             challenges: '',
//             action_plan: '',
//             attachment_path: null,
//         });
//
//     const phases = ['Scaling', 'Testing'];
//
//     const handleClose = () => {
//         setIsOpen(false);
//         setIsEditing(false);
//         setEditingRecord(null);
//         setFileName('');
//         clearErrors();
//         reset();
//     };
//
//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//
//         if (editingRecord?.id) {
//             put(`/performance/${editingRecord.id}`, {
//                 preserveScroll: true,
//                 forceFormData: true,
//                 onSuccess: () => handleClose(),
//             });
//         } else {
//             post('/performance', {
//                 preserveScroll: true,
//                 forceFormData: true,
//                 onSuccess: () => handleClose(),
//             });
//         }
//     };
//
//     const handleEdit = (record: PerformanceRecord) => {
//         setEditingRecord(record);
//         setIsEditing(true);
//
//         setData({
//             start_date: record.start_date,
//             end_date: record.end_date,
//             phase: record.phase,
//             no_of_items: record.no_of_items,
//             avg_ads_spent: record.avg_ads_spent,
//             roas: record.roas,
//             rts: record.rts,
//             highlights: record.highlights,
//             challenges: record.challenges,
//             action_plan: record.action_plan,
//             attachment_path: null,
//         });
//
//         setIsOpen(true);
//     };
//
//     const handleDelete = (id: number) => {
//         if (confirm('Delete this performance record?')) {
//             setPerformanceRecords((prev) => prev.filter((r) => r.id !== id));
//         }
//     };
//
//     const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0] ?? null;
//         setData('attachment_path', file);
//         setFileName(file ? file.name : '');
//     };
//
//     const handleRemoveFile = () => {
//         setData('attachment_path', null);
//         setFileName('');
//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }
//     };
//
//     const formatCurrency = (amount: string) => {
//         const n = Number(amount || 0);
//         return new Intl.NumberFormat('en-US', {
//             style: 'currency',
//             currency: 'USD',
//             minimumFractionDigits: 2,
//         }).format(Number.isFinite(n) ? n : 0);
//     };
//
//     const getPhaseColor = (phase: string) => {
//         const colors: Record<string, string> = {
//             Testing: 'bg-blue-100 text-blue-800',
//             Scaling: 'bg-green-100 text-green-800',
//         };
//         return colors[phase] || 'bg-gray-100 text-gray-800';
//     };
//
//     const getRoasColor = (roas: string) => {
//         const v = parseFloat(roas);
//         if (v >= 4) return 'text-green-600';
//         if (v >= 2) return 'text-yellow-600';
//         return 'text-red-600';
//     };
//
//     return (
//         <div className="space-y-4">
//             {/* Compact Header */}
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h3 className="font-semibold text-gray-900">
//                         Performance Metrics
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                         Track business performance
//                     </p>
//                 </div>
//                 <Button
//                     size="sm"
//                     onClick={() => {
//                         setIsOpen(true);
//                         setIsEditing(false);
//                         setEditingRecord(null);
//                         clearErrors();
//                         reset();
//                     }}
//                 >
//                     <Plus className="mr-2 h-4 w-4" />
//                     Add Record
//                 </Button>
//             </div>
//
//             {/* Records Grid */}
//             {performanceRecords.length === 0 ? (
//                 <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
//                     <TrendingUp className="mx-auto mb-3 h-10 w-10 text-gray-400" />
//                     <h3 className="mb-2 text-sm font-semibold text-gray-900">
//                         No records yet
//                     </h3>
//                     <p className="mb-4 text-sm text-gray-500">
//                         Start tracking your performance
//                     </p>
//                     <Button size="sm" onClick={() => setIsOpen(true)}>
//                         <Plus className="mr-2 h-4 w-4" />
//                         Create First Record
//                     </Button>
//                 </div>
//             ) : (
//                 <div className="space-y-3">
//                     {performanceRecords.map((record) => (
//                         <div
//                             key={record.id}
//                             className="rounded-lg border border-gray-200 bg-white p-4"
//                         >
//                             {/* Header */}
//                             <div className="mb-3 flex items-start justify-between">
//                                 <div>
//                                     <div className="mb-1 flex items-center gap-2">
//                                         <span
//                                             className={`rounded-full px-2 py-1 text-xs ${getPhaseColor(record.phase)}`}
//                                         >
//                                             {record.phase}
//                                         </span>
//                                         <span className="text-xs text-gray-500">
//                                             {record.start_date} -{' '}
//                                             {record.end_date}
//                                         </span>
//                                     </div>
//                                     <h4 className="font-medium text-gray-900">
//                                         Performance Report
//                                     </h4>
//                                 </div>
//                                 <div className="flex gap-1">
//                                     <Button
//                                         size="sm"
//                                         variant="ghost"
//                                         onClick={() => handleEdit(record)}
//                                         className="h-8 w-8 p-0"
//                                     >
//                                         <Edit className="h-3.5 w-3.5" />
//                                     </Button>
//                                     <Button
//                                         size="sm"
//                                         variant="ghost"
//                                         onClick={() =>
//                                             record.id && handleDelete(record.id)
//                                         }
//                                         className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
//                                     >
//                                         <Trash2 className="h-3.5 w-3.5" />
//                                     </Button>
//                                 </div>
//                             </div>
//
//                             {/* Metrics */}
//                             <div className="mb-4 grid grid-cols-2 gap-3">
//                                 <div>
//                                     <div className="mb-1 flex items-center gap-1 text-xs text-gray-600">
//                                         <Package className="h-3 w-3" />
//                                         Items
//                                     </div>
//                                     <div className="font-semibold text-gray-900">
//                                         {record.no_of_items.toLocaleString()}
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <div className="mb-1 flex items-center gap-1 text-xs text-gray-600">
//                                         <DollarSign className="h-3 w-3" />
//                                         Ad Spend
//                                     </div>
//                                     <div className="font-semibold text-gray-900">
//                                         {formatCurrency(record.avg_ads_spent)}
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <div className="mb-1 flex items-center gap-1 text-xs text-gray-600">
//                                         <Target className="h-3 w-3" />
//                                         ROAS
//                                     </div>
//                                     <div
//                                         className={`font-semibold ${getRoasColor(record.roas)}`}
//                                     >
//                                         {record.roas}x
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <div className="mb-1 flex items-center gap-1 text-xs text-gray-600">
//                                         <TrendingUp className="h-3 w-3" />
//                                         RTS
//                                     </div>
//                                     <div className="font-semibold text-gray-900">
//                                         {record.rts}%
//                                     </div>
//                                 </div>
//                             </div>
//
//                             {/* Content Preview */}
//                             <div className="space-y-2">
//                                 <div className="flex items-center gap-2">
//                                     <CheckCircle className="h-3.5 w-3.5 text-green-500" />
//                                     <span className="text-xs font-medium">
//                                         Highlights
//                                     </span>
//                                 </div>
//                                 <p className="line-clamp-2 text-xs text-gray-600">
//                                     {record.highlights}
//                                 </p>
//                             </div>
//
//                             {/* Attachment */}
//                             {record.attachment_path && (
//                                 <div className="mt-3 border-t border-gray-100 pt-3">
//                                     <div className="flex items-center gap-2">
//                                         <FileText className="h-3.5 w-3.5 text-gray-400" />
//                                         <a
//                                             href={record.attachment_path}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             className="text-xs text-blue-600 hover:text-blue-800"
//                                         >
//                                             View Report
//                                         </a>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             )}
//
//             {/* Compact Dialog - FIXED VERSION */}
//             <Dialog open={isOpen} onOpenChange={setIsOpen}>
//                 <DialogContent className="flex h-[85vh] flex-col p-0 sm:max-w-[600px]">
//                     {/* Fixed Header */}
//                     <div className="shrink-0 border-b border-gray-200 px-6 py-4">
//                         <DialogHeader>
//                             <DialogTitle className="flex items-center gap-2">
//                                 {isEditing ? (
//                                     <>
//                                         <Edit className="h-5 w-5 text-blue-600" />
//                                         Edit Record
//                                     </>
//                                 ) : (
//                                     <>
//                                         <Plus className="h-5 w-5 text-green-600" />
//                                         New Record
//                                     </>
//                                 )}
//                             </DialogTitle>
//                             <DialogDescription>
//                                 {isEditing
//                                     ? 'Update performance metrics'
//                                     : 'Add new performance record'}
//                             </DialogDescription>
//                         </DialogHeader>
//                     </div>
//
//                     {/* Scrollable Content */}
//                     <div className="flex-1 overflow-y-auto">
//                         <form
//                             onSubmit={handleSubmit}
//                             className="space-y-4 px-6 py-4"
//                         >
//                             {/* Date & Phase */}
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="space-y-2">
//                                     <Label
//                                         htmlFor="start_date"
//                                         className="text-xs font-medium"
//                                     >
//                                         Start Date *
//                                     </Label>
//                                     <Input
//                                         id="start_date"
//                                         type="date"
//                                         value={data.start_date}
//                                         onChange={(e) =>
//                                             setData(
//                                                 'start_date',
//                                                 e.target.value,
//                                             )
//                                         }
//                                         required
//                                         disabled={processing}
//                                         className="h-9 text-sm"
//                                     />
//                                     {errors.start_date && (
//                                         <p className="text-xs text-red-500">
//                                             {errors.start_date}
//                                         </p>
//                                     )}
//                                 </div>
//
//                                 <div className="space-y-2">
//                                     <Label
//                                         htmlFor="end_date"
//                                         className="text-xs font-medium"
//                                     >
//                                         End Date *
//                                     </Label>
//                                     <Input
//                                         id="end_date"
//                                         type="date"
//                                         value={data.end_date}
//                                         onChange={(e) =>
//                                             setData('end_date', e.target.value)
//                                         }
//                                         required
//                                         disabled={processing}
//                                         className="h-9 text-sm"
//                                     />
//                                     {errors.end_date && (
//                                         <p className="text-xs text-red-500">
//                                             {errors.end_date}
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>
//
//                             <div className="space-y-2">
//                                 <Label className="text-xs font-medium">
//                                     Phase *
//                                 </Label>
//                                 <Select
//                                     value={data.phase}
//                                     onValueChange={(v) => setData('phase', v)}
//                                     disabled={processing}
//                                 >
//                                     <SelectTrigger className="h-9 text-sm">
//                                         <SelectValue placeholder="Select phase" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {phases.map((phase) => (
//                                             <SelectItem
//                                                 key={phase}
//                                                 value={phase}
//                                                 className="text-sm"
//                                             >
//                                                 {phase}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                                 {errors.phase && (
//                                     <p className="text-xs text-red-500">
//                                         {errors.phase}
//                                     </p>
//                                 )}
//                             </div>
//
//                             {/* Metrics */}
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="space-y-2">
//                                     <Label
//                                         htmlFor="no_of_items"
//                                         className="text-xs font-medium"
//                                     >
//                                         Items Sold *
//                                     </Label>
//                                     <Input
//                                         id="no_of_items"
//                                         type="number"
//                                         min="0"
//                                         value={data.no_of_items}
//                                         onChange={(e) =>
//                                             setData(
//                                                 'no_of_items',
//                                                 parseInt(
//                                                     e.target.value || '0',
//                                                     10,
//                                                 ) || 0,
//                                             )
//                                         }
//                                         required
//                                         disabled={processing}
//                                         className="h-9 text-sm"
//                                         placeholder="0"
//                                     />
//                                     {errors.no_of_items && (
//                                         <p className="text-xs text-red-500">
//                                             {errors.no_of_items}
//                                         </p>
//                                     )}
//                                 </div>
//
//                                 <div className="space-y-2">
//                                     <Label
//                                         htmlFor="avg_ads_spent"
//                                         className="text-xs font-medium"
//                                     >
//                                         Ad Spend *
//                                     </Label>
//                                     <Input
//                                         id="avg_ads_spent"
//                                         type="number"
//                                         min="0"
//                                         step="0.01"
//                                         value={data.avg_ads_spent}
//                                         onChange={(e) =>
//                                             setData(
//                                                 'avg_ads_spent',
//                                                 e.target.value,
//                                             )
//                                         }
//                                         required
//                                         disabled={processing}
//                                         className="h-9 text-sm"
//                                         placeholder="0.00"
//                                     />
//                                     {errors.avg_ads_spent && (
//                                         <p className="text-xs text-red-500">
//                                             {errors.avg_ads_spent}
//                                         </p>
//                                     )}
//                                 </div>
//
//                                 <div className="space-y-2">
//                                     <Label
//                                         htmlFor="roas"
//                                         className="text-xs font-medium"
//                                     >
//                                         ROAS *
//                                     </Label>
//                                     <Input
//                                         id="roas"
//                                         type="number"
//                                         min="0"
//                                         step="0.1"
//                                         value={data.roas}
//                                         onChange={(e) =>
//                                             setData('roas', e.target.value)
//                                         }
//                                         required
//                                         disabled={processing}
//                                         className="h-9 text-sm"
//                                         placeholder="3.5"
//                                     />
//                                     {errors.roas && (
//                                         <p className="text-xs text-red-500">
//                                             {errors.roas}
//                                         </p>
//                                     )}
//                                 </div>
//
//                                 <div className="space-y-2">
//                                     <Label
//                                         htmlFor="rts"
//                                         className="text-xs font-medium"
//                                     >
//                                         RTS (%) *
//                                     </Label>
//                                     <Input
//                                         id="rts"
//                                         type="number"
//                                         min="0"
//                                         max="100"
//                                         step="0.1"
//                                         value={data.rts}
//                                         onChange={(e) =>
//                                             setData('rts', e.target.value)
//                                         }
//                                         required
//                                         disabled={processing}
//                                         className="h-9 text-sm"
//                                         placeholder="85.5"
//                                     />
//                                     {errors.rts && (
//                                         <p className="text-xs text-red-500">
//                                             {errors.rts}
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>
//
//                             {/* Text Areas */}
//                             <div className="space-y-3">
//                                 <div className="space-y-2">
//                                     <Label
//                                         htmlFor="highlights"
//                                         className="text-xs font-medium"
//                                     >
//                                         Highlights
//                                     </Label>
//                                     <textarea
//                                         id="highlights"
//                                         value={data.highlights}
//                                         onChange={(e) =>
//                                             setData(
//                                                 'highlights',
//                                                 e.target.value,
//                                             )
//                                         }
//                                         placeholder="Key achievements..."
//                                         rows={2}
//                                         disabled={processing}
//                                         className="min-h-[80px] w-full rounded-lg border border-gray-300 bg-transparent p-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
//                                     />
//                                     {errors.highlights && (
//                                         <p className="text-xs text-red-500">
//                                             {errors.highlights}
//                                         </p>
//                                     )}
//                                 </div>
//
//                                 <div className="space-y-2">
//                                     <Label
//                                         htmlFor="challenges"
//                                         className="text-xs font-medium"
//                                     >
//                                         Challenges
//                                     </Label>
//                                     <textarea
//                                         id="challenges"
//                                         value={data.challenges}
//                                         onChange={(e) =>
//                                             setData(
//                                                 'challenges',
//                                                 e.target.value,
//                                             )
//                                         }
//                                         placeholder="Challenges faced..."
//                                         rows={2}
//                                         disabled={processing}
//                                         className="min-h-[80px] w-full rounded-lg border border-gray-300 bg-transparent p-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
//                                     />
//                                     {errors.challenges && (
//                                         <p className="text-xs text-red-500">
//                                             {errors.challenges}
//                                         </p>
//                                     )}
//                                 </div>
//
//                                 <div className="space-y-2">
//                                     <Label
//                                         htmlFor="action_plan"
//                                         className="text-xs font-medium"
//                                     >
//                                         Action Plan
//                                     </Label>
//                                     <textarea
//                                         id="action_plan"
//                                         value={data.action_plan}
//                                         onChange={(e) =>
//                                             setData(
//                                                 'action_plan',
//                                                 e.target.value,
//                                             )
//                                         }
//                                         placeholder="Next steps..."
//                                         rows={2}
//                                         disabled={processing}
//                                         className="min-h-[80px] w-full rounded-lg border border-gray-300 bg-transparent p-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
//                                     />
//                                     {errors.action_plan && (
//                                         <p className="text-xs text-red-500">
//                                             {errors.action_plan}
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>
//
//                             {/* File Upload */}
//                             <div className="space-y-2">
//                                 <Label className="text-xs font-medium">
//                                     Attachment
//                                 </Label>
//                                 {fileName ? (
//                                     <div className="flex items-center justify-between rounded border border-gray-200 bg-gray-50 px-3 py-2">
//                                         <div className="flex items-center gap-2">
//                                             <FileText className="h-4 w-4 text-gray-500" />
//                                             <span className="max-w-[300px] truncate text-sm">
//                                                 {fileName}
//                                             </span>
//                                         </div>
//                                         <Button
//                                             type="button"
//                                             variant="ghost"
//                                             size="sm"
//                                             onClick={handleRemoveFile}
//                                             className="h-6 w-6 p-0"
//                                         >
//                                             <X className="h-3 w-3" />
//                                         </Button>
//                                     </div>
//                                 ) : (
//                                     <div
//                                         className="cursor-pointer rounded border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/30"
//                                         onClick={() =>
//                                             fileInputRef.current?.click()
//                                         }
//                                     >
//                                         <input
//                                             ref={fileInputRef}
//                                             type="file"
//                                             onChange={handleFileChange}
//                                             disabled={processing}
//                                             className="hidden"
//                                             accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
//                                         />
//                                         <Upload className="mx-auto mb-2 h-5 w-5 text-gray-400" />
//                                         <p className="text-xs text-gray-600">
//                                             Click to upload file
//                                         </p>
//                                         <p className="mt-1 text-xs text-gray-400">
//                                             PDF, Word, Excel, Images
//                                         </p>
//                                     </div>
//                                 )}
//                                 {errors.attachment_path && (
//                                     <p className="text-xs text-red-500">
//                                         {errors.attachment_path}
//                                     </p>
//                                 )}
//                             </div>
//                         </form>
//                     </div>
//
//                     {/* Fixed Footer */}
//                     <DialogFooter className="shrink-0 border-t border-gray-200 px-6 py-4">
//                         <div className="flex w-full items-center justify-between">
//                             <Button
//                                 type="button"
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={handleClose}
//                                 disabled={processing}
//                                 className="px-4"
//                             >
//                                 Cancel
//                             </Button>
//                             <Button
//                                 type="submit"
//                                 size="sm"
//                                 disabled={processing}
//                                 className="px-6"
//                                 onClick={handleSubmit} // Add onClick to handle form submission
//                             >
//                                 {processing ? (
//                                     <>
//                                         <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
//                                         Saving...
//                                     </>
//                                 ) : isEditing ? (
//                                     'Update'
//                                 ) : (
//                                     'Create'
//                                 )}
//                             </Button>
//                         </div>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }
