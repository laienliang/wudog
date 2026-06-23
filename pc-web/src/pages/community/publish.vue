<template>
  <div class="publish-page">
    <div class="container">
      <NuxtLink to="/community/feed" class="back-link">返回游记社区</NuxtLink>
      <section class="publish-card">
        <div class="publish-head">
          <span class="eyebrow">发布游记</span>
          <h1>记录你的乌东之旅</h1>
          <p>分享风景、美食、民宿和非遗体验，让更多人看见苗寨生活。</p>
        </div>
        <div class="form-grid">
          <label class="field field-title">
            <span>游记标题</span>
            <input v-model="title" type="text" placeholder="例如：乌东苗寨的清晨" />
          </label>

          <div class="field">
            <span>封面图片</span>
            <el-upload
              class="cover-upload"
              accept="image/*"
              :show-file-list="false"
              :http-request="uploadCover"
              :before-upload="beforeCoverUpload"
              :disabled="uploading"
            >
              <div class="cover-uploader" :class="{ 'is-uploading': uploading, 'has-cover': !!cover }">
                <img v-if="cover" class="cover-preview" :src="cover" alt="游记封面" />
                <div v-else class="cover-placeholder">
                  <span class="upload-mark">+</span>
                  <strong>{{ uploading ? '上传中' : '上传封面' }}</strong>
                  <small>JPG / PNG / WebP，建议横图</small>
                </div>
              </div>
            </el-upload>
            <div v-if="cover" class="cover-actions">
              <span class="cover-url">{{ cover }}</span>
              <button type="button" class="text-btn" @click="removeCover">移除</button>
            </div>
          </div>

          <label class="field">
            <span>旅行故事</span>
            <textarea v-model="content" placeholder="写下你的旅行故事"></textarea>
          </label>

          <button class="btn btn-primary" type="button" :disabled="uploading" @click="publish">发布</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import type { UploadRequestOptions } from 'element-plus';

const title = ref('');
const cover = ref('');
const content = ref('');
const uploading = ref(false);
const config = useRuntimeConfig();

const uploadUrl = computed(() => {
  const clientBase = (config.public.apiBase as string) || 'http://localhost:8001/open/client';
  return clientBase.replace(/\/open\/client\/?$/, '/app/base/comm/upload');
});

function beforeCoverUpload(file: File) {
  const isImage = file.type.startsWith('image/');
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isImage) {
    ElMessage.warning('请选择图片文件');
    return false;
  }

  if (!isLt5M) {
    ElMessage.warning('图片大小不能超过 5MB');
    return false;
  }

  return true;
}

async function uploadCover(options: UploadRequestOptions) {
  const formData = new FormData();
  formData.append('file', options.file);
  uploading.value = true;

  try {
    const res = await $fetch<{ code?: number; data?: string; message?: string }>(uploadUrl.value, {
      method: 'POST',
      body: formData,
    });

    if ((res.code === 1000 || res.code === 0 || res.code === undefined) && res.data) {
      cover.value = res.data;
      options.onSuccess?.(res);
      ElMessage.success('封面上传成功');
      return;
    }

    throw new Error(res.message || '上传失败');
  } catch (err) {
    const message = err instanceof Error ? err.message : '上传失败';
    options.onError?.(err as Error);
    ElMessage.error(message);
  } finally {
    uploading.value = false;
  }
}

function removeCover() {
  cover.value = '';
}

function publish() {
  if (!title.value.trim() || !content.value.trim()) {
    ElMessage.warning('请填写标题和正文');
    return;
  }
  ElMessage.success('游记已保存为草稿，后续可接入发布接口');
}

useHead({ title: '发布游记 - 乌东文旅' });
</script>

<style lang="scss" scoped>
.publish-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 16% 10%, rgba(31, 95, 168, 0.09), transparent 28%),
    linear-gradient(180deg, #fff 0%, var(--color-bg-secondary) 72%);
  padding: 32px 0 56px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  margin-bottom: 18px;
  color: var(--color-primary);
  font-weight: 600;
}

.back-link::before {
  content: '←';
  margin-right: 8px;
}

.publish-card {
  max-width: 880px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(31, 95, 168, 0.08);
  border-radius: var(--radius-lg);
  padding: 36px;
  box-shadow: var(--shadow-light);
}

.eyebrow {
  color: var(--color-primary);
  font-weight: 700;
}

h1 {
  font-size: 32px;
  margin: 10px 0;
}

.publish-head p {
  color: var(--color-text-secondary);
}

.form-grid {
  display: grid;
  gap: 18px;
  margin-top: 28px;
}

.field {
  display: grid;
  gap: 8px;
}

.field > span {
  color: var(--color-text-primary);
  font-weight: 700;
}

input,
textarea {
  width: 100%;
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  padding: 13px 16px;
  font-size: 14px;
  outline: none;
  background: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

textarea {
  min-height: 220px;
  resize: vertical;
}

input:focus,
textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(31, 95, 168, 0.1);
}

.cover-upload {
  width: 100%;
}

.cover-uploader {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  min-height: 260px;
  border: 1px dashed rgba(31, 95, 168, 0.34);
  border-radius: var(--radius-md);
  background:
    linear-gradient(135deg, rgba(232, 241, 251, 0.82), rgba(255, 241, 234, 0.58)),
    #fff;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.cover-uploader:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-brand);
  transform: translateY(-1px);
}

.cover-uploader.is-uploading {
  cursor: wait;
  opacity: 0.78;
}

.cover-uploader.has-cover {
  border-style: solid;
  background: #0e223a;
}

.cover-preview {
  width: 100%;
  height: 260px;
  object-fit: cover;
}

.cover-placeholder {
  display: grid;
  justify-items: center;
  gap: 6px;
  color: var(--color-primary);
}

.upload-mark {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #fff;
  box-shadow: var(--shadow-light);
  font-size: 30px;
  line-height: 1;
}

.cover-placeholder strong {
  font-size: 16px;
}

.cover-placeholder small {
  color: var(--color-text-tertiary);
}

.cover-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.cover-url {
  flex: 1;
  color: var(--color-text-tertiary);
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-btn {
  border: 0;
  background: transparent;
  color: var(--color-secondary-orange);
  cursor: pointer;
  font-weight: 700;
}

.btn {
  justify-self: start;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

@media (max-width: 640px) {
  .publish-card {
    padding: 24px;
  }

  h1 {
    font-size: 26px;
  }
}
</style>
