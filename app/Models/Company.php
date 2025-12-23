<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $guarded = [];


    public function sponsorTo()
    {
        return $this->belongsTo(Company::class);
    }

    public function sponsorBy()
    {
        return $this->belongsTo(Company::class);
    }

    public function coach()
    {
        return $this->hasOne(User::class, 'id', 'coach_id');
    }

    public function owners(){
        return $this->hasMany(User::class, );
    }






}
