<template>
  <div>
    <div class="card">
      <div class="card-header border-0 pt-6">
        <div class="card-title">
          <!-- Search Input -->
          <!-- Adjusted alignment for symmetry -->
          <div class="d-flex align-items-center position-relative my-1">
            <KTIcon
              icon-name="magnifier"
              icon-class="fs-1 position-absolute ms-6"
            />
            <input
              type="text"
              class="form-control form-control-solid w-250px ps-15"
              v-model="search"
              @input="searchPacks"
              placeholder="Search Packs"
            />
          </div>
        </div>
        <!-- Card toolbar -->
        <div class="card-toolbar">
          
          <div
            class="d-flex justify-content-end"
            data-kt-user-table-toolbar="base"
          >
          
            <button
              type="button"
              class="btn btn-primary"
              @click="() => (dialogAddVisible = true)"
            >
              <KTIcon icon-name="plus" icon-class="fs-2" /> Add Pack
            </button>
          </div>
        </div>
      </div>

      <div class="card-body pt-0">
        <!-- Datatable component -->

        <Datatable
          :data="tableData"
          :header="tableHeader"
          class="datatable"
          :checkbox-enabled="false"
        >
          <!-- Name Column -->
          <template v-slot:name="{ row: pack }">
            {{ pack.name }}
          </template>

          <!-- Description Column -->
          <template v-slot:description="{ row: pack }">
            {{ pack.description }}
          </template>

          <!-- Student Limit Column -->
          <template v-slot:studentLimit="{ row: pack }">
            {{ pack.studentLimit }}
          </template>
          <template v-slot:userLimit="{ row: pack }">
            {{ pack.userLimit }}
          </template>
          <template v-slot:status="{ row:pack }">
            <span :class="[
              'badge',
             pack.status === 'active' ? 'badge-light-success' : 'badge-light-danger'
            ]">
              {{pack.status === 'active' ? 'Active' : 'Inactive' }}
            </span>
          </template>

          <!-- actions Details Column -->
          <template v-slot:view="{ row: pack }">
            <router-link
            :to="{
              name: 'pack-details',
              query: { packData: JSON.stringify(pack) }, // Stringify the object
            }"
              >
          <el-button type="secondary" :icon="View" circle></el-button>
          &nbsp;

          </router-link>
         
            <el-button
            type="primary"
            :icon="Edit"
            circle
            @click="modifyPack(pack)"
          />
          <el-popconfirm
          v-if="pack.status === 'active'"
          :title="'Are sure to desactivate this pack ?'"
          @confirm="togglepackStatus(pack)"
        >
          <template #reference>
            <el-button type="danger" :icon="Close" circle />
          </template>
        </el-popconfirm>
        <el-popconfirm
          v-else
          :title="'Are sure to activate this pack ?'"
          @confirm="togglepackStatus(pack)"
        >
          <template #reference>
            <el-button type="success" :icon="Check" circle />
          </template>
        </el-popconfirm>
          </template>
        </Datatable>
      </div>
    </div>
    <el-dialog v-model="dialogAddVisible" title="Add Pack" width="800">
            <el-form
              ref="ruleFormRef"
              :model="formData"
              :rules="rules"
              @submit.prevent="addPack"
            >
              <el-form-item label=" Keys:">
                <div
                  class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    checked
                  />
                  <label class="form-check-label" for="">
                    Visible &nbsp;
                  </label>
                </div>
                <div
                  class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    checked
                  />
                  <label class="form-check-label" for=""> Hidden &nbsp; </label>
                </div>

                <div
                  class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    checked
                  />
                  <label class="form-check-label" for=""> Disable </label>
                </div>
              </el-form-item>
              <el-form-item label="Pack Name" prop="packName">
                <el-input v-model="formData.name" />
              </el-form-item>
              <el-form-item label="Description" prop="description">
                <el-input type="textarea" v-model="formData.description" />
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="Student Limit" prop="studentLimit">
                    <el-input-number
                      v-model.number="formData.studentLimit"
                      controls-position="right"
                      :min="0"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="User Limit" prop="userLimit">
                    <el-input-number
                      v-model.number="formData.userLimit"
                      controls-position="right"
                      :min="0"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- Manager Access Settings -->
              <div class="separator separator-content my-15">EdManager</div>
              <!-- Move the active checkbox to a separate line -->
              <div class="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="active"
                  v-model="formData.access.edManager.active"
                />
                <label class="form-check-label" for="active">Active</label>
              </div>

              <ol
                class="breadcrumb breadcrumb-line text-muted fs-6 fw-semibold d-flex justify-content-center align-items-center"
              >
                <li class="breadcrumb-item text-muted">Communication</li>
              </ol>

              <el-row>
                <el-col :span="8">
                  <el-form-item label="Cantine">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edManager.cantine === 'v'"
                        @change="
                          handleCheckboxGroup('edManager', 'cantine', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edManager.cantine === 'h'"
                        @change="
                          handleCheckboxGroup('edManager', 'cantine', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edManager.cantine === 'd'"
                        @change="
                          handleCheckboxGroup('edManager', 'cantine', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- Emplois Options -->
                <el-col :span="8">
                  <el-form-item label="Emplois">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edManager.emplois === 'v'"
                        @change="
                          handleCheckboxGroup('edManager', 'emplois', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edManager.emplois === 'h'"
                        @change="
                          handleCheckboxGroup('edManager', 'emplois', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edManager.emplois === 'd'"
                        @change="
                          handleCheckboxGroup('edManager', 'emplois', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- News Options -->
                <el-col :span="8">
                  <el-form-item label="News">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edManager.news === 'v'"
                        @change="handleCheckboxGroup('edManager', 'news', 'v')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edManager.news === 'h'"
                        @change="handleCheckboxGroup('edManager', 'news', 'h')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edManager.news === 'd'"
                        @change="handleCheckboxGroup('edManager', 'news', 'd')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- SMS Options -->
                <el-col :span="8">
                  <el-form-item label="SMS">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edManager.sms === 'v'"
                        @change="handleCheckboxGroup('edManager', 'sms', 'v')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edManager.sms === 'h'"
                        @change="handleCheckboxGroup('edManager', 'sms', 'h')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edManager.sms === 'd'"
                        @change="handleCheckboxGroup('edManager', 'sms', 'd')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <ol
                class="breadcrumb breadcrumb-line text-muted fs-6 fw-semibold d-flex justify-content-center align-items-center"
              >
                <li class="breadcrumb-item text-muted">Smart Features</li>
              </ol>

              <el-row>
                <!-- SmartSchedule Options -->
                <el-col :span="8">
                  <el-form-item label="SmartSchedule">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          formData.access.edManager.smartSchedule === 'v'
                        "
                        @change="
                          handleCheckboxGroup('edManager', 'smartSchedule', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          formData.access.edManager.smartSchedule === 'h'
                        "
                        @change="
                          handleCheckboxGroup('edManager', 'smartSchedule', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          formData.access.edManager.smartSchedule === 'd'
                        "
                        @change="
                          handleCheckboxGroup('edManager', 'smartSchedule', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- BulletinStatistique Options -->
                <el-col :span="8">
                  <el-form-item label="BulletinStatistique">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          formData.access.edManager.bulletinStatistique === 'v'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'bulletinStatistique',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          formData.access.edManager.bulletinStatistique === 'h'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'bulletinStatistique',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          formData.access.edManager.bulletinStatistique === 'd'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'bulletinStatistique',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- StatstiqueGeneral Options -->
                <el-col :span="8">
                  <el-form-item label="StatstiqueGeneral">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          formData.access.edManager.statstiqueGeneral === 'v'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'statstiqueGeneral',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          formData.access.edManager.statstiqueGeneral === 'h'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'statstiqueGeneral',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          formData.access.edManager.statstiqueGeneral === 'd'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'statstiqueGeneral',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <ol
                class="breadcrumb breadcrumb-line text-muted fs-6 fw-semibold d-flex justify-content-center align-items-center"
              >
                <li class="breadcrumb-item text-muted">Parametrage</li>
              </ol>

              <el-row>
                <!-- parametrageEtablissement Options -->
                <el-col :span="8">
                  <el-form-item label="Etablissement">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          formData.access.edManager.parametrageEtablissement ===
                          'v'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'parametrageEtablissement',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          formData.access.edManager.parametrageEtablissement ===
                          'h'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'parametrageEtablissement',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          formData.access.edManager.parametrageEtablissement ===
                          'd'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'parametrageEtablissement',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- parametrageComptabilite Options -->
                <el-col :span="8">
                  <el-form-item label="Comptabilite">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          formData.access.edManager.parametrageComptabilite ===
                          'v'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'parametrageComptabilite',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          formData.access.edManager.parametrageComptabilite ===
                          'h'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'parametrageComptabilite',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          formData.access.edManager.parametrageComptabilite ===
                          'd'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'parametrageComptabilite',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- parametrageScolarite Options -->
                <el-col :span="8">
                  <el-form-item label="Scolarite">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          formData.access.edManager.parametrageScolarite === 'v'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'parametrageScolarite',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          formData.access.edManager.parametrageScolarite === 'h'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'parametrageScolarite',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          formData.access.edManager.parametrageScolarite === 'd'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'parametrageScolarite',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- adminstration Options -->
                <el-col :span="8">
                  <el-form-item label="Administration">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          formData.access.edManager.adminstration === 'v'
                        "
                        @change="
                          handleCheckboxGroup('edManager', 'adminstration', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          formData.access.edManager.adminstration === 'h'
                        "
                        @change="
                          handleCheckboxGroup('edManager', 'adminstration', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          formData.access.edManager.adminstration === 'd'
                        "
                        @change="
                          handleCheckboxGroup('edManager', 'adminstration', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <ol
                class="breadcrumb breadcrumb-line text-muted fs-6 fw-semibold d-flex justify-content-center align-items-center"
              >
                <li class="breadcrumb-item text-muted">Student Management</li>
              </ol>

              <el-row>
                <!-- studentList Options -->
                <el-col :span="8">
                  <el-form-item label="StudentList">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edManager.studentList === 'v'"
                        @change="
                          handleCheckboxGroup('edManager', 'studentList', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edManager.studentList === 'h'"
                        @change="
                          handleCheckboxGroup('edManager', 'studentList', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edManager.studentList === 'd'"
                        @change="
                          handleCheckboxGroup('edManager', 'studentList', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- activites Options -->
                <el-col :span="8">
                  <el-form-item label="Activites">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edManager.activites === 'v'"
                        @change="
                          handleCheckboxGroup('edManager', 'activites', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edManager.activites === 'h'"
                        @change="
                          handleCheckboxGroup('edManager', 'activites', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edManager.activites === 'd'"
                        @change="
                          handleCheckboxGroup('edManager', 'activites', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- scolarite Options -->
                <el-col :span="8">
                  <el-form-item label="Scolarite">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edManager.scolarite === 'v'"
                        @change="
                          handleCheckboxGroup('edManager', 'scolarite', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edManager.scolarite === 'h'"
                        @change="
                          handleCheckboxGroup('edManager', 'scolarite', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edManager.scolarite === 'd'"
                        @change="
                          handleCheckboxGroup('edManager', 'scolarite', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- attendance Options -->
                <el-col :span="8">
                  <el-form-item label="Attendance">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edManager.attendance === 'v'"
                        @change="
                          handleCheckboxGroup('edManager', 'attendance', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edManager.attendance === 'h'"
                        @change="
                          handleCheckboxGroup('edManager', 'attendance', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edManager.attendance === 'd'"
                        @change="
                          handleCheckboxGroup('edManager', 'attendance', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- punishments Options -->
                <el-col :span="8">
                  <el-form-item label="Punishments">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edManager.punishments === 'v'"
                        @change="
                          handleCheckboxGroup('edManager', 'punishments', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edManager.punishments === 'h'"
                        @change="
                          handleCheckboxGroup('edManager', 'punishments', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edManager.punishments === 'd'"
                        @change="
                          handleCheckboxGroup('edManager', 'punishments', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- teacherAvailability Options -->
                <el-col :span="8">
                  <el-form-item label="Teacher Availability">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          formData.access.edManager.teacherAvailability === 'v'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'teacherAvailability',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          formData.access.edManager.teacherAvailability === 'h'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'teacherAvailability',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          formData.access.edManager.teacherAvailability === 'd'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'teacherAvailability',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- personnel Options -->
                <el-col :span="8">
                  <el-form-item label="Personnel">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edManager.personnel === 'v'"
                        @change="
                          handleCheckboxGroup('edManager', 'personnel', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edManager.personnel === 'h'"
                        @change="
                          handleCheckboxGroup('edManager', 'personnel', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edManager.personnel === 'd'"
                        @change="
                          handleCheckboxGroup('edManager', 'personnel', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <ol
                class="breadcrumb breadcrumb-line text-muted fs-6 fw-semibold d-flex justify-content-center align-items-center"
              >
                <li class="breadcrumb-item text-muted">Bulletin</li>
              </ol>

              <el-row>
                <!-- bulletin Options -->
                <el-col :span="8">
                  <el-form-item label="Bulletin">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edManager.bulletin === 'v'"
                        @change="
                          handleCheckboxGroup('edManager', 'bulletin', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edManager.bulletin === 'h'"
                        @change="
                          handleCheckboxGroup('edManager', 'bulletin', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edManager.bulletin === 'd'"
                        @change="
                          handleCheckboxGroup('edManager', 'bulletin', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- bulletinSpecific Options -->
                <el-col :span="8">
                  <el-form-item label="BulletinSpecific">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          formData.access.edManager.bulletinSpecific === 'v'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'bulletinSpecific',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          formData.access.edManager.bulletinSpecific === 'h'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'bulletinSpecific',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          formData.access.edManager.bulletinSpecific === 'd'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'bulletinSpecific',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- bulletinPilote Options -->
                <el-col :span="8">
                  <el-form-item label="BulletinPilote">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          formData.access.edManager.bulletinPilote === 'v'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'bulletinPilote',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          formData.access.edManager.bulletinPilote === 'h'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'bulletinPilote',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          formData.access.edManager.bulletinPilote === 'd'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edManager',
                            'bulletinPilote',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <ol
                class="breadcrumb breadcrumb-line text-muted fs-6 fw-semibold d-flex justify-content-center align-items-center"
              >
                <li class="breadcrumb-item text-muted">Financial Management</li>
              </ol>

              <el-row>
                <!-- avance Options -->
                <el-col :span="8">
                  <el-form-item label="Avance">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edManager.avance === 'v'"
                        @change="
                          handleCheckboxGroup('edManager', 'avance', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edManager.avance === 'h'"
                        @change="
                          handleCheckboxGroup('edManager', 'avance', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edManager.avance === 'd'"
                        @change="
                          handleCheckboxGroup('edManager', 'avance', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- comptabilite Options -->
                <el-col :span="8">
                  <el-form-item label="Comptabilite">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          formData.access.edManager.comptabilite === 'v'
                        "
                        @change="
                          handleCheckboxGroup('edManager', 'comptabilite', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          formData.access.edManager.comptabilite === 'h'
                        "
                        @change="
                          handleCheckboxGroup('edManager', 'comptabilite', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          formData.access.edManager.comptabilite === 'd'
                        "
                        @change="
                          handleCheckboxGroup('edManager', 'comptabilite', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- declaration Options -->
                <el-col :span="8">
                  <el-form-item label="Declaration">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edManager.declaration === 'v'"
                        @change="
                          handleCheckboxGroup('edManager', 'declaration', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edManager.declaration === 'h'"
                        @change="
                          handleCheckboxGroup('edManager', 'declaration', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edManager.declaration === 'd'"
                        @change="
                          handleCheckboxGroup('edManager', 'declaration', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <ol
                class="breadcrumb breadcrumb-line text-muted fs-6 fw-semibold d-flex justify-content-center align-items-center"
              >
                <li class="breadcrumb-item text-muted">Calendar</li>
              </ol>

              <el-row>
                <!-- calender Options -->
                <el-col :span="8">
                  <el-form-item label="Calender">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edManager.calender === 'v'"
                        @change="
                          handleCheckboxGroup('edManager', 'calender', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edManager.calender === 'h'"
                        @change="
                          handleCheckboxGroup('edManager', 'calender', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edManager.calender === 'd'"
                        @change="
                          handleCheckboxGroup('edManager', 'calender', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <ol
                class="breadcrumb breadcrumb-line text-muted fs-6 fw-semibold d-flex justify-content-center align-items-center"
              >
                <li class="breadcrumb-item text-muted">Chat</li>
              </ol>

              <el-row>
                <!-- chat Options -->
                <el-col :span="8">
                  <el-form-item label="Chat">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edManager.chat === 'v'"
                        @change="handleCheckboxGroup('edManager', 'chat', 'v')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edManager.chat === 'h'"
                        @change="handleCheckboxGroup('edManager', 'chat', 'h')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edManager.chat === 'd'"
                        @change="handleCheckboxGroup('edManager', 'chat', 'd')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- ptchat Options -->
                <el-col :span="8">
                  <el-form-item label="Ptchat">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edManager.ptchat === 'v'"
                        @change="
                          handleCheckboxGroup('edManager', 'ptchat', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edManager.ptchat === 'h'"
                        @change="
                          handleCheckboxGroup('edManager', 'ptchat', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edManager.ptchat === 'd'"
                        @change="
                          handleCheckboxGroup('edManager', 'ptchat', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <ol
                class="breadcrumb breadcrumb-line text-muted fs-6 fw-semibold d-flex justify-content-center align-items-center"
              >
                <li class="breadcrumb-item text-muted">Allowed Export Btns</li>
              </ol>
              <div class="permissions-tree">
                
                <el-tree
                :data="treeData"
                :props="treeProps"
                node-key="key"
                show-checkbox
                default-expand-all
                v-model:checked-keys="checkedKeys"
                @check="handleCheck"
            ></el-tree>
            
              </div>

              <!-- Parent Access Settings -->
              <div class="separator separator-content my-15">EdParent</div>
              <div class="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="active"
                  v-model="formData.access.edParent.active"
                />
                <label class="form-check-label" for="active">Active</label>
              </div>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="SMS">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edParent.sms === 'v'"
                        @change="handleCheckboxGroup('edParent', 'sms', 'v')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edParent.sms === 'h'"
                        @change="handleCheckboxGroup('edParent', 'sms', 'h')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edParent.sms === 'd'"
                        @change="handleCheckboxGroup('edParent', 'sms', 'd')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- Liste_reglement Options for EdParent -->
                <el-col :span="8">
                  <el-form-item label="Liste_reglement">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          formData.access.edParent.liste_reglement === 'v'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edParent',
                            'liste_reglement',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          formData.access.edParent.liste_reglement === 'h'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edParent',
                            'liste_reglement',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          formData.access.edParent.liste_reglement === 'd'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edParent',
                            'liste_reglement',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- Learning Access Settings -->
              <div class="separator separator-content my-15">EdLearning</div>
              <div class="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="active"
                  v-model="formData.access.edLearning.active"
                />
                <label class="form-check-label" for="active">Active</label>
              </div>
              <el-row>
                <!-- SMS Options for EdLearning -->
                <el-col :span="8">
                  <el-form-item label="SMS">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edLearning.sms === 'v'"
                        @change="handleCheckboxGroup('edLearning', 'sms', 'v')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edLearning.sms === 'h'"
                        @change="handleCheckboxGroup('edLearning', 'sms', 'h')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edLearning.sms === 'd'"
                        @change="handleCheckboxGroup('edLearning', 'sms', 'd')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- Sghartoon Options for EdLearning -->
                <el-col :span="8">
                  <el-form-item label="Sghartoon">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edLearning.sghartoon === 'v'"
                        @change="
                          handleCheckboxGroup('edLearning', 'sghartoon', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edLearning.sghartoon === 'h'"
                        @change="
                          handleCheckboxGroup('edLearning', 'sghartoon', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edLearning.sghartoon === 'd'"
                        @change="
                          handleCheckboxGroup('edLearning', 'sghartoon', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- teacherAvailability Options for EdLearning -->
                <el-col :span="8">
                  <el-form-item label="TeacherAvailability">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          formData.access.edLearning.teacherAvailability === 'v'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edLearning',
                            'teacherAvailability',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          formData.access.edLearning.teacherAvailability === 'h'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edLearning',
                            'teacherAvailability',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          formData.access.edLearning.teacherAvailability === 'd'
                        "
                        @change="
                          handleCheckboxGroup(
                            'edLearning',
                            'teacherAvailability',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8"></el-col>
                <el-col :span="8">
                  <el-form-item label="advisor">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="formData.access.edLearning.advisor === 'v'"
                        @change="
                          handleCheckboxGroup('edLearning', 'advisor', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="formData.access.edLearning.advisor === 'h'"
                        @change="
                          handleCheckboxGroup('edLearning', 'advisor', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="formData.access.edLearning.advisor === 'd'"
                        @change="
                          handleCheckboxGroup('edLearning', 'advisor', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- Submit Button -->
              <el-form-item>
                <el-button type="primary" native-type="submit" @click="addPack" :loading="loading"
                  >Add Pack</el-button
                >
                <el-button type="reset" @click="discardChanges">Discard</el-button>
              </el-form-item>
            </el-form>
         
    </el-dialog>
    <!-- Modify Pack Modal -->
    <div
      class="modal fade"
      id="kt_modal_modify_pack"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modify Pack</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" @click="discardChange" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Modify Pack Form -->
            <el-form
              :model="selectedPack"
              :rules="rules"
              ref="modifyFormRef"
              @submit.prevent="updatePack"
            >
              <el-form-item label=" Keys:">
                <div
                  class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    checked
                  />
                  <label class="form-check-label" for="">
                    Visible &nbsp;
                  </label>
                </div>
                <div
                  class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    checked
                  />
                  <label class="form-check-label" for=""> Hidden &nbsp; </label>
                </div>

                <div
                  class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    checked
                  />
                  <label class="form-check-label" for=""> Disable </label>
                </div>
              </el-form-item>
              <el-form-item label="Pack Name" prop="packName">
                <el-input v-model="selectedPack.name" />
              </el-form-item>
              <el-form-item label="Description" prop="description">
                <el-input type="textarea" v-model="selectedPack.description" />
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="Student Limit" prop="studentLimit">
                    <el-input-number
                      v-model.number="selectedPack.studentLimit"
                      controls-position="right"
                      :min="0"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="User Limit" prop="userLimit">
                    <el-input-number
                      v-model.number="selectedPack.userLimit"
                      controls-position="right"
                      :min="0"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- Manager Access Settings -->
              <div class="separator separator-content my-15">edManager</div>
              <!-- Move the active checkbox to a separate line -->
              <div class="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="active"
                  v-model="selectedPack.access.edManager.active"
                />
                <label class="form-check-label" for="active">Active</label>
              </div>

              <ol
                class="breadcrumb breadcrumb-line text-muted fs-6 fw-semibold d-flex justify-content-center align-items-center"
              >
                <li class="breadcrumb-item text-muted">Communication</li>
              </ol>

              <el-row>
                <el-col :span="8">
                  <el-form-item label="Cantine">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="selectedPack.access.edManager.cantine === 'v'"
                        @change="
                          handleCheckboxGroup1('edManager', 'cantine', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="selectedPack.access.edManager.cantine === 'h'"
                        @change="
                          handleCheckboxGroup1('edManager', 'cantine', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="selectedPack.access.edManager.cantine === 'd'"
                        @change="
                          handleCheckboxGroup1('edManager', 'cantine', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- Emplois Options -->
                <el-col :span="8">
                  <el-form-item label="Emplois">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="selectedPack.access.edManager.emplois === 'v'"
                        @change="
                          handleCheckboxGroup1('edManager', 'emplois', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="selectedPack.access.edManager.emplois === 'h'"
                        @change="
                          handleCheckboxGroup1('edManager', 'emplois', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="selectedPack.access.edManager.emplois === 'd'"
                        @change="
                          handleCheckboxGroup1('edManager', 'emplois', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- News Options -->
                <el-col :span="8">
                  <el-form-item label="News">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="selectedPack.access.edManager.news === 'v'"
                        @change="handleCheckboxGroup1('edManager', 'news', 'v')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="selectedPack.access.edManager.news === 'h'"
                        @change="handleCheckboxGroup1('edManager', 'news', 'h')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="selectedPack.access.edManager.news === 'd'"
                        @change="handleCheckboxGroup1('edManager', 'news', 'd')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- SMS Options -->
                <el-col :span="8">
                  <el-form-item label="SMS">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="selectedPack.access.edManager.sms === 'v'"
                        @change="handleCheckboxGroup1('edManager', 'sms', 'v')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="selectedPack.access.edManager.sms === 'h'"
                        @change="handleCheckboxGroup1('edManager', 'sms', 'h')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="selectedPack.access.edManager.sms === 'd'"
                        @change="handleCheckboxGroup1('edManager', 'sms', 'd')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <ol
                class="breadcrumb breadcrumb-line text-muted fs-6 fw-semibold d-flex justify-content-center align-items-center"
              >
                <li class="breadcrumb-item text-muted">Smart Features</li>
              </ol>

              <el-row>
                <!-- SmartSchedule Options -->
                <el-col :span="8">
                  <el-form-item label="SmartSchedule">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager.smartSchedule === 'v'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'smartSchedule',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager.smartSchedule === 'h'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'smartSchedule',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager.smartSchedule === 'd'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'smartSchedule',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- BulletinStatistique Options -->
                <el-col :span="8">
                  <el-form-item label="BulletinStatistique">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager.bulletinStatistique ===
                          'v'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'bulletinStatistique',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager.bulletinStatistique ===
                          'h'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'bulletinStatistique',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager.bulletinStatistique ===
                          'd'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'bulletinStatistique',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- StatstiqueGeneral Options -->
                <el-col :span="8">
                  <el-form-item label="StatstiqueGeneral">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager.statstiqueGeneral ===
                          'v'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'statstiqueGeneral',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager.statstiqueGeneral ===
                          'h'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'statstiqueGeneral',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager.statstiqueGeneral ===
                          'd'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'statstiqueGeneral',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <ol
                class="breadcrumb breadcrumb-line text-muted fs-6 fw-semibold d-flex justify-content-center align-items-center"
              >
                <li class="breadcrumb-item text-muted">Parametrage</li>
              </ol>

              <el-row>
                <!-- parametrageEtablissement Options -->
                <el-col :span="8">
                  <el-form-item label="Etablissement">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager
                            .parametrageEtablissement === 'v'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'parametrageEtablissement',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager
                            .parametrageEtablissement === 'h'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'parametrageEtablissement',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager
                            .parametrageEtablissement === 'd'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'parametrageEtablissement',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- parametrageComptabilite Options -->
                <el-col :span="8">
                  <el-form-item label="Comptabilite">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager
                            .parametrageComptabilite === 'v'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'parametrageComptabilite',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager
                            .parametrageComptabilite === 'h'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'parametrageComptabilite',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager
                            .parametrageComptabilite === 'd'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'parametrageComptabilite',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- parametrageScolarite Options -->
                <el-col :span="8">
                  <el-form-item label="Scolarite">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager.parametrageScolarite ===
                          'v'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'parametrageScolarite',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager.parametrageScolarite ===
                          'h'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'parametrageScolarite',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager.parametrageScolarite ===
                          'd'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'parametrageScolarite',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- adminstration Options -->
                <el-col :span="8">
                  <el-form-item label="Administration">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager.adminstration === 'v'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'adminstration',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager.adminstration === 'h'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'adminstration',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager.adminstration === 'd'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'adminstration',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <ol
                class="breadcrumb breadcrumb-line text-muted fs-6 fw-semibold d-flex justify-content-center align-items-center"
              >
                <li class="breadcrumb-item text-muted">Student Management</li>
              </ol>

              <el-row>
                <!-- studentList Options -->
                <el-col :span="8">
                  <el-form-item label="StudentList">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager.studentList === 'v'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'studentList', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager.studentList === 'h'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'studentList', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager.studentList === 'd'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'studentList', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- activites Options -->
                <el-col :span="8">
                  <el-form-item label="Activites">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager.activites === 'v'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'activites', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager.activites === 'h'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'activites', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager.activites === 'd'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'activites', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- scolarite Options -->
                <el-col :span="8">
                  <el-form-item label="Scolarite">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager.scolarite === 'v'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'scolarite', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager.scolarite === 'h'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'scolarite', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager.scolarite === 'd'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'scolarite', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- attendance Options -->
                <el-col :span="8">
                  <el-form-item label="Attendance">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager.attendance === 'v'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'attendance', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager.attendance === 'h'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'attendance', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager.attendance === 'd'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'attendance', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- punishments Options -->
                <el-col :span="8">
                  <el-form-item label="Punishments">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager.punishments === 'v'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'punishments', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager.punishments === 'h'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'punishments', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager.punishments === 'd'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'punishments', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- teacherAvailability Options -->
                <el-col :span="8">
                  <el-form-item label="Teacher Availability">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager.teacherAvailability ===
                          'v'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'teacherAvailability',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager.teacherAvailability ===
                          'h'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'teacherAvailability',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager.teacherAvailability ===
                          'd'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'teacherAvailability',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- personnel Options -->
                <el-col :span="8">
                  <el-form-item label="Personnel">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager.personnel === 'v'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'personnel', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager.personnel === 'h'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'personnel', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager.personnel === 'd'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'personnel', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <ol
                class="breadcrumb breadcrumb-line text-muted fs-6 fw-semibold d-flex justify-content-center align-items-center"
              >
                <li class="breadcrumb-item text-muted">Bulletin</li>
              </ol>

              <el-row>
                <!-- bulletin Options -->
                <el-col :span="8">
                  <el-form-item label="Bulletin">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager.bulletin === 'v'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'bulletin', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager.bulletin === 'h'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'bulletin', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager.bulletin === 'd'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'bulletin', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- bulletinSpecific Options -->
                <el-col :span="8">
                  <el-form-item label="BulletinSpecific">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager.bulletinSpecific === 'v'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'bulletinSpecific',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager.bulletinSpecific === 'h'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'bulletinSpecific',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager.bulletinSpecific === 'd'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'bulletinSpecific',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- bulletinPilote Options -->
                <el-col :span="8">
                  <el-form-item label="BulletinPilote">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager.bulletinPilote === 'v'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'bulletinPilote',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager.bulletinPilote === 'h'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'bulletinPilote',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager.bulletinPilote === 'd'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edManager',
                            'bulletinPilote',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <ol
                class="breadcrumb breadcrumb-line text-muted fs-6 fw-semibold d-flex justify-content-center align-items-center"
              >
                <li class="breadcrumb-item text-muted">Financial Management</li>
              </ol>

              <el-row>
                <!-- avance Options -->
                <el-col :span="8">
                  <el-form-item label="Avance">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="selectedPack.access.edManager.avance === 'v'"
                        @change="
                          handleCheckboxGroup1('edManager', 'avance', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="selectedPack.access.edManager.avance === 'h'"
                        @change="
                          handleCheckboxGroup1('edManager', 'avance', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="selectedPack.access.edManager.avance === 'd'"
                        @change="
                          handleCheckboxGroup1('edManager', 'avance', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- comptabilite Options -->
                <el-col :span="8">
                  <el-form-item label="Comptabilite">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager.comptabilite === 'v'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'comptabilite', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager.comptabilite === 'h'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'comptabilite', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager.comptabilite === 'd'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'comptabilite', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- declaration Options -->
                <el-col :span="8">
                  <el-form-item label="Declaration">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager.declaration === 'v'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'declaration', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager.declaration === 'h'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'declaration', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager.declaration === 'd'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'declaration', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <ol
                class="breadcrumb breadcrumb-line text-muted fs-6 fw-semibold d-flex justify-content-center align-items-center"
              >
                <li class="breadcrumb-item text-muted">Calendar</li>
              </ol>

              <el-row>
                <!-- calender Options -->
                <el-col :span="8">
                  <el-form-item label="Calender">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edManager.calender === 'v'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'calender', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edManager.calender === 'h'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'calender', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edManager.calender === 'd'
                        "
                        @change="
                          handleCheckboxGroup1('edManager', 'calender', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <ol
                class="breadcrumb breadcrumb-line text-muted fs-6 fw-semibold d-flex justify-content-center align-items-center"
              >
                <li class="breadcrumb-item text-muted">Chat</li>
              </ol>

              <el-row>
                <!-- chat Options -->
                <el-col :span="8">
                  <el-form-item label="Chat">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="selectedPack.access.edManager.chat === 'v'"
                        @change="handleCheckboxGroup1('edManager', 'chat', 'v')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="selectedPack.access.edManager.chat === 'h'"
                        @change="handleCheckboxGroup1('edManager', 'chat', 'h')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="selectedPack.access.edManager.chat === 'd'"
                        @change="handleCheckboxGroup1('edManager', 'chat', 'd')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- ptchat Options -->
                <el-col :span="8">
                  <el-form-item label="Ptchat">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="selectedPack.access.edManager.ptchat === 'v'"
                        @change="
                          handleCheckboxGroup1('edManager', 'ptchat', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="selectedPack.access.edManager.ptchat === 'h'"
                        @change="
                          handleCheckboxGroup1('edManager', 'ptchat', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="selectedPack.access.edManager.ptchat === 'd'"
                        @change="
                          handleCheckboxGroup1('edManager', 'ptchat', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <ol
                class="breadcrumb breadcrumb-line text-muted fs-6 fw-semibold d-flex justify-content-center align-items-center"
              >
                <li class="breadcrumb-item text-muted">Allowed Export Btns</li>
              </ol>
              <div class="permissions-tree">
                
                <el-tree
                :data="treeData"
                :props="treeProps"
                node-key="key"
                show-checkbox
                default-expand-all
                v-model:checked-keys="checkedKeys"
                @check="handleCheck1"
            ></el-tree>
            
              </div>
             
              

              <!-- Parent Access Settings -->
              <div class="separator separator-content my-15">EdParent</div>
              <div class="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="active"
                  v-model="selectedPack.access.edParent.active"
                />
                <label class="form-check-label" for="active">Active</label>
              </div>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="SMS">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="selectedPack.access.edParent.sms === 'v'"
                        @change="handleCheckboxGroup1('edParent', 'sms', 'v')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="selectedPack.access.edParent.sms === 'h'"
                        @change="handleCheckboxGroup1('edParent', 'sms', 'h')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="selectedPack.access.edParent.sms === 'd'"
                        @change="handleCheckboxGroup1('edParent', 'sms', 'd')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- Liste_reglement Options for EdParent -->
                <el-col :span="8">
                  <el-form-item label="Liste_reglement">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edParent.liste_reglement === 'v'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edParent',
                            'liste_reglement',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edParent.liste_reglement === 'h'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edParent',
                            'liste_reglement',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edParent.liste_reglement === 'd'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edParent',
                            'liste_reglement',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- Learning Access Settings -->
              <div class="separator separator-content my-15">EdLearning</div>
              <div class="form-check form-switch mb-3">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="active"
                  v-model="selectedPack.access.edLearning.active"
                />
                <label class="form-check-label" for="active">Active</label>
              </div>
              <el-row>
                <!-- SMS Options for EdLearning -->
                <el-col :span="8">
                  <el-form-item label="SMS">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="selectedPack.access.edLearning.sms === 'v'"
                        @change="handleCheckboxGroup1('edLearning', 'sms', 'v')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="selectedPack.access.edLearning.sms === 'h'"
                        @change="handleCheckboxGroup1('edLearning', 'sms', 'h')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="selectedPack.access.edLearning.sms === 'd'"
                        @change="handleCheckboxGroup1('edLearning', 'sms', 'd')"
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- Sghartoon Options for EdLearning -->
                <el-col :span="8">
                  <el-form-item label="Sghartoon">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edLearning.sghartoon === 'v'
                        "
                        @change="
                          handleCheckboxGroup1('edLearning', 'sghartoon', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edLearning.sghartoon === 'h'
                        "
                        @change="
                          handleCheckboxGroup1('edLearning', 'sghartoon', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edLearning.sghartoon === 'd'
                        "
                        @change="
                          handleCheckboxGroup1('edLearning', 'sghartoon', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- teacherAvailability Options for EdLearning -->
                <el-col :span="8">
                  <el-form-item label="TeacherAvailability">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edLearning.teacherAvailability ===
                          'v'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edLearning',
                            'teacherAvailability',
                            'v'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edLearning.teacherAvailability ===
                          'h'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edLearning',
                            'teacherAvailability',
                            'h'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edLearning.teacherAvailability ===
                          'd'
                        "
                        @change="
                          handleCheckboxGroup1(
                            'edLearning',
                            'teacherAvailability',
                            'd'
                          )
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8"></el-col>
                <el-col :span="8">
                  <el-form-item label="advisor">
                    <div
                      class="form-check form-check-custom form-check-success form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="v"
                        :checked="
                          selectedPack.access.edLearning.advisor === 'v'
                        "
                        @change="
                          handleCheckboxGroup1('edLearning', 'advisor', 'v')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-danger form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="h"
                        :checked="
                          selectedPack.access.edLearning.advisor === 'h'
                        "
                        @change="
                          handleCheckboxGroup1('edLearning', 'advisor', 'h')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                    <div
                      class="form-check form-check-custom form-check-warning form-check-solid form-check-sm"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value="d"
                        :checked="
                          selectedPack.access.edLearning.advisor === 'd'
                        "
                        @change="
                          handleCheckboxGroup1('edLearning', 'advisor', 'd')
                        "
                      />
                      <label class="form-check-label"></label>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- Submit Button -->
              <el-form-item>
                <el-button type="primary" native-type="submit" :loading="loading"
                  >Modify Pack</el-button
                >
                <el-button type="default" @click="discardChange">Discard</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";

import ApiService from "@/core/services/ApiService";

import { Check, Delete, Edit, View, Close, } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";


const edmin_base_url = "http://localhost:8888/api/edmin";
export default defineComponent({
  name: "Packs",
  components: {
    Datatable,
    View,
    Check,
    Delete,
    Edit,
  },
  setup() {
    ApiService.setDB('Root');
    const tableData = ref<any[]>([]);
    const originalTableData = ref([]);
    const error = ref<string | null>(null);
    const loading = ref(false);
    const tableHeader = ref([
      { columnName: "Name", columnLabel: "name", width: "20%" },
      {
        columnName: "Student Limit",
        columnLabel: "studentLimit",
        width: "15%",
      },
      { columnName: "User Limit", columnLabel: "userLimit", width: "15%" },
      { columnName: "Status", columnLabel: "status", width: "10%" },
      { columnName: "Description", columnLabel: "description", width: "15%" },
      { columnName: "Actions", columnLabel: "view", width: "15%" },
    ]);
    const fetchPacks = async () => {
      try {
        ApiService.post(
          "/packs/filter",
          {
            query: {},
          },
          edmin_base_url
        ).then(({ data }) => {
          console.log(data);
          allTableData.value = data;
          updateFilteredTableData();
        });
      } catch (error) {
        console.error("Error fetching packs:", error);
        error.value = "Failed to fetch packs.";
      }
    };
    const selectedPack = ref<any>({
      name: "",
      description: "",
      studentLimit: 0,
      userLimit: 0,
      access: {
        edManager: {
          active: true,
          // Communication
          cantine: "",
          emplois: "",
          news: "",
          sms: "",
          // Smart Features
          smartSchedule: "",
          bulletinStatistique: "",
          statstiqueGeneral: "",
          // Parametrage
          parametrageEtablissement: "",
          parametrageComptabilite: "",
          parametrageScolarite: "",
          // Administration
          adminstration: "",
          // Student Management
          studentList: "",
          actiites: "",
          scolarite: "",
          attendance: "",
          punishments: "",
          teacherAailability: "",
          personnel: "",
          // Bulletin
          bulletin: "",
          bulletinSpecific: "",
          bulletinPilote: "",
          // Financial Management
          avance: "",
          comptabilite: "",
          declaration: "",
          // Calendar
          calender: "",
          // Chat
          chat: "",
          ptchat: "",
   allowedExportBtns: ref<string[]>([]),
        },
        edParent: {
          active: true,
          sms: "",
          liste_reglement: "",
          // Other default values
        },
        edLearning: {
          active: true,
          advisor: "",
          sms: "",
          sghartoon: "",
          teacherAvailability: "",
          // Other default values
        },
      },
    });
    const updatePack = async () => {
  const { _id, __v, updatedAt, createdAt, ...updateData } = selectedPack.value;
  console.log('updated', updateData);
  loading.value = true; 

  try {
    await ApiService.patch(`/packs/${selectedPack.value._id}`, updateData, edmin_base_url)
      .then(({ data }) => {
        console.log("Pack updated successfully", data);

        const modifyPackModal = document.getElementById("kt_modal_modify_pack");
        if (modifyPackModal) {
          modifyPackModal.classList.remove("show");
          modifyPackModal.style.display = "none";
        }

        ElMessage.success("Pack updated successfully");
        fetchPacks();
      })
      .catch((error) => {
        console.error("Error updating Pack", error);
        ElMessage.error("Failed to update Pack. Please try again.");
      });
  } catch (error) {
    console.error("Error updating Pack", error);
    ElMessage.error("Failed to update Pack. Please try again.");
  } finally {
    loading.value = false; 
  }
};

    const modifyPack = (Pack) => {
   
      selectedPack.value = { ...Pack };

      
      const modifyPackModal = document.getElementById("kt_modal_modify_pack");
      if (modifyPackModal) {
        modifyPackModal.classList.add("show");
        modifyPackModal.style.display = "block";
      }
    };
 const checkedKeys = ref<string[]>([]);

   
    const permissions = {
  addStudent: "Ajouter un élève",
  prBadge: "Imprimer les badges",
  prBadgePhoto: "Imprimer les badges avec photo",
  prStudentList: "Imprimer le tableau",
  avance: "Avance",
  paymentStatus: "Status de paiement",
  EdLearning: "EdLearning card",
  pEtatDesRecettes: "Etat Des Recettes",
  pEtatDesRecettesCSV: "Etat Des Recettes CSV"
};

const treeData = ref([
  {
    key: 'permissions',
    label: 'Permissions',
    children: Object.entries(permissions).map(([key, label]) => ({
      key,
      label
    }))
  }
]);

const treeProps = {
  label: 'label',
  children: 'children',
  isLeaf: (data) => !data.children
};

const handleCheck = (checked, { checkedNodes, checkedKeys }) => {
    console.log('Checked event:', checked);
    console.log('Checked Nodes:', checkedNodes);
    console.log('Checked Keys:', checkedKeys);

    if (checkedKeys && Array.isArray(checkedKeys)) {
        formData.value.access.edManager.allowedExportBtns = checkedKeys;
        console.log('Updated formData:', formData.value);
    } else {
        console.warn('No checked keys found.');
    }
};
const handleCheck1 = (checked, { checkedNodes, checkedKeys }) => {
    console.log('Checked event:', checked);
    console.log('Checked Nodes:', checkedNodes);
    console.log('Checked Keys:', checkedKeys);

    if (checkedKeys && Array.isArray(checkedKeys)) {
        selectedPack.value.access.edManager.allowedExportBtns = checkedKeys;
        console.log('Updated selectedPack:', selectedPack.value);
    } else {
        console.warn('No checked keys found.');
    }
};




    onMounted(async () => {
      await fetchPacks();
    });

    const formData = ref({
      name: "",
      description: "",
      studentLimit: 0,
      userLimit: 0,
      status:"active",
      access: {
        edManager: {
          active: true,
          // Communication
          cantine: "v",
          emplois: "v",
          news: "v",
          sms: "v",
          // Smart Features
          smartSchedule: "v",
          avance: "v",
          bulletinStatistique: "v",
          statstiqueGeneral: "v",
          // Parametrage
          parametrageEtablissement: "v",
          parametrageComptabilite: "v",
          parametrageScolarite: "v",
          // Administration
          adminstration: "v",
          // Student Management
          studentList: "v",
          activites: "v",
          scolarite: "v",
          attendance: "v",
          punishments: "v",
          teacherAvailability: "v",
          personnel: "v",
          // Bulletin
          bulletin: "v",
          bulletinSpecific: "v",
          bulletinPilote: "v",
          // Financial Management
          avance: "v",
          comptabilite: "v",
          declaration: "v",
          // Calendar
          calender: "v",
          // Chat
          chat: "v",
          ptchat: "v",
         allowedExportBtns: ref<string[]>([]),
        },
        edParent: {
          active: true,
          sms: "d",
          liste_reglement: "d",
          // Other default values
        },
        edLearning: {
          active: true,
          advisor: "d",
          sms: "d",
          sghartoon: "d",
          teacherAvailability: "v",
          // Other default values
        },
        // Add edParent and edLearning sections similarly
      },
    });
 
    const rules = {
      packName: [
        { required: true, message: "Pack Name is required", trigger: "blur" },
      ],
      description: [
        { required: true, message: "description is required", trigger: "blur" },
      ],
      studentLimit: [
        {
          required: true,
          message: "Student limit is required",
          trigger: "blur",
        },
      ],
      userLimit: [
        { required: true, message: "User limit is required", trigger: "blur" },
      ],
    };

    const addPack = (e) => {
  e.preventDefault();

  loading.value = true; 

  ApiService.put(`/packs/`, formData.value, edmin_base_url)
    .then(({ data }) => {
      console.log('Checked Keys:', checkedKeys);
      console.log("data before sending", formData.value);

      ElMessage.success({
        message: "Pack created successfully!",
        type: "success",
      });

      fetchPacks();
      clearForm();

      setTimeout(() => {
        dialogAddVisible.value = false;
      }, 1000);

    })
    .catch(error => {
      console.error("Error adding pack:", error);

      ElMessage.error({
        message: "Error adding pack. Please try again.",
        type: "error",
      });

    })
    .finally(() => {
      loading.value = false; 
    });
};




    const handleCheckboxGroup = (accessKey, groupKey, selectedValue) => {
      
      formData.value.access[accessKey][groupKey] = selectedValue;
    };
    const handleCheckboxGroup1 = (accessKey, groupKey, selectedValue) => {
      
      selectedPack.value.access[accessKey][groupKey] = selectedValue;
    };

    const clearForm = () => {
      formData.value = {
        name: "",
      description: "",
      studentLimit: 0,
      userLimit: 0,
      status:"active",
      access: {
        edManager: {
          active: true,
          // Communication
          cantine: "v",
          emplois: "v",
          news: "v",
          sms: "v",
          // Smart Features
          smartSchedule: "v",
          avance: "v",
          bulletinStatistique: "v",
          statstiqueGeneral: "v",
          // Parametrage
          parametrageEtablissement: "v",
          parametrageComptabilite: "v",
          parametrageScolarite: "v",
          // Administration
          adminstration: "v",
          // Student Management
          studentList: "v",
          activites: "v",
          scolarite: "v",
          attendance: "v",
          punishments: "v",
          teacherAvailability: "v",
          personnel: "v",
          // Bulletin
          bulletin: "v",
          bulletinSpecific: "v",
          bulletinPilote: "v",
          // Financial Management
          avance: "v",
          comptabilite: "v",
          declaration: "v",
          // Calendar
          calender: "v",
          // Chat
          chat: "v",
          ptchat: "v",
         allowedExportBtns: ref<string[]>([]),
        },
        edParent: {
          active: true,
          sms: "d",
          liste_reglement: "d",
          // Other default values
        },
        edLearning: {
          active: true,
          advisor: "d",
          sms: "d",
          sghartoon: "d",
          teacherAvailability: "v",
          // Other default values
        },
   
      },
      };
    };
 

    const allTableData = ref([]); 
    
    const search = ref("");

    const updateFilteredTableData = () => {
        tableData.value = search.value
            ? allTableData.value.filter(user =>
                user.name.toLowerCase().includes(search.value.toLowerCase())
            )
            : [...allTableData.value];
    };


    const searchPacks = () => {
      updateFilteredTableData();
    };

    const resetSearch = () => {
      search.value = "";
      updateFilteredTableData();
    };


     
  

    
 




    const togglepackStatus = async (pack) => {
  try {
  

    ApiService.setDB("Root");
    const newStatus = pack.status === "active" ? "inactive" : "active";
    

     const { _id, __v, updatedAt, createdAt, ...packData } = pack;

     const data = {
        ...packData, 
            status: newStatus, 
              };
    ApiService.patch(
      `/packs/${pack._id}`,
        data ,  edmin_base_url
    )
      .then((response) => {
        console.log(response); 
        fetchPacks(); 
        const action = newStatus === "active" ? "activated" : "deactivated";
        ElMessage.success(`pack "${pack.name}" has been ${action} successfully.`);
      })
      .catch((error) => {
        console.error("Error updating Pack status", error);
        ElMessage.error("Failed to update Pack status. Please try again.");
      });
  } catch (error) {
    console.error("Error updating Pack status", error);
    ElMessage.error("Failed to update Pack status. Please try again.");
  }
};
    const discardChanges = () => {
      

      dialogAddVisible.value = false;
    
    };
    const discardChange = () => {

  selectedPack.value = {};
  
  const modalElement = document.getElementById("kt_modal_modify_pack");
  if (modalElement) {
    modalElement.classList.remove("show");
    modalElement.style.display = "none";
  }
};
    const dialogAddVisible = ref(false);
    const dialogEditVisible = ref(false);
    return {
      tableHeader,
      tableData,
      formData,
      addPack,
      loading,
      handleCheckboxGroup,
      rules,
     handleCheck,
     treeProps,
     treeData,
     permissions,
      fetchPacks,
      discardChange,
      togglepackStatus,
      modifyPack,
      handleCheckboxGroup1,
      resetSearch,
      searchPacks,
      allTableData,
      search,
      updatePack,
      selectedPack,
      Check,
      Delete,
      Edit,
      View,
      Close,
      dialogAddVisible,
      dialogEditVisible,
      discardChanges,
      checkedKeys,
      handleCheck1,
    };
  },
});
</script>
