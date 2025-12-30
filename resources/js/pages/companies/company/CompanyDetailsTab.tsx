// import { Button } from '@/components/ui/button';
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { router } from '@inertiajs/react';
// import { format } from 'date-fns';
// import {
//     BarChart,
//     Building,
//     Edit,
//     Info,
//     Mail,
//     MapPin,
//     Percent,
//     Phone,
//     Plus,
//     Target,
//     Trash2,
//     TrendingUp,
//     Users,
// } from 'lucide-react';
// import React, { ChangeEvent, useState } from 'react';
//
// import {
//     Company,
//     CompanyFormData,
//     Owner,
//     OwnerFormData,
//     Sponsor,
// } from './types'; // Remove Sponsors import
//
// interface CompanyDetailsTabProps {
//     company: Company;
//     isEditingCompany: boolean;
//     companyFormData: CompanyFormData;
//     errors: Record<string, string>;
//     sponsors: Sponsor[]; // Change from Sponsors to Sponsor[]
//     onCompanyInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
//     onCompanySelectChange: (name: keyof CompanyFormData, value: string) => void;
// }
//
// const statusOptions = ['active', 'inactive', 'terminated'];
// const notarizationOptions = ['pending', 'done', 'rejected'];
// const levelOptions = ['educate', 'empowerment', 'enterprise', 'exponential'];
// const salesActivityOptions = ['generating', 'testing', 'inactive'];
//
// export default function CompanyDetailsTab({
//                                               company,
//                                               isEditingCompany,
//                                               companyFormData,
//                                               errors,
//                                               sponsors,
//                                               onCompanyInputChange,
//                                               onCompanySelectChange,
//                                           }: CompanyDetailsTabProps) {
//     const [isOwnerDialogOpen, setIsOwnerDialogOpen] = useState(false);
//     const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
//     const [ownerFormData, setOwnerFormData] = useState<OwnerFormData>({
//         name: '',
//         email: '',
//         phone: '',
//         facebook: '',
//         address: '',
//         birthdate: '',
//     });
//
//     const getInitials = (name: string) => {
//         return name
//             .split(' ')
//             .map((word) => word[0])
//             .join('')
//             .toUpperCase()
//             .slice(0, 2);
//     };
//
//     const formatDate = (dateString?: string) => {
//         if (!dateString) return 'N/A';
//         try {
//             return format(new Date(dateString), 'MMM dd, yyyy');
//         } catch {
//             return 'N/A';
//         }
//     };
//
//     const getStatusColor = (status?: string | null) => {
//         if (!status) return 'bg-gray-100 text-gray-800';
//
//         const statusLower = status.toLowerCase();
//         if (['active', 'completed', 'done', 'approved'].includes(statusLower)) {
//             return 'bg-green-100 text-green-800';
//         }
//         if (['pending', 'in_progress', 'processing'].includes(statusLower)) {
//             return 'bg-yellow-100 text-yellow-800';
//         }
//         if (
//             ['inactive', 'failed', 'terminated', 'rejected'].includes(
//                 statusLower,
//             )
//         ) {
//             return 'bg-red-100 text-red-800';
//         }
//         return 'bg-gray-100 text-gray-800';
//     };
//
//     const formatStatus = (status?: string | null) => {
//         if (!status) return 'N/A';
//         return (
//             status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')
//         );
//     };
//
//     const handleOwnerInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setOwnerFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };
//
//     const handleOwnerSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//
//         // Prepare data to send (only include fields that have values)
//         const ownerData: Record<string, any> = {
//             name: ownerFormData.name,
//             email: ownerFormData.email,
//         };
//
//         // Add optional fields only if they have values
//         if (ownerFormData.phone) ownerData.phone = ownerFormData.phone;
//         if (ownerFormData.facebook) ownerData.facebook = ownerFormData.facebook;
//         if (ownerFormData.address) ownerData.address = ownerFormData.address;
//         if (ownerFormData.birthdate)
//             ownerData.birthdate = ownerFormData.birthdate;
//
//         if (editingOwner) {
//             router.put(`/owners/${editingOwner.id}`, ownerData, {
//                 onSuccess: () => {
//                     setIsOwnerDialogOpen(false);
//                     setEditingOwner(null);
//                     resetOwnerForm();
//                 },
//             });
//         } else {
//             router.post(
//                 `/companies/${company.id}/owners`,
//                 {
//                     ...ownerData,
//                     company_id: company.id,
//                 },
//                 {
//                     onSuccess: () => {
//                         setIsOwnerDialogOpen(false);
//                         resetOwnerForm();
//                     },
//                 },
//             );
//         }
//     };
//
//     const handleDeleteOwner = (ownerId: number) => {
//         if (confirm('Are you sure you want to delete this owner?')) {
//             router.delete(`/owners/${ownerId}`);
//         }
//     };
//
//     const resetOwnerForm = () => {
//         setOwnerFormData({
//             name: '',
//             email: '',
//             phone: '',
//             facebook: '',
//             address: '',
//             birthdate: '',
//         });
//         setEditingOwner(null);
//     };
//
//     const startEditingOwner = (owner: Owner) => {
//         setEditingOwner(owner);
//         setOwnerFormData({
//             name: owner.name,
//             email: owner.email,
//             phone: owner.phone || '',
//             facebook: owner.facebook || '',
//             address: owner.address || '',
//             birthdate: owner.birthdate || '',
//         });
//         setIsOwnerDialogOpen(true);
//     };
//
//     const openAddOwnerDialog = () => {
//         resetOwnerForm();
//         setIsOwnerDialogOpen(true);
//     };
//
//     return (
//         <>
//             <div className="flex justify-between">
//                 <h3 className="mb-3 text-xs font-semibold text-gray-900">
//                     Company Overview
//                 </h3>
//             </div>
//             <div className="space-y-4">
//                 <div className="flex items-center gap-4">
//                     <div className="h-16 w-16 flex-shrink-0">
//                         {company.logo ? (
//                             <img
//                                 src={
//                                     company.logo_url ||
//                                     `/storage/${company.logo}`
//                                 }
//                                 alt={company.name}
//                                 className="h-16 w-16 rounded-lg border object-cover"
//                             />
//                         ) : (
//                             <div className="flex h-16 w-16 items-center justify-center rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-50">
//                                 <span className="text-xl font-bold text-blue-600">
//                                     {getInitials(company.name)}
//                                 </span>
//                             </div>
//                         )}
//                     </div>
//                     <div className="">
//                         {isEditingCompany ? (
//                             <div className="space-y-2">
//                                 <Input
//                                     name="name"
//                                     value={companyFormData.name}
//                                     onChange={onCompanyInputChange}
//                                     className="text-xl font-semibold"
//                                 />
//                                 {errors.name && (
//                                     <p className="text-sm text-red-500">
//                                         {errors.name}
//                                     </p>
//                                 )}
//                             </div>
//                         ) : (
//                             <h2 className="text-xl font-semibold text-gray-900">
//                                 {company.name}
//                             </h2>
//                         )}
//                     </div>
//                 </div>
//
//                 {/* Company Contact Grid */}
//                 <div className="grid grid-cols-2 gap-3">
//                     <CompanyContactField
//                         icon={<Mail className="h-3.5 w-3.5 text-gray-400" />}
//                         label="Email"
//                         isEditing={isEditingCompany}
//                         name="email"
//                         value={companyFormData.email}
//                         error={errors.email}
//                         onChange={onCompanyInputChange}
//                         displayValue={company.email || 'N/A'}
//                     />
//
//                     <CompanyContactField
//                         icon={<Phone className="h-3.5 w-3.5 text-gray-400" />}
//                         label="Phone"
//                         isEditing={isEditingCompany}
//                         name="phone"
//                         value={companyFormData.phone}
//                         error={errors.phone}
//                         onChange={onCompanyInputChange}
//                         displayValue={company.phone || 'N/A'}
//                     />
//
//                     <CompanyContactField
//                         icon={<MapPin className="h-3.5 w-3.5 text-gray-400" />}
//                         label="Address"
//                         isEditing={isEditingCompany}
//                         name="address"
//                         value={companyFormData.address}
//                         error={errors.address}
//                         onChange={onCompanyInputChange}
//                         displayValue={company.address || 'N/A'}
//                     />
//
//                     {/* Sponsor Field */}
//                     <div className="space-y-1">
//                         <div className="flex items-center gap-2">
//                             <Users className="h-3.5 w-3.5 text-gray-400" />
//                             <span className="text-xs font-medium text-gray-600">
//                                 Sponsor
//                             </span>
//                         </div>
//                         {isEditingCompany ? (
//                             <div className="space-y-1">
//                                 <Select
//                                     value={
//                                         companyFormData.sponsor_id
//                                             ? companyFormData.sponsor_id.toString()
//                                             : 'none'
//                                     }
//                                     onValueChange={(value) => {
//                                         onCompanySelectChange(
//                                             'sponsor_id',
//                                             value === 'none' ? '' : value,
//                                         );
//                                     }}
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Select sponsor" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="none">
//                                             No Sponsor
//                                         </SelectItem>
//
//                                         {sponsors?.map((sponsor: Sponsor) => (
//                                             <SelectItem
//                                                 key={sponsor.id}
//                                                 value={sponsor.id.toString()}
//                                             >
//                                                 <div className="flex items-center gap-2">
//                                                     <span>{sponsor.name}</span>
//                                                 </div>
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                                 {errors.sponsor_id && (
//                                     <p className="text-xs text-red-500">
//                                         {errors.sponsor_id}
//                                     </p>
//                                 )}
//                             </div>
//                         ) : (
//                             <div className="flex items-center gap-2">
//                                 <p className="text-sm text-gray-900">
//                                     {Array.isArray(company.sponsor) && company.sponsor.length > 0
//                                         ? company.sponsor[0].name
//                                         : 'No Sponsor'}
//                                 </p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//
//                 {/* Status Grid */}
//                 <div className="border-t pt-4">
//                     <h3 className="mb-3 text-xs font-semibold text-gray-900">
//                         Status Overview
//                     </h3>
//                     <div className="grid grid-cols-3 gap-3">
//                         <StatusField
//                             icon={
//                                 <Info className="h-3.5 w-3.5 text-gray-400" />
//                             }
//                             label="Status"
//                             isEditing={isEditingCompany}
//                             value={companyFormData.status}
//                             options={statusOptions}
//                             onSelectChange={(value) =>
//                                 onCompanySelectChange('status', value)
//                             }
//                             displayValue={company.status}
//                             getStatusColor={getStatusColor}
//                             formatStatus={formatStatus}
//                         />
//
//                         <StatusField
//                             icon={
//                                 <Target className="h-3.5 w-3.5 text-gray-400" />
//                             }
//                             label="Notarization"
//                             isEditing={isEditingCompany}
//                             value={companyFormData.notarization_status}
//                             options={notarizationOptions}
//                             onSelectChange={(value) =>
//                                 onCompanySelectChange(
//                                     'notarization_status',
//                                     value,
//                                 )
//                             }
//                             displayValue={company.notarization_status}
//                             getStatusColor={getStatusColor}
//                             formatStatus={formatStatus}
//                         />
//
//                         <StatusField
//                             icon={
//                                 <BarChart className="h-3.5 w-3.5 text-gray-400" />
//                             }
//                             label="ERP Status"
//                             isEditing={isEditingCompany}
//                             value={companyFormData.erp_status}
//                             options={statusOptions}
//                             onSelectChange={(value) =>
//                                 onCompanySelectChange('erp_status', value)
//                             }
//                             displayValue={company.erp_status}
//                             getStatusColor={getStatusColor}
//                             formatStatus={formatStatus}
//                         />
//
//                         <div className="space-y-1">
//                             <div className="flex items-center gap-2">
//                                 <Percent className="h-3.5 w-3.5 text-gray-400" />
//                                 <span className="text-xs font-medium text-gray-600">
//                                     Onboarding Progress
//                                 </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <span className="text-xs font-semibold text-blue-600">
//                                     {company.checklist_percentage || 0}%
//                                 </span>
//                             </div>
//                         </div>
//
//                         <StatusField
//                             icon={
//                                 <TrendingUp className="h-3.5 w-3.5 text-gray-400" />
//                             }
//                             label="Sales Activity"
//                             isEditing={isEditingCompany}
//                             value={companyFormData.sales_activity}
//                             options={salesActivityOptions}
//                             onSelectChange={(value) =>
//                                 onCompanySelectChange('sales_activity', value)
//                             }
//                             displayValue={company.sales_activity}
//                             getStatusColor={getStatusColor}
//                             formatStatus={formatStatus}
//                         />
//
//                         <StatusField
//                             icon={
//                                 <Building className="h-3.5 w-3.5 text-gray-400" />
//                             }
//                             label="Company Level"
//                             isEditing={isEditingCompany}
//                             value={companyFormData.level}
//                             options={levelOptions}
//                             onSelectChange={(value) =>
//                                 onCompanySelectChange('level', value)
//                             }
//                             displayValue={company.level}
//                             getStatusColor={getStatusColor}
//                             formatStatus={formatStatus}
//                         />
//                     </div>
//                 </div>
//
//                 {/* Owners Grid */}
//                 <div className="border-t pt-4">
//                     <div className="mb-3 flex items-center justify-between">
//                         <h3 className="text-xs font-semibold text-gray-900">
//                             Owners
//                         </h3>
//                         <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={openAddOwnerDialog}
//                         >
//                             <Plus className="mr-2 h-4 w-4" />
//                             Add Owner
//                         </Button>
//                     </div>
//
//                     <OwnerDialog
//                         isOpen={isOwnerDialogOpen}
//                         onOpenChange={setIsOwnerDialogOpen}
//                         editingOwner={editingOwner}
//                         ownerFormData={ownerFormData}
//                         onOwnerInputChange={handleOwnerInputChange}
//                         onSubmit={handleOwnerSubmit}
//                         onCancel={() => {
//                             setIsOwnerDialogOpen(false);
//                             resetOwnerForm();
//                         }}
//                     />
//
//                     {company.owners && company.owners.length > 0 ? (
//                         <div className="space-y-2">
//                             {company.owners.map((owner) => (
//                                 <OwnerCard
//                                     key={owner.id}
//                                     owner={owner}
//                                     formatDate={formatDate}
//                                     onEdit={() => startEditingOwner(owner)}
//                                     onDelete={() => handleDeleteOwner(owner.id)}
//                                 />
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="py-2 text-center text-xs text-gray-500">
//                             No owners assigned to this company
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// }
//
// // Sub-components for CompanyDetailsTab
//
// interface CompanyContactFieldProps {
//     icon: React.ReactNode;
//     label: string;
//     isEditing: boolean;
//     name: string;
//     value: string;
//     error?: string;
//     onChange: (e: ChangeEvent<HTMLInputElement>) => void;
//     displayValue: string;
// }
//
// function CompanyContactField({
//                                  icon,
//                                  label,
//                                  isEditing,
//                                  name,
//                                  value,
//                                  error,
//                                  onChange,
//                                  displayValue,
//                              }: CompanyContactFieldProps) {
//     return (
//         <div className="space-y-1">
//             <div className="flex items-center gap-2">
//                 {icon}
//                 <span className="text-xs font-medium text-gray-600">
//                     {label}
//                 </span>
//             </div>
//             {isEditing ? (
//                 <div className="space-y-1">
//                     <Input name={name} value={value} onChange={onChange} />
//                     {error && <p className="text-xs text-red-500">{error}</p>}
//                 </div>
//             ) : (
//                 <p className="text-sm text-gray-900">{displayValue}</p>
//             )}
//         </div>
//     );
// }
//
// interface StatusFieldProps {
//     icon: React.ReactNode;
//     label: string;
//     isEditing: boolean;
//     value: string;
//     options: string[];
//     onSelectChange: (value: string) => void;
//     displayValue?: string | null;
//     getStatusColor: (status?: string | null) => string;
//     formatStatus: (status?: string | null) => string;
// }
//
// function StatusField({
//                          icon,
//                          label,
//                          isEditing,
//                          value,
//                          options,
//                          onSelectChange,
//                          displayValue,
//                          getStatusColor,
//                          formatStatus,
//                      }: StatusFieldProps) {
//     return (
//         <div className="space-y-1">
//             <div className="flex items-center gap-2">
//                 {icon}
//                 <span className="text-xs font-medium text-gray-600">
//                     {label}
//                 </span>
//             </div>
//             {isEditing ? (
//                 <Select value={value} onValueChange={onSelectChange}>
//                     <SelectTrigger>
//                         <SelectValue
//                             placeholder={`Select ${label.toLowerCase()}`}
//                         />
//                     </SelectTrigger>
//                     <SelectContent>
//                         {options.map((option) => (
//                             <SelectItem key={option} value={option}>
//                                 {formatStatus(option)}
//                             </SelectItem>
//                         ))}
//                     </SelectContent>
//                 </Select>
//             ) : (
//                 <span
//                     className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(displayValue)}`}
//                 >
//                     {formatStatus(displayValue)}
//                 </span>
//             )}
//         </div>
//     );
// }
//
// interface OwnerDialogProps {
//     isOpen: boolean;
//     onOpenChange: (open: boolean) => void;
//     editingOwner: Owner | null;
//     ownerFormData: OwnerFormData;
//     onOwnerInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
//     onSubmit: (e: React.FormEvent) => void;
//     onCancel: () => void;
// }
//
// function OwnerDialog({
//                          isOpen,
//                          onOpenChange,
//                          editingOwner,
//                          ownerFormData,
//                          onOwnerInputChange,
//                          onSubmit,
//                          onCancel,
//                      }: OwnerDialogProps) {
//     return (
//         <Dialog open={isOpen} onOpenChange={onOpenChange}>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>
//                         {editingOwner ? 'Edit Owner' : 'Add New Owner'}
//                     </DialogTitle>
//                 </DialogHeader>
//                 <form onSubmit={onSubmit} className="space-y-4">
//                     <div className="grid gap-2">
//                         <Label htmlFor="ownerName">Name *</Label>
//                         <Input
//                             id="ownerName"
//                             name="name"
//                             value={ownerFormData.name}
//                             onChange={onOwnerInputChange}
//                             required
//                         />
//                     </div>
//                     <div className="grid gap-2">
//                         <Label htmlFor="ownerEmail">Email *</Label>
//                         <Input
//                             id="ownerEmail"
//                             name="email"
//                             type="email"
//                             value={ownerFormData.email}
//                             onChange={onOwnerInputChange}
//                             required
//                         />
//                     </div>
//                     <div className="grid gap-2">
//                         <Label htmlFor="ownerPhone">Phone</Label>
//                         <Input
//                             id="ownerPhone"
//                             name="phone"
//                             value={ownerFormData.phone || ''}
//                             onChange={onOwnerInputChange}
//                         />
//                     </div>
//                     <div className="grid gap-2">
//                         <Label htmlFor="ownerFacebook">Facebook</Label>
//                         <Input
//                             id="ownerFacebook"
//                             name="facebook"
//                             value={ownerFormData.facebook || ''}
//                             onChange={onOwnerInputChange}
//                         />
//                     </div>
//                     <div className="grid gap-2">
//                         <Label htmlFor="ownerAddress">Address</Label>
//                         <Input
//                             id="ownerAddress"
//                             name="address"
//                             value={ownerFormData.address || ''}
//                             onChange={onOwnerInputChange}
//                         />
//                     </div>
//                     <div className="grid gap-2">
//                         <Label htmlFor="ownerBirthdate">Birthdate</Label>
//                         <Input
//                             id="ownerBirthdate"
//                             name="birthdate"
//                             type="date"
//                             value={ownerFormData.birthdate || ''}
//                             onChange={onOwnerInputChange}
//                         />
//                     </div>
//                     <div className="flex justify-end gap-2">
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={onCancel}
//                         >
//                             Cancel
//                         </Button>
//                         <Button type="submit">
//                             {editingOwner ? 'Update Owner' : 'Add Owner'}
//                         </Button>
//                     </div>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }
//
// interface OwnerCardProps {
//     owner: Owner;
//     formatDate: (date?: string) => string;
//     onEdit: () => void;
//     onDelete: () => void;
// }
//
// function OwnerCard({ owner, formatDate, onEdit, onDelete }: OwnerCardProps) {
//     return (
//         <div className="grid grid-cols-2 gap-2 rounded border border-gray-200 p-2">
//             <div className="flex flex-col">
//                 <span className="text-xs font-medium text-gray-600">Name</span>
//                 <div className="flex items-center gap-1">
//                     <p className="truncate text-xs font-medium text-gray-900">
//                         {owner.name}
//                     </p>
//                 </div>
//             </div>
//
//             <div className="flex flex-col">
//                 <span className="text-xs font-medium text-gray-600">
//                     Facebook Link
//                 </span>
//                 <p className="truncate text-xs font-medium text-gray-900">
//                     {owner.facebook || 'N/A'}
//                 </p>
//             </div>
//
//             <div className="flex flex-col">
//                 <span className="text-xs font-medium text-gray-600">
//                     Email Address
//                 </span>
//                 <p className="truncate text-xs font-medium text-gray-900">
//                     {owner.email}
//                 </p>
//             </div>
//
//             <div className="flex flex-col">
//                 <span className="text-xs font-medium text-gray-600">Phone</span>
//                 <p className="truncate text-xs font-medium text-gray-900">
//                     {owner.phone || 'N/A'}
//                 </p>
//             </div>
//
//             <div className="flex flex-col">
//                 <span className="text-xs font-medium text-gray-600">
//                     Address
//                 </span>
//                 <p className="truncate text-xs font-medium text-gray-900">
//                     {owner.address || 'N/A'}
//                 </p>
//             </div>
//
//             <div className="flex flex-col">
//                 <span className="text-xs font-medium text-gray-600">
//                     Birthdate
//                 </span>
//                 <p className="truncate text-xs font-medium text-gray-900">
//                     {formatDate(owner.birthdate)}
//                 </p>
//             </div>
//
//             <div className="col-span-2 flex justify-end gap-2 pt-2">
//                 <Button size="sm" variant="outline" onClick={onEdit}>
//                     <Edit className="h-3 w-3" />
//                     Edit
//                 </Button>
//                 <Button size="sm" variant="destructive" onClick={onDelete}>
//                     <Trash2 className="h-3 w-3" />
//                     Delete
//                 </Button>
//             </div>
//         </div>
//     );
// }
