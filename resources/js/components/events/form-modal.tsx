'use client';

import { useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useMemo } from 'react';
import ReactSelect, { MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { Company } from '@/types/models/Company';
import { Event } from '@/types/models/Event';
import { Building, Calendar, Captions, ClipboardType, MapPin } from 'lucide-react';

interface FormModalProps {
    initialValue: Event | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    companies: Company[];
}

const FormModal = ({
    companies,
    open,
    onOpenChange,
    initialValue,
}: FormModalProps) => {
    const animatedComponents = makeAnimated();

    const isEditing = useMemo(() => !!initialValue, [initialValue]);

    // Prepare options for react-select
    const companyOptions = useMemo(
        () =>
            companies.map((company) => ({
                value: company.id.toString(),
                label: company.name,
            })),
        [companies],
    );

    const { data, setData, post, put, processing, errors, reset } = useForm({
        id: 0,
        name: initialValue?.name || '',
        date: initialValue?.date || '',
        type: initialValue?.type || '',
        location: initialValue?.location || '',
        companies: initialValue?.companies || [],
        company_ids: initialValue?.companies?.map((c) => c.id.toString()) || [],
    });

    // Convert selected company_ids to react-select value
    const selectedCompanyValues = companyOptions.filter((option) =>
        data.company_ids.includes(option.value),
    );

    const handleCompanyChange = (
        selectedOptions: MultiValue<{ value: string; label: string }>,
    ) => {
        const selectedIds = selectedOptions.map((option) => option.value);
        setData('company_ids', selectedIds);
    };

    // Initialize form when opening modal
    useEffect(() => {
        if (open) {
            if (initialValue) {
                setData({
                    id: initialValue.id,
                    name: initialValue.name,
                    date: initialValue.date,
                    type: initialValue.type,
                    location: initialValue.location,
                    companies: initialValue.companies || [],
                    company_ids: (initialValue.companies || []).map((c) =>
                        c.id.toString(),
                    ),
                });
            } else {
                reset();
            }
        }
        // Only run when open changes or initialValue changes
    }, [open, initialValue, setData, reset]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(`/events/${initialValue?.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
                preserveScroll: true,
            });
        } else {
            post(`/events`, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
                preserveScroll: true,
            });
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
        reset();
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(newOpen) => {
                onOpenChange(newOpen);
                // Only reset if modal closes
                if (!newOpen) reset();
            }}
        >
            <DialogContent
                className="p-0 sm:max-w-[600px]"
                onPointerDownOutside={(e) => e.preventDefault()} // prevent closing by outside click
            >
                <DialogHeader className="border-b p-6">
                    <DialogTitle>
                        {isEditing ? 'Edit Event' : 'Add New Event'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
                    {/* Event Name */}
                    <div className="grid gap-2">
                        <Label
                            htmlFor="name"
                            className="flex items-center gap-1"
                        >
                            <Captions className="h-5 w-5" />
                            Event Name *
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Enter event name"
                            disabled={processing}
                            required
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Date */}
                    <div className="grid gap-2">
                        <Label
                            htmlFor="date"
                            className="flex items-center gap-1"
                        >
                            <Calendar className="h-4 w-5" />
                            Date *
                        </Label>
                        <Input
                            id="date"
                            name="date"
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            required
                            disabled={processing}
                        />
                        {errors.date && (
                            <p className="text-sm text-red-500">
                                {errors.date}
                            </p>
                        )}
                    </div>

                    {/* Type */}
                    <div className="grid gap-2">
                        <Label htmlFor="type" className='flex items-center gap-1'>
                            <ClipboardType className='h-4 w-4' />
                            Event Type *
                        </Label>
                        <Select
                            value={data.type}
                            onValueChange={(value) => setData('type', value)}
                            required
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                            <SelectContent>
                                {['Online', 'Face to Face'].map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.type && (
                            <p className="text-sm text-red-500">
                                {errors.type}
                            </p>
                        )}
                    </div>

                    {/* Location */}
                    <div className="grid gap-2">
                        <Label htmlFor="location" className='flex items-center gap-1'>
                            <MapPin className='h-4 w-4' />
                            Location *
                        </Label>
                        <Input
                            id="location"
                            name="location"
                            value={data.location}
                            onChange={(e) =>
                                setData('location', e.target.value)
                            }
                            placeholder="Enter event location"
                            disabled={processing}
                            required
                        />
                        {errors.location && (
                            <p className="text-sm text-red-500">
                                {errors.location}
                            </p>
                        )}
                    </div>

                    {/* Companies Multi-select */}
                    <div className="grid gap-2">
                        <Label htmlFor="companies" className='flex items-center gap-1'>
                            <Building className='h-4 w-4' />
                            Companies (optional)</Label>
                        <ReactSelect
                            id="companies"
                            name="companies"
                            isMulti
                            options={companyOptions}
                            value={selectedCompanyValues}
                            onChange={handleCompanyChange}
                            closeMenuOnSelect={false}
                            placeholder="Select companies..."
                            noOptionsMessage={() => 'No companies found'}
                            components={animatedComponents}
                            isDisabled={processing}
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                        {errors.company_ids && (
                            <p className="text-sm text-red-500">
                                {errors.company_ids}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <DialogFooter className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Saving...'
                                : isEditing
                                  ? 'Update Event'
                                  : 'Add Event'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FormModal;
