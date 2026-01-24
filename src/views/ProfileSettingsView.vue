<template>
  <div class="min-h-screen w-full overflow-x-hidden">
    <div class="max-w-[1440px] mx-auto">
      <div class="flex w-full gap-8">
        <!-- Side Navigation -->
        <div class="px-6 lg:px-20">
          <DashboardSidebar />
        </div>

        <!-- Content Area -->
        <main class="flex-1 flex flex-col overflow-y-auto px-6 py-10">
          <!-- Profile Header Card -->
          <ProfileHeaderCard :user="user" @edit-photo="handleEditPhoto" @change-photo="handleChangePhoto" />

          <!-- Personal Information Section -->
          <PersonalInformationSection v-model:form-data="formData" />

          <div class="h-px bg-slate-200 dark:bg-slate-800 w-full my-8"></div>

          <!-- Contact Details Section -->
          <ContactDetailsSection v-model:form-data="formData" :is-email-verified="isEmailVerified" />

          <div class="h-px bg-slate-200 dark:bg-slate-800 w-full my-8"></div>

          <!-- Shopping Preferences Section -->
          <ShoppingPreferencesSection v-model:form-data="formData" />

          <!-- Footer Actions -->
          <div class="flex items-center justify-end gap-4 py-6 mt-8">
            <button
              class="px-8 py-3 rounded-full text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
              type="button"
              @click="handleDiscard"
            >
              {{ $t('profileSettings.discardChanges') }}
            </button>
            <button
              class="px-10 py-3 rounded-full bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/90 transition-all"
              type="button"
              @click="handleSave"
            >
              {{ $t('profileSettings.saveChanges') }}
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePageLoading } from '@/composables/usePageLoading'
import { useI18n } from 'vue-i18n'
import DashboardSidebar from '../components/features/dashboard/DashboardSidebar.vue'
import ProfileHeaderCard from '../components/features/dashboard/ProfileHeaderCard.vue'
import PersonalInformationSection from '../components/features/dashboard/PersonalInformationSection.vue'
import ContactDetailsSection from '../components/features/dashboard/ContactDetailsSection.vue'
import ShoppingPreferencesSection from '../components/features/dashboard/ShoppingPreferencesSection.vue'

const { setLoading } = usePageLoading()
const { t } = useI18n()

const isEmailVerified = ref(true)

const user = ref({
  name: 'John Doe',
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuApIuvRgDCuwN5sddFt7E4IpupM_N8UysnCWpnKKXMTrdlf2CGvrvKYXcvHiJ76OXXRyeRP8LZGkWAzqKpoEWZfXJWLK1rmIjxZSWBWmR_3I-1Jdo5YTEOiVV-MG88mNy_pqsuLfnZbbIY0aPxoEt7LyDB3V9Y5o0zaRQ_nD1FMu5x4s5sarqQLcZd5pN0I3tt3QovwkuSQAEcdC0wQcJhgin_FVjUkC4xVaKB2q25vwqAGJA72InCRdOS801ZtINVev9C1IHcmp5Sq',
  memberSince: 'Oct 2023',
})

const initialFormData = {
  fullName: 'John Doe',
  dateOfBirth: '1990-05-15',
  gender: 'male',
  email: 'john.doe@example.com',
  phone: '+1 (555) 000-0000',
  preferredFrameStyle: 'round',
  marketingNewsletter: true,
  prescriptionReminders: true,
}

const formData = ref({ ...initialFormData })

onMounted(async () => {
  setLoading(true)
  // Simulate loading data
  await new Promise((resolve) => setTimeout(resolve, 300))
  setLoading(false)
})

const handleEditPhoto = () => {
  console.log('Edit photo clicked')
  // Handle edit photo logic
}

const handleChangePhoto = () => {
  console.log('Change photo clicked')
  // Handle change photo logic
}

const handleDiscard = () => {
  formData.value = { ...initialFormData }
  console.log('Discard changes')
}

const handleSave = () => {
  console.log('Save changes', formData.value)
  // Handle save logic
}
</script>
