# Cấu trúc thư mục dự án

Dự án Vue 3 được tổ chức theo cấu trúc sau:

```
src/
├── assets/              # Tài nguyên tĩnh (hình ảnh, fonts, v.v.)
│   └── logo.svg
│
├── components/          # Components Vue
│   ├── common/          # Components dùng chung (Button, Card, Modal, v.v.)
│   │   ├── icons/       # Icon components
│   │   ├── BaseButton.vue
│   │   ├── HelloWorld.vue
│   │   ├── TheWelcome.vue
│   │   └── WelcomeItem.vue
│   │
│   ├── layout/          # Components layout (Header, Footer, Sidebar, v.v.)
│   │   ├── AppHeader.vue
│   │   └── AppFooter.vue
│   │
│   └── features/        # Components theo từng tính năng cụ thể
│
├── views/               # Các trang/views của ứng dụng
│   └── HomeView.vue
│
├── composables/         # Vue composables (reusable logic)
│   └── useAuth.js
│
├── stores/              # State management (chuẩn bị cho Pinia)
│   └── index.js
│
├── router/              # Vue Router configuration
│   └── index.js
│
├── services/            # API calls và services
│   └── api.js
│
├── utils/               # Helper functions và utilities
│   └── helpers.js
│
├── styles/              # Global styles và CSS
│   ├── base.css         # Base styles và CSS variables
│   ├── main.css         # Main styles
│   └── variables.css    # CSS custom properties
│
├── App.vue              # Root component
└── main.js              # Entry point
```

## Mô tả các thư mục

### `/components`
- **common/**: Các components có thể tái sử dụng ở nhiều nơi trong ứng dụng
- **layout/**: Các components dùng để xây dựng layout của trang (Header, Footer, Sidebar)
- **features/**: Các components đặc thù cho từng tính năng cụ thể

### `/views`
Chứa các trang chính của ứng dụng. Mỗi view thường tương ứng với một route.

### `/composables`
Chứa các Vue composables - các hàm logic có thể tái sử dụng. Ví dụ: `useAuth`, `useApi`, `useModal`, v.v.

### `/stores`
Chuẩn bị cho việc tích hợp Pinia để quản lý state toàn cục.

### `/router`
Cấu hình routing cho ứng dụng sử dụng Vue Router.

### `/services`
Chứa các service để gọi API và xử lý dữ liệu từ backend.

### `/utils`
Các hàm tiện ích và helper functions không phụ thuộc vào Vue.

### `/styles`
Chứa các file CSS toàn cục, variables, và theme configuration.

## Cách sử dụng

### Thêm một component mới
- Component dùng chung → `components/common/`
- Component layout → `components/layout/`
- Component tính năng cụ thể → `components/features/[feature-name]/`

### Thêm một trang mới
1. Tạo file trong `views/` (ví dụ: `ProductView.vue`)
2. Thêm route trong `router/index.js`
3. Import và sử dụng trong router

### Thêm composable mới
Tạo file trong `composables/` với prefix `use` (ví dụ: `useProduct.js`)

### Gọi API
Sử dụng service trong `services/api.js`:
```javascript
import api from '@/services/api'

const products = await api.get('/products')
```

## Alias paths

Dự án đã cấu hình alias `@` trỏ đến thư mục `src/`:
```javascript
import Component from '@/components/common/BaseButton.vue'
import { formatCurrency } from '@/utils/helpers'
```
