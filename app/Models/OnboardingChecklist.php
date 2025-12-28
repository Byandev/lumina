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

    public function remarks(){
        return $this->hasMany(ChecklistRemark::class);
    }


}
