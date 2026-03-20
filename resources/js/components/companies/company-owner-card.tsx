import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import {
    Cake,
    Check,
    Copy,
    Download,
    ExternalLink,
    Facebook,
    Mail,
    MapPin,
    Phone,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    owner: User;
}

const CompanyOwnerCard = ({ owner }: Props) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return null;
        }
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const birthday = formatDate(owner.birthdate);

    return (
        <div className="group  border bg-card p-4 transition-all duration-200 hover:border-pink-500/30 hover:shadow-md">
            {/* Header with Avatar and Name */}
            <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 shadow-sm ring-2 ring-background">
                    <AvatarImage src={owner.photo} alt={owner.name} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-blue-500 text-sm font-medium text-white">
                        {getInitials(owner.name)}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-foreground">
                        {owner.name}
                    </h3>
                    {owner.role && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {owner.role}
                        </p>
                    )}
                </div>
            </div>

            {/* Divider */}
            <div className="my-3 h-px bg-border" />

            {/* Contact Information Grid */}
            <div className="space-y-2">
                {/* Email */}
                <div className="group/row flex items-center gap-2 text-sm">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-pink-500" />
                    <a
                        href={`mailto:${owner.email}`}
                        className="flex-1 truncate text-foreground transition-colors hover:text-pink-600"
                    >
                        {owner.email}
                    </a>
                    <button
                        onClick={() => copyToClipboard(owner.email, 'email')}
                        className="shrink-0 opacity-0 transition-opacity group-hover/row:opacity-100"
                    >
                        {copiedField === 'email' ? (
                            <Check className="h-3 w-3 text-green-500" />
                        ) : (
                            <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        )}
                    </button>
                </div>

                {/* Phone */}
                <div className="group/row flex items-center gap-2 text-sm">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-pink-500" />
                    <a
                        href={`tel:${owner.phone}`}
                        className="flex-1 truncate text-foreground transition-colors hover:text-pink-600"
                    >
                        {owner.phone}
                    </a>
                    <button
                        onClick={() => copyToClipboard(owner.phone, 'phone')}
                        className="shrink-0 opacity-0 transition-opacity group-hover/row:opacity-100"
                    >
                        {copiedField === 'phone' ? (
                            <Check className="h-3 w-3 text-green-500" />
                        ) : (
                            <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        )}
                    </button>
                </div>

                {/* Facebook */}
                {owner.facebook && (
                    <div className="flex items-center gap-2 text-sm">
                        <Facebook className="h-3.5 w-3.5 shrink-0 text-pink-500" />
                        <a
                            href={owner.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex flex-1 items-center gap-1 truncate text-foreground transition-colors hover:text-pink-600"
                        >
                            View Profile
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                )}

                {/* Birthday */}
                {birthday && (
                    <div className="flex items-center gap-2 text-sm">
                        <Cake className="h-3.5 w-3.5 shrink-0 text-pink-500" />
                        <span className="flex-1 truncate text-foreground">
                            {birthday}
                        </span>
                    </div>
                )}

                {/* Address */}
                {owner.address && (
                    <div className="flex items-start gap-2 text-sm">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-pink-500" />
                        <span className="line-clamp-2 flex-1 text-foreground">
                            {owner.address}
                        </span>
                    </div>
                )}
            </div>

            {/* Signature Footer */}
            {owner.signature?.original_url && (
                <div className="mt-3 border-t pt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-full gap-2 text-xs hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950/20"
                        onClick={() =>
                            window.open(owner.signature?.original_url, '_blank')
                        }
                    >
                        <Download className="h-3.5 w-3.5" />
                        Download Signature
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CompanyOwnerCard;
