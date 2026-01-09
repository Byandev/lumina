<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Facades\Storage;

class CompanyChecklist extends Pivot
{
    protected $table = 'company_checklists';

    protected $casts = [
        'is_completed' => 'boolean',
    ];

    protected $fillable = [
        'company_id',
        'checklist_id',
        'is_completed',
        'remark',
        'file'
    ];


    protected $appends = ['file_url'];

    public function getFileUrlAttribute(): ?string
    {
        if (!$this->file) {
            return null;
        }

        return Storage::disk('s3')->temporaryUrl(
            $this->file,
            now()->addMinutes(10)
        );
    }


}
