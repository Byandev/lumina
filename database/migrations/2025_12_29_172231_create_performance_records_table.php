<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('performance_records', function (Blueprint $table) {
            $table->id();

            $table->foreignId('company_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->date('start_date');
            $table->date('end_date');

            $table->string('phase')->index();

            $table->unsignedInteger('no_of_items');

            $table->decimal('avg_ads_spent', 8, 2)->default(0.00);
            $table->decimal('roas', 8, 2)->default(0.00);
            $table->decimal('rts', 8, 2)->default(0.00);

            $table->text('highlights')->nullable();
            $table->text('challenges')->nullable();
            $table->text('action_plan')->nullable();

            $table->string('attachment_path')->nullable();

            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('performance_records');
    }
};
