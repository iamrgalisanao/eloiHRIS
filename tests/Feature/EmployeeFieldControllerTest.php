<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\EmployeeFieldValue;
use App\Models\JobInfo;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EmployeeFieldControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Gate::define('manage-settings', fn () => true);
    }

    private function makeUserWithOrg(): User
    {
        $org = Organization::create(['name' => 'Org A', 'slug' => 'orga']);
        $user = User::factory()->create(['organization_id' => $org->id]);
        return $user;
    }

    public function test_list_returns_values_with_counts(): void
    {
        $user = $this->makeUserWithOrg();
        Sanctum::actingAs($user);

        // Seed two departments and job_info usage
        $sales = EmployeeFieldValue::create([
            'organization_id' => $user->organization_id,
            'category' => 'department',
            'label' => 'Sales',
            'label_slug' => EmployeeFieldValue::makeLabelSlug('Sales'),
        ]);
        $hr = EmployeeFieldValue::create([
            'organization_id' => $user->organization_id,
            'category' => 'department',
            'label' => 'HR',
            'label_slug' => EmployeeFieldValue::makeLabelSlug('HR'),
        ]);

        $emp = Employee::create(['organization_id' => $user->organization_id, 'status' => 'active']);
        JobInfo::create([
            'organization_id' => $user->organization_id,
            'employee_id' => $emp->id,
            'job_title' => 'Manager',
            'hire_date' => now()->toDateString(),
            'department' => 'Sales',
        ]);

        $res = $this->getJson('/api/employee-fields?category=department');
        $res->assertOk();
        $data = $res->json();
        $this->assertCount(2, $data);
        $salesRow = collect($data)->firstWhere('label', 'Sales');
        $this->assertEquals(1, $salesRow['people_count']);
    }

    public function test_create_enforces_case_insensitive_uniqueness(): void
    {
        $user = $this->makeUserWithOrg();
        Sanctum::actingAs($user);

        $payload = ['label' => 'Sales'];
        $this->postJson('/api/employee-fields/department', $payload)->assertCreated();
        $this->postJson('/api/employee-fields/department', ['label' => 'sales'])
            ->assertStatus(422)
            ->assertJson(['code' => 'duplicate_label']);
    }

    public function test_rename_with_cascade_updates_job_info(): void
    {
        $user = $this->makeUserWithOrg();
        Sanctum::actingAs($user);

        $val = EmployeeFieldValue::create([
            'organization_id' => $user->organization_id,
            'category' => 'department',
            'label' => 'Sales',
            'label_slug' => EmployeeFieldValue::makeLabelSlug('Sales'),
        ]);
        $emp = Employee::create(['organization_id' => $user->organization_id, 'status' => 'active']);
        JobInfo::create([
            'organization_id' => $user->organization_id,
            'employee_id' => $emp->id,
            'job_title' => 'Rep',
            'hire_date' => now()->toDateString(),
            'department' => 'Sales',
        ]);

        $this->putJson("/api/employee-fields/department/{$val->id}", ['label' => 'Revenue', 'cascade' => true])
            ->assertOk()
            ->assertJson(['label' => 'Revenue']);

        $this->assertDatabaseHas('job_info', [
            'organization_id' => $user->organization_id,
            'department' => 'Revenue',
        ]);
    }

    public function test_delete_requires_transfer_when_in_use(): void
    {
        $user = $this->makeUserWithOrg();
        Sanctum::actingAs($user);

        $sales = EmployeeFieldValue::create([
            'organization_id' => $user->organization_id,
            'category' => 'department',
            'label' => 'Sales',
            'label_slug' => EmployeeFieldValue::makeLabelSlug('Sales'),
        ]);
        $hr = EmployeeFieldValue::create([
            'organization_id' => $user->organization_id,
            'category' => 'department',
            'label' => 'HR',
            'label_slug' => EmployeeFieldValue::makeLabelSlug('HR'),
        ]);
        $emp = Employee::create(['organization_id' => $user->organization_id, 'status' => 'active']);
        JobInfo::create([
            'organization_id' => $user->organization_id,
            'employee_id' => $emp->id,
            'job_title' => 'Rep',
            'hire_date' => now()->toDateString(),
            'department' => 'Sales',
        ]);

        $this->deleteJson("/api/employee-fields/department/{$sales->id}")
            ->assertStatus(422)
            ->assertJson(['code' => 'transfer_required']);

        $this->deleteJson("/api/employee-fields/department/{$sales->id}?transfer_to={$hr->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('employee_field_values', [
            'id' => $sales->id,
        ]);
        $this->assertDatabaseHas('job_info', [
            'organization_id' => $user->organization_id,
            'department' => 'HR',
        ]);
    }
}
