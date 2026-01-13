import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Cake, Facebook, Mail, MapPin, Phone } from 'lucide-react';

interface Props {
    owner: User
}

const CompanyOwnerCard = ({ owner }: Props) => {
    return <div className="border rounded-xl p-4 space-y-6">
        <div className="space-y-2">
            <div className="flex justify-center">
                <Avatar className="size-12">
                    <AvatarImage src={`/${owner.photo}`} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
            <p className="text-center text-sm font-medium">{owner.name}</p>
        </div>

        <div className="text-sm grid grid-cols-2 gap-4 text-gray-800">
            <p className="text-center flex space-x-2 items-center">
                <Mail className="size-4"/>
                <span>{owner.email}</span>
            </p>

            <p className="text-center flex space-x-2 items-center">
                <Phone className="size-4"/>
                <span>{owner.phone}</span>
            </p>

            <p className="text-center flex space-x-2 items-center">
                <Facebook className="size-4"/>
                <span><a className="text-blue-700" href={owner.facebook} target={'_blank'}>View Facebook</a></span>
            </p>

            <p className="text-center flex space-x-2 items-center">
                <Cake className="size-4"/>
                <span>{owner.birthdate}</span>
            </p>

            <p className="text-center flex space-x-2 items-center col-span-2">
                <MapPin className="size-4"/>
                <span>{owner.address}</span>
            </p>
        </div>
    </div>
}

export default CompanyOwnerCard
