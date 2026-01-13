import { Company } from '@/types/models/Company';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useInitials } from '@/hooks/use-initials';

const CompanyOwnersAvatar = ({ company } : { company: Company }) =>{
    const getInitials = useInitials();

    return <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
        {
            (company.owners ?? [])
                .map(owner =>
                    <Tooltip key={`company-${company.id}-owner-${owner.id}`}>
                        <TooltipTrigger asChild>
                            <Avatar className='cursor-pointer border-white border'>
                                <AvatarImage src={owner.profile_picture?.original_url} alt={owner.name} />
                                <AvatarFallback className='bg-blue-600 text-white'>{getInitials(owner.name)}</AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>

                        <TooltipContent>
                            {owner.name}
                        </TooltipContent>
                    </Tooltip>
                )
        }
    </div>
}

export default CompanyOwnersAvatar
