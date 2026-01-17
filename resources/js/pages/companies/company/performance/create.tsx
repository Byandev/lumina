import { Company } from '@/types/models/Company';
import CompanyLayout from '@/pages/companies/company/company-layout';
import ComponentCard from '@/components/component-card';
import { useForm } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button';
import FileInput from '@/components/ui/file-input';

interface Props {
    company: Company
}

const Create = ({ company }: Props) => {
    const { data, setData, errors, post } = useForm({
        company_id: company.id,
        start_date: '',
        end_date: '',
        phase: '',
        no_of_items: '',
        avg_ads_spent: '',
        roas: '',
        rts: '',
        highlights: '',
        challenges: '',
        action_plan: '',
        attachment: null
    });


    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(`/companies/${company.id}/performance-records`);
    };

    // @ts-ignore
    // @ts-ignore
    return (
        <CompanyLayout company={company}>
            <ComponentCard desc={'Create new performance record'}>
                <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-4 gap-x-4 gap-y-8">
                        <div className="col-span-2 flex flex-col gap-2">
                            <Label className="text-sm font-medium">
                                Start Date
                            </Label>

                            <Input
                                id="start_date"
                                type={'date'}
                                value={data.start_date}
                                placeholder="Start Date"
                                onChange={(e) =>
                                    setData('start_date', e.target.value)
                                }
                            />
                            <InputError message={errors.start_date} />
                        </div>

                        <div className="col-span-2 flex flex-col gap-2">
                            <Label className="text-sm font-medium">
                                End Date
                            </Label>

                            <Input
                                id="end_date"
                                type={'date'}
                                value={data.end_date}
                                placeholder="End Date"
                                onChange={(e) =>
                                    setData('end_date', e.target.value)
                                }
                            />
                            <InputError message={errors.start_date} />
                        </div>

                        <div className="col-span-2 flex flex-col gap-2">
                            <Label className="text-sm font-medium">Phase</Label>
                            <Select
                                value={data.phase}
                                onValueChange={(value) =>
                                    setData('phase', value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={`Select current phase`}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {[
                                            'Testing',
                                            'Maintaining',
                                            'Scaling',
                                        ].map((opt) => (
                                            <SelectItem key={opt} value={opt}>
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.phase} />
                        </div>

                        <div className="col-span-2 flex flex-col gap-2">
                            <Label className="text-sm font-medium">
                                # of items tested
                            </Label>

                            <Input
                                id="no_of_items"
                                type={'number'}
                                value={data.no_of_items}
                                placeholder="# of items tested"
                                onChange={(e) =>
                                    setData('no_of_items', e.target.value)
                                }
                            />
                            <InputError message={errors.no_of_items} />
                        </div>

                        <div className="col-span-2 flex flex-col gap-2">
                            <Label className="text-sm font-medium">
                                Average Ad Spent
                            </Label>

                            <Input
                                id="avg_ads_spent"
                                type={'number'}
                                value={data.avg_ads_spent}
                                placeholder="Average Ad Spent"
                                onChange={(e) =>
                                    setData('avg_ads_spent', e.target.value)
                                }
                            />
                            <InputError message={errors.avg_ads_spent} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">ROAS</Label>

                            <Input
                                id="roas"
                                type={'number'}
                                value={data.roas}
                                placeholder="ROAS"
                                onChange={(e) =>
                                    setData('roas', e.target.value)
                                }
                            />
                            <InputError message={errors.roas} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-medium">RTS</Label>

                            <Input
                                id="rts"
                                type={'number'}
                                value={data.rts}
                                placeholder="RTS"
                                onChange={(e) => setData('rts', e.target.value)}
                            />
                            <InputError message={errors.rts} />
                        </div>

                        <div className="col-span-4 flex flex-col gap-2">
                            <Label className="text-sm font-medium">
                                Highlights
                            </Label>

                            <Textarea
                                onChange={(e) =>
                                    setData('highlights', e.target.value)
                                }
                            ></Textarea>
                            <InputError message={errors.highlights} />
                        </div>

                        <div className="col-span-4 flex flex-col gap-2">
                            <Label className="text-sm font-medium">
                                Challenges
                            </Label>

                            <Textarea
                                onChange={(e) =>
                                    setData('challenges', e.target.value)
                                }
                            ></Textarea>
                            <InputError message={errors.challenges} />
                        </div>

                        <div className="col-span-4 flex flex-col gap-2">
                            <Label className="text-sm font-medium">
                                Action Plan
                            </Label>

                            <Textarea
                                onChange={(e) =>
                                    setData('action_plan', e.target.value)
                                }
                            ></Textarea>
                            <InputError message={errors.action_plan} />
                        </div>
                        <div className="col-span-4 flex flex-col gap-2">

                            <FileInput
                                label="Attachment"
                                value={data.attachment}
                                onChange={(file) =>
                                    setData('attachment', file)
                                }
                            />
                            <InputError message={errors.action_plan} />
                        </div>
                    </div>

                    <div className="my-5 flex justify-end">
                        <Button type={'submit'} variant={'default'}>
                            Submit
                        </Button>
                    </div>
                </form>
            </ComponentCard>
        </CompanyLayout>
    );
}

export default Create;
