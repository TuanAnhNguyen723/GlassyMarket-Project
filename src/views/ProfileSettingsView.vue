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
          <ProfileHeaderCard
            :user="user"
            :editable="true"
            @edit-photo="handleEditPhoto"
            @change-photo="handleChangePhoto"
          />

          <!-- Hidden file input for avatar -->
          <input
            ref="avatarInputRef"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            class="hidden"
            @change="onAvatarFileSelected"
          />

          <!-- Personal Information Section -->
          <PersonalInformationSection v-model:form-data="formData" />

          <div class="h-px bg-slate-200 dark:bg-slate-800 w-full my-8"></div>

          <!-- Contact Details Section -->
          <ContactDetailsSection v-model:form-data="formData" />

          <div class="h-px bg-slate-200 dark:bg-slate-800 w-full my-8"></div>

          <!-- Shopping Preferences Section -->
          <ShoppingPreferencesSection v-model:form-data="formData" />

          <!-- Footer Actions -->
          <div class="flex items-center justify-end gap-4 py-6 mt-8">
            <button
              class="px-8 py-3 rounded-full text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
              type="button"
              :disabled="isSaving"
              @click="handleDiscard"
            >
              {{ $t('profileSettings.discardChanges') }}
            </button>
            <button
              class="px-10 py-3 rounded-full bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/90 transition-all disabled:opacity-60"
              type="button"
              :disabled="isSaving"
              @click="handleSave"
            >
              {{ isSaving ? $t('common.loading') : $t('profileSettings.saveChanges') }}
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
import { getProfile, updateProfile, uploadAvatar, extractAvatarUrl } from '@/services/profileService'
import { useAuth } from '@/composables/useAuth'
import { get, invalidateProfile, CACHE_KEYS } from '@/utils/cache'
import { useNotification } from '@/composables/useNotification'

const { setLoading } = usePageLoading()
const { t } = useI18n()
const { user: authUser, setUser } = useAuth()
const { showNotification } = useNotification()

const avatarInputRef = ref(null)
const isSaving = ref(false)
const isUploadingAvatar = ref(false)

const user = ref({
  name: '',
  email: '',
  avatar: '',
})

const defaultFormData = () => ({
  fullName: '',
  dateOfBirth: '',
  gender: 'male',
  email: '',
  phone: '',
  preferredFrameStyle: 'round',
  marketingNewsletter: true,
  prescriptionReminders: true,
})

const formData = ref(defaultFormData())
const initialFormDataSnapshot = ref(null)

function syncFormFromProfile(profile) {
  const data = profile?.data ?? profile?.user ?? profile
  if (!data) return

  const name = data?.name ?? ''
  const email = data?.email ?? ''
  const phone = data?.phone ?? ''
  const dateRaw = data?.date_of_birth ?? data?.dateOfBirth ?? ''
  const dateOfBirth = dateRaw ? String(dateRaw).slice(0, 10) : ''
  const gender = data?.gender ?? 'male'
  const avatarResolved = extractAvatarUrl(data) || extractAvatarUrl(profile)

  user.value = {
    name,
    email,
    avatar: avatarResolved,
  }

  formData.value = {
    fullName: name,
    dateOfBirth,
    gender: gender || 'male',
    email,
    phone: phone || '',
    preferredFrameStyle: data?.preferred_frame_style ?? 'round',
    marketingNewsletter: !!data?.marketing_newsletter,
    prescriptionReminders: !!data?.prescription_reminders,
  }
  initialFormDataSnapshot.value = JSON.stringify(formData.value)
}

