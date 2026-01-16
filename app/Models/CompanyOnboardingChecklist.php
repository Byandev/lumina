<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class CompanyOnboardingChecklist extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $guarded = [];

    protected $casts = [
        'is_complete' => 'boolean',
    ];

    public function attachment(): MorphOne
    {
        return $this->morphOne(Media::class, 'model')
            ->where('collection_name', 'ONBOARDING_CHECKLIST_ATTACHMENT');
    }
}
