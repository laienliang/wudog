<template>
	<div class="page-login">
		<!-- 左侧品牌展示区 -->
		<div class="login-brand">
			<div class="brand-bg-pattern"></div>
			<div class="brand-content">
				<div class="brand-logo-wrap">
					<img src="/logo-wudong-white.png" alt="乌东文旅" class="brand-logo" />
					<h1 class="brand-title">乌东文旅管理平台</h1>
					<p class="brand-subtitle">贵州苗族 · 文化传承 · 数字文旅</p>
				</div>
				<div class="brand-features">
					<div class="feature-item">
						<cl-svg name="goods" :size="20" />
						<span>非遗商品</span>
					</div>
					<div class="feature-item">
						<cl-svg name="shop" :size="20" />
						<span>餐饮美食</span>
					</div>
					<div class="feature-item">
						<cl-svg name="home" :size="20" />
						<span>住宿预订</span>
					</div>
					<div class="feature-item">
						<cl-svg name="route" :size="20" />
						<span>线路订票</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 右侧登录表单区 -->
		<div class="login-box">
			<div class="login-card">
				<div class="login-header">
					<h2 class="login-title">欢迎回来</h2>
					<p class="login-desc">请登录您的管理员账号</p>
				</div>

				<div class="form">
					<el-form label-position="top" class="form" :disabled="saving">
						<el-form-item :label="$t('用户名')">
							<el-input
								v-model="form.username"
								:placeholder="$t('请输入用户名')"
								maxlength="20"
								clearable
							>
								<template #prefix>
									<cl-svg name="user" :size="16" />
								</template>
							</el-input>
						</el-form-item>

						<el-form-item :label="$t('密码')">
							<el-input
								v-model="form.password"
								type="password"
								:placeholder="$t('请输入密码')"
								maxlength="20"
								show-password
								autocomplete="new-password"
								clearable
							>
								<template #prefix>
									<cl-svg name="lock" :size="16" />
								</template>
							</el-input>
						</el-form-item>

						<el-form-item :label="$t('验证码')">
							<el-input
								v-model="form.verifyCode"
								:placeholder="$t('验证码')"
								maxlength="4"
								@keyup.enter="toLogin"
								clearable
							>
								<template #prefix>
									<cl-svg name="eye-close" :size="16" />
								</template>
								<template #suffix>
									<pic-captcha
										:ref="setRefs('picCaptcha')"
										v-model="form.captchaId"
										@change="
											() => {
												form.verifyCode = '';
											}
										"
									/>
								</template>
							</el-input>
						</el-form-item>

						<div class="op">
							<el-button type="primary" :loading="saving" @click="toLogin" class="login-btn">
								{{ $t('登录') }}
							</el-button>
						</div>
					</el-form>
				</div>
			</div>

			<!-- 底部版权 -->
			<div class="login-footer">
				<p>© 2026 乌东文旅 "衣食住行" 综合服务平台</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'login'
});

import { reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useCool } from '/@/cool';
import { useBase } from '/$/base';
import { storage } from '/@/cool/utils';
import { useI18n } from 'vue-i18n';
import PicCaptcha from './components/pic-captcha.vue';

const { refs, setRefs, router, service } = useCool();
const { user, app } = useBase();
const { t } = useI18n();

// 状态
const saving = ref(false);

// 表单数据
const form = reactive({
	username: storage.get('username') || '',
	password: '',
	captchaId: '',
	verifyCode: ''
});

// 演示模式
if (import.meta.env.MODE == 'demo') {
	form.username = 'admin';
	form.password = '123456';
}

// 登录
async function toLogin() {
	if (!form.username) {
		return ElMessage.error(t('用户名不能为空'));
	}

	if (!form.password) {
		return ElMessage.error(t('密码不能为空'));
	}

	if (!form.verifyCode) {
		return ElMessage.error(t('图片验证码不能为空'));
	}

	saving.value = true;

	try {
		// 登录
		await service.base.open.login(form).then(user.setToken);

		// token 事件
		await Promise.all(app.events.hasToken.map(e => e()));

		// 设置缓存
		storage.set('username', form.username);

		// 跳转首页
		router.push('/');
	} catch (err) {
		// 刷新验证码
		refs.picCaptcha.refresh();

		// 提示错误
		ElMessageBox.alert((err as Error).message, {
			title: t('提示'),
			type: 'error'
		});
	}

	saving.value = false;
}
</script>

