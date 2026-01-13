import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import React from 'react';
import { CompanyForm, OwnerPayload } from '@/types/models/Company';

type Errors = Record<string, string>;

type Props = {
    index: number;
    data: CompanyForm;
    setData: (key: string, value: OwnerPayload[] ) => void;
    errors: Errors;
};

const CompanyOwnerForm = ({ index,  data, setData, errors }: Props) => {
    const owner = data.owners[index] ?? {
        name: '', email: '', phone: '', address: '', birthdate: '', facebook: ''
    };

    const setOwner = (field: 'name' | 'email' | 'phone' | 'address' | 'birthdate' | 'facebook' | 'profile_picture', value: string | File) => {
        const next = [...data.owners];
        next[index] = { ...owner, [field]: value };
        setData('owners', next);
    };

    const removeOwner = () => {
        const next = [...data.owners];
        next.splice(index, 1)
        setData('owners', next);
    }

    return (
        <div className='border-2 border-dashed p-4 rounded-xl'>
            <div className="mb-2 flex justify-between items-center">
                <p className="font-bold text-sm">{`Owner #${index+1}`}</p>

                {index > 0 && <p className="font-bold text-sm text-red-500 cursor-pointer" onClick={removeOwner}>Delete Owner</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium">Name</Label>
                    <Input
                        id={`owners-${index}-profile-picture`}
                        type='file'
                        onChange={(e) => {
                            if (e.target.files?.length) {
                                setOwner('profile_picture', e.target.files[0])
                            }
                        }}
                    />
                    <InputError message={errors.name} />
                </div>

                <Field
                    label="Name"
                    id={`owners-${index}-name`}
                    value={owner.name ?? ''}
                    onChange={(v) => setOwner('name', v)}
                    error={errors[`owners.${index}.name`]}
                    placeholder="Owner Name"
                />

                <Field
                    label="Email"
                    id={`owners-${index}-email`}
                    value={owner.email ?? ''}
                    onChange={(v) => setOwner('email', v)}
                    error={errors[`owners.${index}.email`]}
                    placeholder="Owner Email"
                    type="email"
                />

                <Field
                    label="Phone Number"
                    id={`owners-${index}-phone`}
                    value={owner.phone ?? ''}
                    onChange={(v) => setOwner('phone', v)}
                    error={errors[`owners.${index}.phone`]}
                    placeholder="Owner Phone"
                />

                <Field
                    label="Address"
                    id={`owners-${index}-address`}
                    value={owner.address ?? ''}
                    onChange={(v) => setOwner('address', v)}
                    error={errors[`owners.${index}.address`]}
                    placeholder="Owner Address"
                />

                <Field
                    label="Facebook"
                    id={`owners-${index}-facebook`}
                    value={owner.facebook ?? ''}
                    onChange={(v) => setOwner('facebook', v)}
                    error={errors[`owners.${index}.facebook`]}
                    placeholder="Facebook"
                    type={'url'}
                />

                <Field
                    label="Birthdate"
                    id={`owners-${index}-birthdate`}
                    value={owner.birthdate ?? ''}
                    onChange={(v) => setOwner('birthdate', v)}
                    error={errors[`owners.${index}.birthdate`]}
                    placeholder="Birthdate"
                    type={'date'}
                />
            </div>
        </div>
    );
};

export default CompanyOwnerForm;

function Field(props: {
    label: string;
    id: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    placeholder?: string;
    type?: string;
}) {
    return (
        <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">{props.label}</Label>
            <Input
                id={props.id}
                type={props.type ?? 'text'}
                value={props.value}
                className="w-full"
                placeholder={props.placeholder}
                onChange={(e) => props.onChange(e.target.value)}
            />
            <InputError message={props.error} />
        </div>
    );
}
