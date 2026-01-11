import { Company } from '@/types/models/Company';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const CompanyOwnersAvatar = ({ company } : { company: Company }) =>{

    return <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
        {
            (company.owners ?? [])
                .map(owner =>
                    <Tooltip key={`company-${company.id}-owner-${owner.id}`}>
                        <TooltipTrigger asChild>
                            <Avatar>
                                <AvatarImage src={`/${owner.photo}`} alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
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
