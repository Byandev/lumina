// import { Attendance } from '@/pages/companies/company/types';
//
// interface Props {
//     attendances: Attendance[];
// }
//
// export default function AttendanceTab({ attendances }: Props) {
//     return (
//         <div className="space-y-4">
//             <h3 className="text-sm font-semibold text-gray-900">
//                 Attendance Overview
//             </h3>
//
//
//
//                 <div className="mb-4 rounded-lg border bg-white">
//                     <div className="overflow-x-auto">
//                         <table className="w-full">
//                             <thead>
//                                 <tr className="border-b bg-gray-50">
//                                     <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
//                                         Event Name
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
//                                         Date & Time
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
//                                         Type
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
//                                         Location
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
//                                         Status
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-200">
//                                 {attendances.length === 0 ? (
//                                     <tr>
//                                         <td
//                                             colSpan={6}
//                                             className="px-6 py-8 text-center text-gray-500"
//                                         >
//                                             <>"No event attended"</>
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     attendances.map((attendance) => (
//                                         <tr
//                                             key={attendance.company_id}
//                                             className="hover:bg-gray-50"
//                                         >
//                                             <td className="px-6 py-4">
//                                                 <div className="font-medium text-gray-900">
//                                                     {attendance?.event?.name}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <div className="font-medium text-gray-900">
//                                                     {attendance?.event?.date}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <div className="font-medium text-gray-900">
//                                                     {attendance?.event?.type}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <div className="font-medium text-gray-900">
//                                                     {
//                                                         attendance?.event
//                                                             ?.location
//                                                     }
//                                                 </div>
//                                             </td>
//
//                                             <td className="px-6 py-4">
//                                                 <div className="text-sm text-gray-900">
//                                                     {attendance?.status}
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//         </div>
//     );
// }
