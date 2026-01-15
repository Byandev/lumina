<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
