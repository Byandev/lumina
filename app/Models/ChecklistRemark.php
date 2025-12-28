<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChecklistRemark extends Model
{
    protected $fillable = [
        'checklist_id',
        'company_id',
        'remark',
        'file'
    ];

    public function company(){
        return $this->belongsTo(Company::class);
    }

    public function checklist(){
        return $this->belongsTo(OnboardingChecklist::class);
    }
}
