<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Event extends Model
{
    protected $table = 'events';
    protected $fillable = [
        'name',
        'date',
        'type',
        'location',
    ];

    public function companies()
    {
        return $this->belongsToMany(
            Company::class,
            'company_events',
            'event_id',
            'company_id'
        );
    }

    public function syncAttendance(int $companyId, string $status): void
    {
        // Ensure the company is attached, then update pivot fields
        $this->companies()->syncWithoutDetaching([
            $companyId => [
                'status' => $status,
            ],
        ]);
    }
}
