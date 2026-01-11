<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PerformanceRecord extends Model
{
    protected $table = 'performance_records';

    protected $fillable = [
        'company_id',
        'start_date',
        'end_date',
        'phase',
        'no_of_items',
        'avg_ads_spent',
        'roas',
        'rts',
        'highlights',
        'challenges',
        'action_plan',
        'attachment_path',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'no_of_items' => 'integer',
        'avg_ads_spent' => 'decimal:2',
        'roas' => 'decimal:2',
        'rts' => 'decimal:2',
        'total_revenue' => 'decimal:2',
        'gross_profit' => 'decimal:2',
        'profit_margin' => 'decimal:2',
        'highlights' => 'string',
        'challenges' => 'string',
        'action_plan' => 'string',
    ];

    protected $appends = [
        'attachment_path_url',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function getAttachmentPathUrlAttribute(): ?string
    {
        if (! $this->attachment_path) {
            return null;
        }

        return Storage::disk('s3')->temporaryUrl(
            $this->attachment_path,
            now()->addMinutes(10)
        );
    }
}
