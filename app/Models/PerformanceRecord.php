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



    /* ====================
       Relationships
    ==================== */

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
