import React, { FormEvent, useState } from 'react';
import { useForm } from '@inertiajs/react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import FileInput from '@/components/ui/file-input';
import InputError from '@/components/input-error';
import ComponentCard from '@/components/component-card';
import { AvatarEditor } from '@/components/ui/avatar-editor';
import CompanyOwnerForm from '@/components/companies/company-owner-form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const Onboarding = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [logoUrl, setLogoUrl] = React.useState<string | null>(null);

    const { data, errors, setData, post, processing , reset } = useForm({
        name: '',
        email: null,
        phone: null,
        address: null,
        logo: null,
        proof_of_payment: null,
        owners: [
            {
                name: '',
                email: '',
                phone: '',
                address: '',
                facebook: '',
                birthdate: '',
                profile_picture: null,
                signature: null,
            },
        ],
    });

    const addNewOwner = () => {
        setData('owners', [
            ...data.owners,
            {
                name: '',
                email: '',
                phone: '',
                address: '',
                facebook: '',
                birthdate: '',
                profile_picture: null,
                signature: null
            },
        ]);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        post('/companies/onboarding', {
            onSuccess: () => {
                reset();
                setShowSuccess(true)
            }
        });
    }

    return (
        <div className="min-h-screen bg-gray-100 text-base">
            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Congratulations</DialogTitle>
                        <DialogDescription>
                            We received your information. We will keep in touch once we verified your information.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <div className="mx-auto max-w-4xl space-y-12 px-4 py-8 text-gray-700">
                <section className="space-y-12">
                    <p className="text-center text-3xl font-extrabold text-gray-800">
                        Welcome to Gencys!
                    </p>

                    <div className="space-y-6">
                        <p className="font-bold">
                            Let's just get things in order for the smooth
                            onboarding process.
                        </p>

                        <div className="space-y-1">
                            <p className="font-bold">
                                Please provide all necessary details below.
                            </p>

                            <p className="font-light">
                                Your Company details will be dedicated in your
                                contract. Should you wish to change your company
                                name, you will be required to sign new contract
                                under your Desired COMPANY NAME.
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="font-bold">
                                Prepare these before you start
                            </p>
                            <p className="font-light">
                                <span className="">
                                    PLEASE PREPARE YOUR{' '}
                                    <span>
                                        e-SIGNATURE, PAYMENT PROOF, PHOTO &
                                        COMPANY LOGO
                                    </span>{' '}
                                    AS YOU WILL HAVE TO UPLOAD those in this
                                    form.
                                </span>
                            </p>
                        </div>
                    </div>
                </section>

                <form onSubmit={handleSubmit}>
                    <section className="space-y-8">
                        <ComponentCard
                            title={'Company Information'}
                            desc={'Provide information about your company'}
                        >
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <Label className="text-sm font-medium">
                                        Company Logo
                                    </Label>
                                    <AvatarEditor
                                        removable={false}
                                        fallbackText="U"
                                        value={{ url: logoUrl }}
                                        onChange={(result) => {
                                            if (!result) {
                                                setLogoUrl(null);
                                                setData('logo', null);
                                                return;
                                            }

                                            setLogoUrl(result.previewUrl);
                                            setData('logo', result.file);
                                        }}
                                        maxFileMB={5}
                                    />

                                    <InputError message={errors.logo} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email ?? ''}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={data.phone ?? ''}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-medium">
                                        Address
                                    </Label>
                                    <Input
                                        id="address"
                                        value={data.address ?? ''}
                                        onChange={(e) =>
                                            setData('address', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.address} />
                                </div>
                            </div>
                        </ComponentCard>

                        <ComponentCard
                            title={'Payment & Documents'}
                            desc={'Upload your proof of payment'}
                        >
                            <div className="mb-8 space-y-4">
                                <p className="font-bold">
                                    Please send Enrollment Fee of 150,000.00 PHP
                                    to:
                                </p>

                                <div className="space-y-2 font-light">
                                    <p>
                                        NEW ACCOUNT FOR PARTNERS ENROLLMENT FEE:
                                    </p>
                                    <p className="">Bank: BDO</p>
                                    <p className="">
                                        Account Name: Gencys Digital Trading Inc
                                    </p>
                                    <p className="">
                                        Account Number: 0080 2800 6132
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2">
                                <FileInput
                                    label="Attachment"
                                    accept="image/*,.pdf"
                                    value={data.proof_of_payment}
                                    onChange={(file) =>
                                        setData('proof_of_payment', file)
                                    }
                                    error={errors.proof_of_payment}
                                    required
                                />
                            </div>
                        </ComponentCard>

                        <ComponentCard
                            title="Company Owners"
                            desc="Provide information about the company owners"
                        >
                            <div className="space-y-4">
                                {data.owners.map((owner, i) => (
                                    <CompanyOwnerForm
                                        key={`owner-form-${i}`}
                                        index={i}
                                        data={data}
                                        withSignature={true}
                                        setData={setData}
                                        errors={errors}
                                    />
                                ))}
                            </div>

                            <div className="mt-5 rounded-xl border-2 border-dashed p-4">
                                <p
                                    className="cursor-pointer text-center text-sm font-bold text-gray-800"
                                    onClick={addNewOwner}
                                >
                                    Add new Owner
                                </p>
                            </div>
                        </ComponentCard>
                    </section>

                    <section className="my-8">
                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        </div>
                    </section>
                </form>

                <section>
                    <div className="text-center text-sm font-light text-zinc-500">
                        Need assistance? Contact{' '}
                        <a
                            href="mailto:onboarding@gencys.com"
                            className="font-medium text-zinc-700 hover:text-zinc-900 hover:underline"
                        >
                            onboarding@gencys.com
                        </a>
                        .
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Onboarding
