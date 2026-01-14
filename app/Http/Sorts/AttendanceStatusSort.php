<?php

namespace App\Http\Sorts;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Sorts\Sort;

class AttendanceStatusSort implements Sort
{
    public function __invoke(Builder $query, bool $descending, string $property): void
    {
        // $property will be "attendance_status"
        $direction = $descending ? 'DESC' : 'ASC';

        $query->orderByRaw("
            CASE {$property}
                WHEN 'present' THEN 1
                WHEN 'late' THEN 2
                WHEN 'clearing' THEN 3
                WHEN 'absent' THEN 4
                ELSE 5
            END {$direction}
        ");
    }
}
