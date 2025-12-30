<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $guarded = [];


    public function sponsor(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Company::class, 'sponsor_id');
    }

    // Companies that THIS company sponsors
    public function sponsoredCompanies()
    {
        return $this->hasMany(Company::class, 'sponsor_id');
    }

    public function coach()
    {
        return $this->hasOne(User::class, 'id', 'coach_id');
    }

    public function owners(){
        return $this->hasMany(User::class);
    }

    public function checklists()
    {
        return $this->hasMany(OnboardingChecklist::class);
    }


    public function getChecklistProgressAttribute()
    {
        $total = $this->checklists()->count();
        if ($total === 0) {
            return 0;
        }

        $completed = $this->checklists()->where('is_completed', true)->count();

        return round(($completed / $total) * 100);
    }

    public function getCompletedChecklistCountAttribute()
    {
        return $this->checklists()->where('is_completed', true)->count();
    }

    public function getTotalChecklistCountAttribute()
    {
        return $this->checklists()->count();
    }

    public function remarks()
    {
        return $this->hasMany(ChecklistRemark::class);
    }

    public function events()
    {
        return $this->belongsToMany(
            Event::class,
            'company_events',
            'company_id',
            'event_id'
        );
    }

    public function attendances()
    {
        return $this->hasMany(CompanyEvent::class);
    }

    public function records()
    {
        return $this->hasMany(PerformanceRecord::class);
    }








}
