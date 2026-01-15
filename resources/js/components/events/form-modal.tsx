import ReactSelect, { MultiValue } from 'react-select';
import { useForm } from '@inertiajs/react';
import makeAnimated from 'react-select/animated';
import React, { useMemo, useEffect, FormEvent } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { Event } from '@/types/models/Event';
import { Company } from '@/types/models/Company';

interface FormModalProps {
    initialValue: Event | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    companies: Company[]
}

const FormModal = ({ companies, open, onOpenChange, initialValue } : FormModalProps) => {
    const animatedComponents = makeAnimated();

    const isEditing = useMemo<boolean>(() => !!initialValue, [initialValue]);

    const companyOptions = useMemo(() => {
       return companies.map((company) => ({
            value: company.id.toString(),
            label: company.name,
        }))
    }, [companies])

    const { data, setData, post, put, processing, errors, reset } = useForm({
        id: 0,
        name: initialValue?.name || '',
        date: initialValue?.date || '',
        type: initialValue?.type || '',
        location: initialValue?.location || '',
        companies: initialValue?.companies || [],
        company_ids: []
    });

    // Convert selected company_ids to react-select value format
    const selectedCompanyValues = companyOptions.filter((option) =>
        data.company_ids.includes(option.value),
    );

    // Handle company selection with react-select
    const handleCompanyChange =(selectedOptions: MultiValue<{
        value: string;
        label: string;
    }>) => {
        const selectedIds = selectedOptions
            ? selectedOptions.map((option) => option.value)
            : [];

        setData('company_ids', selectedIds);
    };

    // setData and reset from useForm are stable references
    useEffect(() => {
        if (initialValue) {
            setData({
                id: initialValue.id,
                name: initialValue?.name,
                date: initialValue?.date,
                type: initialValue?.type,
                location: initialValue?.location,
                companies: initialValue?.companies || [],
                company_ids: (initialValue?.companies || []).map(c => c.id)
            });
        } else {
            reset();
        }
    }, [initialValue, open, reset, setData]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (initialValue) {
            put(`/events/${initialValue.id}`, {
                onSuccess: () => {
                    reset();
                    onOpenChange(false)
                },
                preserveScroll: true,
                preserveState: false
            });
        } else {
            post(`/events`, {
                onSuccess: () => {
                    reset();
                    onOpenChange(false)
                },
                preserveScroll: true,
                preserveState: false
            });
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
        reset();
    }

    return  <Dialog
        open={open}
        onOpenChange={(open) => {
            onOpenChange(open)
            reset();
        }}
    >
        <DialogContent
            className="sm:max-w-[600px] p-0"
            onPointerDownOutside={(e) => {
                e.preventDefault();
            }}
        >
            <DialogHeader className="p-6 border-b">
                <DialogTitle>
                    {isEditing ? 'Edit Event' : 'Add New Event'}
                </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">Event Name *</Label>
                    <Input
                        id="name"
                        name="name"
                        value={data.name}
                        onChange={(e) =>
                            setData('name', e.target.value)
                        }
                        required
                        placeholder="Enter event name"
                        disabled={processing}
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                        id="date"
                        name="date"
                        type="date"
                        value={data.date}
                        onChange={(e) =>
                            setData('date', e.target.value)
                        }
                        required
                        disabled={processing}
                    />
                    {errors.date && (
                        <p className="text-sm text-red-500">
                            {errors.date}
                        </p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="type">Event Type *</Label>
                    <Select
                        value={data.type}
                        onValueChange={(value) =>
                            setData('type', value)
                        }
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

                <div className="grid gap-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                        id="location"
                        name="location"
                        value={data.location}
                        onChange={(e) =>
                            setData('location', e.target.value)
                        }
                        required
                        placeholder="Enter event location"
                        disabled={processing}
                    />
                    {errors.location && (
                        <p className="text-sm text-red-500">
                            {errors.location}
                        </p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="companies">Companies *</Label>
                    <ReactSelect
                        id="companies"
                        name="companies"
                        isMulti={true}
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
                        classNames={{
                            control: (state) =>
                                state.isFocused
                                    ? 'border-ring ring-2 ring-ring'
                                    : 'border-input',
                            menu: () =>
                                'bg-popover border border-border rounded-md shadow-lg',
                            option: (state) =>
                                state.isSelected
                                    ? 'bg-primary text-primary-foreground'
                                    : state.isFocused
                                        ? 'bg-accent text-accent-foreground'
                                        : 'bg-transparent',
                            multiValue: () =>
                                'bg-secondary text-secondary-foreground',
                            placeholder: () => 'text-muted-foreground',
                        }}
                    />
                    {errors.company_ids && (
                        <p className="text-sm text-red-500">
                            {errors.company_ids}
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={
                            processing
                        }
                    >
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
}

export default FormModal
