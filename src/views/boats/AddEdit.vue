<script setup>
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useBoatsStore, useAlertStore } from '@/stores';
import { router } from '@/router';

const boatsStore = useBoatsStore();
const alertStore = useAlertStore();
const route = useRoute();
const id = route.params.id;
const hideButtons = route.query.hideButtons === 'true';

let title = 'Add Boat';
let boat = null;

if (id) {
    // edit mode
    title = 'Edit Boat';
    ({ boat } = storeToRefs(boatsStore));
    boatsStore.getById(id); 
}

const boatSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required'),

  description: Yup.string()
    .nullable(),

  capacity: Yup.number()
    .positive('Capacity must be positive')
    .integer('Capacity must be an integer')
    .required('Capacity is required'),

  size: Yup.number().positive('Size must be positive')
    .integer('Size must be an integer')
    .required('Size is required'),

  type: Yup.string()
    .required('Type is required'),

  createdAt: Yup.date()
    .notRequired(), // managed by backend

  updatedAt: Yup.date()
    .notRequired()  // managed by backend
});

async function onSubmit(values) {
    try {
        let message;
        if (boat) {
            await boatsStore.update(boat.value.id, values)
            message = 'Boat updated';
        } else {
            await boatsStore.register(values);
            message = 'Boat added';
        }
        await router.push('/boats');
        alertStore.success(message);
    } catch (error) {
        alertStore.error(error);
    }
}
</script>

<template>
  <div class="card m-3">
    <h4 class="card-header">{{ hideButtons ? 'Boat Info' : (id ? 'Boat Edit' : 'Boat Add') }}</h4>
    <div class="card-body">
      <Form @submit="onSubmit" :validation-schema="boatSchema" :initial-values="boat" v-slot="{ errors, isSubmitting }">
        
        <div class="form-group">
          <label>Name</label>
          <Field
            name="name"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.name }"
            :readonly="hideButtons"
          />
          <div class="invalid-feedback">{{ errors.name }}</div>
        </div>

        <div class="form-group">
          <label>Description</label>
          <Field
            name="description"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.description }"
            :readonly="hideButtons"
          />
          <div class="invalid-feedback">{{ errors.description }}</div>
        </div>

        <div class="form-group">
          <label>Capacity</label>
          <Field
            name="capacity"
            type="number"
            class="form-control"
            :class="{ 'is-invalid': errors.capacity }"
            :readonly="hideButtons"
          />
          <div class="invalid-feedback">{{ errors.capacity }}</div>
        </div>

        <div class="form-group">
          <label>Size</label>
          <Field
            name="size"
            type="number"
            class="form-control"
            :class="{ 'is-invalid': errors.size }"
            :readonly="hideButtons"
          />
          <div class="invalid-feedback">{{ errors.size }}</div>
        </div>

        <div class="form-group">
          <label>Type</label>
          <Field
            v-if="!hideButtons"
            name="type"
            as="select"
            class="form-control"
            :class="{ 'is-invalid': errors.type }"
          >
            <option value="" disabled>Select a type</option>
            <option value="SAILBOAT">SAILBOAT</option>
            <option value="MOTORBOAT">MOTORBOAT</option>
            <option value="YACHT">YACHT</option>
            <option value="CATAMARAN">CATAMARAN</option>
            <option value="FERRY">FERRY</option>
            <option value="OTHER">OTHER</option>
          </Field>
        <div v-else>
            <input
            type="text"
            class="form-control"
            :value="boat?.type || ''"
            readonly
            />
        </div>

          <div class="invalid-feedback">{{ errors.type }}</div>
        </div>

        <div class="form-group"  v-if="!hideButtons">
          <button class="btn btn-primary" :disabled="isSubmitting">
            <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
            Submit
          </button>
          <router-link to="/" class="btn btn-link">Cancel</router-link>
        </div>
        <div v-else>
            <router-link to="/" class="btn btn-secondary">Back to Menu</router-link>
        </div>
      </Form>
    </div>
  </div>
    <template v-if="boat?.loading">
        <div class="text-center m-5">
            <span class="spinner-border spinner-border-lg align-center"></span>
        </div>
    </template>
    <template v-if="boat?.error">
        <div class="text-center m-5">
            <div class="text-danger">Error loading boat: {{boat.error}}</div>
        </div>
    </template>
</template>
