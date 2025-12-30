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
// import { Head, router, useForm } from '@inertiajs/react';
// import {
//     Building,
//     ClipboardCheck,
//     Clock,
//     Edit,
//     Save,
//     Trash2,
//     TrendingUp,
//     X,
// } from 'lucide-react';
// import { ChangeEvent, FormEvent, useState } from 'react';
// import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
//
// import AttendanceTab from '@/pages/companies/company/AttendanceTab';
// import CompanyDetailsTab from './CompanyDetailsTab';
// import OnboardingTab from './OnboardingTab';
// import PerformanceTab from './PerformanceTab';
//
// import { Button } from '@/components/ui/button';
// import AppLayout from '@/layouts/app-layout';
// import { dashboard } from '@/routes';
// import { Company, CompanyFormData, Sponsors } from './types';
//
// import { type BreadcrumbItem } from '@/types';
//
// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Companies',
//         href: dashboard().url,
//     },
// ];
//
// interface ShowProps {
//     company: Company;
//     sponsors: Sponsors;
// }
//
// export default function Index({ company, sponsors }: ShowProps) {
//     const [isEditingCompany, setIsEditingCompany] = useState(false);
//
//     const {
//         data: companyFormData,
//         setData: setCompanyFormData,
//         put,
//         processing,
//         errors,
//     } = useForm<CompanyFormData>({
//         name: company.name || '',
//         email: company.email || '',
//         phone: company.phone || '',
//         address: company.address || '',
//         status: company.status || '',
//         sponsor_id: company.sponsor?.id || company.sponsor_id || '', // Use sponsor_id
//         notarization_status: company.notarization_status || '',
//         erp_status: company.erp_status || '',
//         sales_activity: company.sales_activity || '',
//         level: company.level || '',
//     });
//
//     const handleCompanyUpdate = (e: FormEvent) => {
//         e.preventDefault();
//         put(`/companies/${company.id}/update`, {
//             onSuccess: () => {
//                 setIsEditingCompany(false);
//             },
//         });
//     };
//
//     const handleCompanyInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setCompanyFormData(name as keyof CompanyFormData, value);
//     };
//
//
//     const handleCompanySelectChange = (
//         name: keyof CompanyFormData,
//         value: string,
//     ) => {
//         setCompanyFormData(name, value);
//     };
//
//     const resetCompanyFormresetCompanyForm = () => {
//         setCompanyFormData({
//             name: company.name || '',
//             email: company.email || '',
//             phone: company.phone || '',
//             address: company.address || '',
//             status: company.status || '',
//             sponsor_id: company.sponsor?.id || company.sponsor_id || '', // Fix this
//             notarization_status: company.notarization_status || '',
//             erp_status: company.erp_status || '',
//             sales_activity: company.sales_activity || '',
//             level: company.level || '',
//         });
//     };
//
//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title={`${company.name} - Details`} />
//             <div className="px-3 py-4">
//                 {/* Header */}
//                 <div className="mb-4 flex items-center justify-between">
//                     <div>
//                         <h1 className="text-xl font-semibold text-gray-900">
//                             Company Details
//                         </h1>
//                         <p className="mt-0.5 text-sm text-gray-600">
//                             View and manage company information
//                         </p>
//                     </div>
//                     <div className="flex gap-2">
//                         {!isEditingCompany ? (
//                             <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => setIsEditingCompany(true)}
//                             >
//                                 <Edit className="mr-2 h-4 w-4" />
//                                 Edit Company
//                             </Button>
//                         ) : (
//                             <div className="flex gap-2">
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => {
//                                         setIsEditingCompany(false);
//                                         resetCompanyForm();
//                                     }}
//                                 >
//                                     <X className="mr-2 h-4 w-4" />
//                                     Cancel
//                                 </Button>
//                                 <Button
//                                     size="sm"
//                                     onClick={handleCompanyUpdate}
//                                     disabled={processing}
//                                 >
//                                     <Save className="mr-2 h-4 w-4" />
//                                     Save Changes
//                                 </Button>
//                             </div>
//                         )}
//                         <DeleteCompanyDialog company={company} />
//                     </div>
//                 </div>
//
//                 {/* Company Details Tabs */}
//                 <div className="rounded-lg border border-gray-200 bg-white">
//                     <Tabs>
//                         <TabList className="flex border-b border-gray-200">
//                             <Tab className="compact-tab">
//                                 <div className="flex items-center gap-1.5 px-3 py-2">
//                                     <Building className="h-3.5 w-3.5" />
//                                     <span className="text-xs font-medium">
//                                         Details
//                                     </span>
//                                 </div>
//                             </Tab>
//                             <Tab className="compact-tab">
//                                 <div className="flex items-center gap-1.5 px-3 py-2">
//                                     <ClipboardCheck className="h-3.5 w-3.5" />
//                                     <span className="text-xs font-medium">
//                                         Onboarding
//                                     </span>
//                                 </div>
//                             </Tab>
//                             <Tab className="compact-tab">
//                                 <div className="flex items-center gap-1.5 px-3 py-2">
//                                     <Clock className="h-3.5 w-3.5" />
//                                     <span className="text-xs font-medium">
//                                         Attendance
//                                     </span>
//                                 </div>
//                             </Tab>
//                             <Tab className="compact-tab">
//                                 <div className="flex items-center gap-1.5 px-3 py-2">
//                                     <TrendingUp className="h-3.5 w-3.5" />
//                                     <span className="text-xs font-medium">
//                                         Performance
//                                     </span>
//                                 </div>
//                             </Tab>
//                         </TabList>
//
//                         {/* Tab 1: Company Details */}
//                         <TabPanel className="p-4">
//                             <CompanyDetailsTab
//                                 company={company}
//                                 isEditingCompany={isEditingCompany}
//                                 companyFormData={companyFormData}
//                                 sponsors={sponsors}
//                                 errors={errors}
//                                 onCompanyInputChange={handleCompanyInputChange}
//                                 onCompanySelectChange={
//                                     handleCompanySelectChange
//                                 }
//                             />
//                         </TabPanel>
//
//                         {/* Tab 2: Onboarding */}
//                         <TabPanel className="-mt-4 px-4">
//                             <OnboardingTab company={company} />
//                         </TabPanel>
//
//                         {/* Tab 3: Attendance */}
//                         <TabPanel className="p-4">
//                             <AttendanceTab attendances={company.attendances}/>
//                         </TabPanel>
//
//                         {/* Tab 4: Performance */}
//                         <TabPanel className="p-4">
//                             <PerformanceTab />
//                         </TabPanel>
//                     </Tabs>
//                 </div>
//
//                 {/* Inline CSS */}
//                 <style>{`
//                     .compact-tab {
//                         cursor: pointer;
//                         border: none;
//                         background: transparent;
//                         position: relative;
//                         transition: all 0.2s ease;
//                     }
//
//                     .compact-tab:hover {
//                         background-color: #f9fafb;
//                     }
//
//                     .react-tabs__tab--selected.compact-tab {
//                         border-bottom: 2px solid #3b82f6;
//                         font-weight: 600;
//                         color: #111827;
//                     }
//
//                     .react-tabs__tab--selected.compact-tab:hover {
//                         background-color: transparent;
//                     }
//
//                     .react-tabs__tab-panel {
//                         display: none;
//                         animation: fadeIn 0.2s ease-in;
//                     }
//
//                     .react-tabs__tab-panel--selected {
//                         display: block;
//                     }
//
//                     @keyframes fadeIn {
//                         from {
//                             opacity: 0;
//                             transform: translateY(5px);
//                         }
//                         to {
//                             opacity: 1;
//                             transform: translateY(0);
//                         }
//                     }
//                 `}</style>
//             </div>
//         </AppLayout>
//     );
// }
//
// // Delete Company Dialog Component
// function DeleteCompanyDialog({ company }: { company: Company }) {
//     return (
//         <AlertDialog>
//             <AlertDialogTrigger asChild>
//                 <Button variant="destructive" size="sm">
//                     <Trash2 className="mr-2 h-4 w-4" />
//                     Delete Company
//                 </Button>
//             </AlertDialogTrigger>
//             <AlertDialogContent>
//                 <AlertDialogHeader>
//                     <AlertDialogTitle>Delete Company</AlertDialogTitle>
//                     <AlertDialogDescription>
//                         Are you sure you want to delete {company.name}? This
//                         action cannot be undone and will permanently delete the
//                         company and all associated data.
//                     </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <form
//                     onSubmit={(e) => {
//                         e.preventDefault();
//                         router.delete(`/companies/${company.id}/destroy`);
//                     }}
//                 >
//                     <div className="grid gap-4 py-4">
//                         <div className="space-y-2">
//                             <div className="flex items-center space-x-2">
//                                 <input
//                                     type="checkbox"
//                                     id="confirmDelete"
//                                     name="confirmDelete"
//                                     required
//                                     className="h-4 w-4 rounded border-gray-300"
//                                 />
//                                 <label
//                                     htmlFor="confirmDelete"
//                                     className="text-sm"
//                                 >
//                                     I understand this action cannot be undone
//                                 </label>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <input
//                                     type="checkbox"
//                                     id="confirmData"
//                                     name="confirmData"
//                                     required
//                                     className="h-4 w-4 rounded border-gray-300"
//                                 />
//                                 <label
//                                     htmlFor="confirmData"
//                                     className="text-sm"
//                                 >
//                                     I understand all associated data will be
//                                     permanently deleted
//                                 </label>
//                             </div>
//                         </div>
//                     </div>
//                     <AlertDialogFooter>
//                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                         <AlertDialogAction type="submit">
//                             Delete Company
//                         </AlertDialogAction>
//                     </AlertDialogFooter>
//                 </form>
//             </AlertDialogContent>
//         </AlertDialog>
//     );
// }
