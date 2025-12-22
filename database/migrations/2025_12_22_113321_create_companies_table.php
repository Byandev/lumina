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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();

            $table->string('logo')->nullable();
            $table->string('owner_photo')->nullable();

            $table->enum('status', ['active', 'inactive', 'terminated'])->default('inactive');
            $table->enum('notarization_status', ['pending', 'done', 'rejected'])->default('pending');
            $table->enum('erp_status', ['active', 'inactive'])->default('active');
            $table->enum('sales_activity', ['generating', 'testing', 'inactive'])->nullable();
            $table->enum('level', ['educate', 'empowerment', 'enterprise', 'exponential'])->default('educate');

            $table->unsignedBigInteger('sponsor_id')->nullable();
            $table->foreign('sponsor_id')->references('id')->on('companies');

            $table->timestamps();

            // Indexes
            $table->index('erp_status');
            $table->index(['status', 'notarization_status']);
            $table->index(['status', 'erp_status', 'level']);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
            Schema::dropIfExists('companies');
    }
};
