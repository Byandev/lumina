import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Cake, Download, Facebook, Mail, MapPin, Phone, Signature } from 'lucide-react';
import React from 'react';

interface Props {
    owner: User
}

const CompanyOwnerCard = ({ owner }: Props) => {
    console.log(owner)
    return (
        <div className="space-y-6 rounded-xl border p-4">
            <div className="space-y-2">
                <div className="flex justify-center">
                    <Avatar className="size-12">
                        <AvatarImage src={`/${owner.photo}`} alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                <p className="text-center text-sm font-medium">{owner.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
                <p className="flex items-center space-x-2 text-center">
                    <Mail className="size-4" />
                    <span>{owner.email}</span>
                </p>

                <p className="flex items-center space-x-2 text-center">
                    <Phone className="size-4" />
                    <span>{owner.phone}</span>
                </p>

                <p className="flex items-center space-x-2 text-center">
                    <Facebook className="size-4" />
                    <span>
                        <a
                            className="text-blue-700"
                            href={owner.facebook}
                            target={'_blank'}
                        >
                            View Facebook
                        </a>
                    </span>
                </p>

                <p className="flex items-center space-x-2 text-center">
                    <Cake className="size-4" />
                    <span>{owner.birthdate}</span>
                </p>

                <p className="col-span-2 flex items-center space-x-2 text-center">
                    <MapPin className="size-4" />
                    <span>{owner.address}</span>
                </p>

                {!! owner.signature &&
                    <p className="col-span-2 flex items-center space-x-2 text-center">
                        <Signature className="size-4" />
                        <a
                            target={'_blank'}
                            href={owner.signature?.original_url}
                            className="flex items-center gap-x-2 text-blue-700"
                        >
                            Download Signature
                        </a>
                    </p>
                }
            </div>
        </div>
    );
}

export default CompanyOwnerCard
