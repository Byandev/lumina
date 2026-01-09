<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OnboardingChecklist extends Model
{
    protected $fillable = [
        'company_id',
        'title',
        'is_completed',
    ];


    protected $casts = [
        'is_completed' => 'boolean',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function companies()
    {
        return $this->belongsToMany(Company::class, 'company_checklists', 'checklist_id', 'company_id')
            ->withPivot('remark', 'file', 'is_completed')
            ->withTimestamps();
    }


}