<style lang="scss" scoped>
// 品牌色
$primary: #1F5FA8;
$primary-dark: #0E3D75;
$primary-light: #E8F1FB;
$secondary-orange: #E85D2F;
$text-primary: #1A1A1A;
$text-secondary: #595959;
$text-tertiary: #8C8C8C;
$border-color: #E5E5E5;
$bg-page: #F7F8FA;

.page-login {
	display: flex;
	justify-content: center;
	align-items: stretch;
	height: 100%;
	width: 100%;
	position: relative;
	background-color: $bg-page;
	font-family: 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif;
	overflow: hidden;

	// ===================== 左侧品牌展示区 =====================
	.login-brand {
		flex: 1;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, $primary 0%, $primary-dark 50%, #164A8A 100%);
		background-size: 200% 200%;
		animation: gradientFlow 12s ease infinite;
		overflow: hidden;

		// 梯田纹样装饰背景
		.brand-bg-pattern {
			position: absolute;
			inset: 0;
			opacity: 0.08;
			background-image:
				repeating-linear-gradient(
					0deg,
					transparent,
					transparent 40px,
					#fff 40px,
					#fff 41px
				),
				repeating-linear-gradient(
					90deg,
					transparent,
					transparent 40px,
					#fff 40px,
					#fff 41px
				);
			background-size: 40px 40px;
		}

		// 苗族蜡染圆形装饰
		&::before {
			content: '';
			position: absolute;
			top: -100px;
			right: -100px;
			width: 400px;
			height: 400px;
			border-radius: 50%;
			border: 2px solid rgba(255, 255, 255, 0.1);
		}

		&::after {
			content: '';
			position: absolute;
			bottom: -80px;
			left: -80px;
			width: 300px;
			height: 300px;
			border-radius: 50%;
			border: 2px solid rgba(255, 255, 255, 0.08);
		}

		.brand-content {
			position: relative;
			z-index: 1;
			text-align: center;
			padding: 40px;
			color: #fff;

			> * {
				opacity: 0;
				animation: brandFadeIn 0.8s ease forwards;
			}

			> *:nth-child(1) { animation-delay: 0.2s; }
			> *:nth-child(2) { animation-delay: 0.4s; }

			@keyframes brandFadeIn {
				from {
					opacity: 0;
					transform: translateY(30px);
				}
				to {
					opacity: 1;
					transform: translateY(0);
				}
			}
		}

		.brand-logo-wrap {
			margin-bottom: 48px;

			.brand-logo {
				height: 100px;
				width: auto;
				margin: 0 auto 28px;
				display: block;
			}

			.brand-title {
				font-size: 42px;
				font-weight: bold;
				letter-spacing: 4px;
				margin: 0 0 12px 0;
				text-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
				color: #fff;
			}

			.brand-subtitle {
				font-size: 16px;
				letter-spacing: 2px;
				opacity: 0.85;
				margin: 0;
				color: #fff;
			}
		}

		.brand-features {
			display: flex;
			gap: 24px;
			justify-content: center;
			flex-wrap: wrap;

			.feature-item {
				display: flex;
				align-items: center;
				gap: 8px;
				padding: 12px 24px;
				background: rgba(255, 255, 255, 0.12);
				border-radius: 12px;
				backdrop-filter: blur(8px);
				font-size: 15px;
				letter-spacing: 1px;
				transition: all 0.3s ease;
				cursor: default;
				border: 1px solid rgba(255, 255, 255, 0.15);

				&:hover {
					background: rgba(255, 255, 255, 0.2);
					transform: translateY(-2px);
				}

				.el-icon {
					font-size: 18px;
					opacity: 0.9;
				}
			}
		}
	}

	// ===================== 右侧登录表单区 =====================
	.login-box {
		width: 520px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
		position: relative;
		z-index: 10;
	}

	.login-card {
		width: 100%;
		max-width: 400px;
		background: #fff;
		border-radius: 16px;
		padding: 48px 40px;
		box-shadow: 0 8px 32px rgba(31, 95, 168, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
		opacity: 0;
		animation: cardFadeIn 0.6s ease 0.3s forwards;

		@keyframes cardFadeIn {
			from {
				opacity: 0;
				transform: translateX(20px);
			}
			to {
				opacity: 1;
				transform: translateX(0);
			}
		}
	}

	.login-header {
		text-align: center;
		margin-bottom: 40px;
		opacity: 0;
		animation: fadeIn 0.5s ease 0.5s forwards;

		@keyframes fadeIn {
			from { opacity: 0; }
			to { opacity: 1; }
		}

		.login-title {
			font-size: 28px;
			font-weight: bold;
			color: $text-primary;
			margin: 0 0 8px 0;
			letter-spacing: 1px;
		}

		.login-desc {
			font-size: 14px;
			color: $text-tertiary;
			margin: 0;
		}
	}

	.form {
		opacity: 0;
		animation: formFadeIn 0.5s ease 0.6s forwards;

		@keyframes formFadeIn {
			from { opacity: 0; transform: translateY(10px); }
			to { opacity: 1; transform: translateY(0); }
		}

		:deep(.el-form) {
			.el-form-item {
				margin-bottom: 24px;
			}

			.el-form-item__label {
				color: $text-secondary;
				font-size: 14px;
				font-weight: 500;
				padding-left: 2px;
				user-select: none;
				margin-bottom: 6px;
			}

			.el-input {
				box-sizing: border-box;

				&__wrapper {
					box-shadow: none;
					border-radius: 10px;
					background-color: $bg-page;
					padding: 8px 14px;
					border: 1px solid $border-color;
					transition: all 0.3s ease;

					&:hover {
						border-color: $primary;
						background-color: $primary-light;
					}
				}

				&__inner {
					height: 42px;
					color: $text-primary;
					font-size: 14px;

					&::placeholder {
						color: $text-tertiary;
					}
				}

				&:focus-within {
					:deep(.el-input__wrapper) {
						border-color: $primary;
						box-shadow: 0 0 0 2px rgba(31, 95, 168, 0.15);
						background-color: #fff;
					}
				}

				// 前缀图标
				:deep(.el-input__prefix) {
					margin-right: 8px;
					color: $text-tertiary;
					display: flex;
					align-items: center;
				}
			}
		}

		:deep(.pic-captcha) {
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
		}

		.op {
			margin-top: 36px;

			.login-btn {
				height: 46px;
				width: 100%;
				font-size: 16px;
				font-weight: bold;
				letter-spacing: 4px;
				border-radius: 10px;
				background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
				border: none;
				color: #fff;
				box-shadow: 0 4px 16px rgba(31, 95, 168, 0.3);
				transition: all 0.3s ease;

				&:hover {
					transform: translateY(-1px);
					box-shadow: 0 6px 24px rgba(31, 95, 168, 0.4);
				}

				&:active {
					transform: translateY(0);
					box-shadow: 0 2px 8px rgba(31, 95, 168, 0.3);
				}
			}
		}
	}

	.login-footer {
		margin-top: 32px;
		text-align: center;
		opacity: 0;
		animation: fadeIn 0.5s ease 0.8s forwards;

		p {
			font-size: 12px;
			color: $text-tertiary;
			margin: 0;
			letter-spacing: 0.5px;
		}
	}
}

// ===================== 响应式 =====================
@media screen and (max-width: 1024px) {
	.page-login {
		.login-brand {
			display: none;
		}

		.login-box {
			width: 100%;
			justify-content: center;
			padding: 20px;
		}

		.login-card {
			max-width: 400px;
			padding: 36px 28px;
			box-shadow: none;
			background: transparent;
		}
	}
}

@media screen and (max-width: 768px) {
	.page-login {
		.login-card {
			max-width: 100%;
			padding: 30px 20px;
		}
	}
}
</style>