async function loadProfile() {
  // Dùng cache trước - chuyển tab không cần gọi API lại
  const cached = get(CACHE_KEYS.PROFILE)
  if (cached && typeof cached === 'object') {
    syncFormFromProfile(cached)
    return
  }

  setLoading(true)
  try {
    const auth = authUser.value
    if (auth) {
      user.value = { name: auth.name, email: auth.email, avatar: auth.avatar ?? '' }
      formData.value = {
        fullName: auth.name ?? '',
        dateOfBirth: auth.date_of_birth ? String(auth.date_of_birth).slice(0, 10) : '',
        gender: auth.gender ?? 'male',
        email: auth.email ?? '',
        phone: auth.phone ?? '',
        preferredFrameStyle: auth.preferred_frame_style ?? 'round',
        marketingNewsletter: !!auth.marketing_newsletter,
        prescriptionReminders: !!auth.prescription_reminders,
      }
      initialFormDataSnapshot.value = JSON.stringify(formData.value)
    }

    const res = await getProfile()
    const data = res?.data ?? res
    if (data) syncFormFromProfile(data)
  } catch {
    showNotification({
      message: t('profileSettings.errorLoadProfile', 'Không thể tải thông tin hồ sơ'),
      type: 'error',
      duration: 3000,
    })
  } finally {
    setLoading(false)
  }
}

function handleEditPhoto() {
  avatarInputRef.value?.click()
}

function handleChangePhoto() {
  avatarInputRef.value?.click()
}

async function onAvatarFileSelected(event) {
  const file = event.target?.files?.[0]
  if (!file || !(file instanceof File)) return

  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    showNotification({
      message: t('profileSettings.avatarTooLarge', 'Ảnh tối đa 5MB'),
      type: 'error',
      duration: 3000,
    })
    event.target.value = ''
    return
  }

  isUploadingAvatar.value = true
  try {
    const res = await uploadAvatar(file)
    const avatarUrl = res?.avatar ?? extractAvatarUrl(res)
    if (avatarUrl) {
      user.value = { ...user.value, avatar: avatarUrl }
      invalidateProfile()
      const updated = { ...authUser.value, avatar: avatarUrl }
      setUser(updated, null)
      showNotification({
        message: t('profileSettings.avatarUpdated', 'Đã cập nhật ảnh đại diện'),
        type: 'success',
        duration: 3000,
      })
    } else {
      showNotification({
        message: t('profileSettings.errorUploadAvatar', 'Backend không trả URL ảnh'),
        type: 'error',
        duration: 3000,
      })
    }
  } catch (err) {
    showNotification({
      message: err?.message ?? t('profileSettings.errorUploadAvatar', 'Không thể tải ảnh lên'),
      type: 'error',
      duration: 4000,
    })
  } finally {
    isUploadingAvatar.value = false
    event.target.value = ''
  }
}

function handleDiscard() {
  if (initialFormDataSnapshot.value) {
    formData.value = JSON.parse(initialFormDataSnapshot.value)
  }
  showNotification({
    message: t('profileSettings.changesDiscarded', 'Đã hủy thay đổi'),
    type: 'info',
    duration: 2000,
  })
}

async function handleSave() {
  if (isSaving.value) return

  isSaving.value = true
  try {
    const payload = {
      name: formData.value.fullName?.trim() ?? '',
      phone: (formData.value.phone ?? '').trim() || null,
      date_of_birth: (formData.value.dateOfBirth ?? '').trim() || null,
      gender: formData.value.gender || null,
    }
    await updateProfile(payload)

    invalidateProfile()
    const updated = {
      ...authUser.value,
      name: payload.name || authUser.value?.name,
      phone: payload.phone ?? authUser.value?.phone,
      date_of_birth: payload.date_of_birth ?? authUser.value?.date_of_birth,
      gender: payload.gender ?? authUser.value?.gender,
    }
    setUser(updated, null)
    user.value = { ...user.value, name: payload.name || user.value.name }

    // Refetch để đồng bộ với response từ server (avatar, format ngày...)
    const res = await getProfile()
    const data = res?.data ?? res?.user ?? res
    if (data) syncFormFromProfile(data)
    else initialFormDataSnapshot.value = JSON.stringify(formData.value)

    showNotification({
      message: t('profileSettings.profileUpdated', 'Đã lưu thông tin'),
      type: 'success',
      duration: 3000,
    })
  } catch (err) {
    showNotification({
      message: err?.message ?? t('profileSettings.errorSaveProfile', 'Không thể lưu thông tin'),
      type: 'error',
      duration: 4000,
    })
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>
