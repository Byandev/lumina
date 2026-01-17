<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class PerformanceRecord extends Model implements HasMedia
{
    protected $table = 'performance_records';

    use InteractsWithMedia;

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
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
        'no_of_items' => 'integer',
        'avg_ads_spent' => 'decimal:2',
        'roas' => 'decimal:2',
        'rts' => 'decimal:2',
        'total_revenue' => 'decimal:2',
        'gross_profit' => 'decimal:2',
        'profit_margin' => 'decimal:2',
    ];

    public function company(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Company::class);
    }


    public function attachment(): MorphOne
    {
        return $this->morphOne(Media::class, 'model')
            ->where('collection_name', 'PERFORMANCE_RECORD_ATTACHMENT');
    }
}
