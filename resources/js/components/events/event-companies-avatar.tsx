import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface Event {
    id: number;
    name: string;
    companies?: {
        logo?: string | null;
        id: number;
        name: string;
    }[];
}

const EventCompaniesAvatar = ({ event }: { event: Event }) => {
    return (
        <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
            {(event.companies ?? []).map((company) => (
                <Tooltip key={`company-${company.id}`}>
                    <TooltipTrigger asChild>
                        <Avatar>
                            <AvatarImage
                                src={`/${company.logo}`}
                                alt={company.name}
                            />
                            <AvatarFallback>
                                {company.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </TooltipTrigger>

                    <TooltipContent>{company.name}</TooltipContent>
                </Tooltip>
            ))}
        </div>
    );
};

export default EventCompaniesAvatar;
