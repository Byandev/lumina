<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChecklistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('onboarding_checklists')->insert([
            ['title' => 'Departmental/BU Orientation Completion'],
            ['title' => 'Contract Draft for Partner Review'],
            ['title' => 'Contract Prepared & Signing Scheduled'],
            ['title' => 'Actual Contract Signing'],
            ['title' => 'Distribution of Complete Partners Kit'],
            ['title' => 'Scan & Upload Signed Documents to Virtual Drive'],
            ['title' => 'Email Request for iHike-ERP Set-up'],
            ['title' => 'Discord Activation'],
            ['title' => 'Exponential University Access Grant and Completion'],
            ['title' => 'Endorsement to Educate Team (Basic E-comm Training)'],
            ['title' => 'Document Signature Routing'],
            ['title' => 'Notarization of Signed Documents'],
            ['title' => 'Partner Endorsement to Departments and Business Units'],
            ['title' => 'Endorsement to I AM + Team'],
            ['title' => 'Endorsed to Finance for I AM + Programs'],
            ['title' => 'Endorsement to Quantum Scale'],
            ['title' => 'Post-Orientation Starter Kit Handover'],
            ['title' => 'Endorsed to Lucky Guerzon for Posters & Summit Slides'],
            ['title' => 'Full Company Transition (If Applicable)'],
            ['title' => 'Onboarding Completion'],
            ['title' => 'Full Messenger Dissolution'],
        ]);
    }
}
