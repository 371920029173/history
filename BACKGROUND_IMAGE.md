# 背景图片配置说明

## 添加背景图片

1. 将背景图片文件放在 `public` 目录下
2. 建议命名为 `background.jpg` 或 `background.png`
3. 如果使用其他名称，需要修改 `app/page.module.css` 中的 `background-image` URL

## 当前配置

在 `app/page.module.css` 中，背景图片配置为：

```css
background-image: url('/background.jpg');
```

## 图片要求

- 格式：JPG、PNG 或 WebP
- 建议尺寸：1920x1080 或更高（会自动缩放）
- 文件大小：建议小于 2MB（以提高加载速度）

## 样式说明

背景图片的样式特点：

1. **透明度**：图片透明度设置为 0.15（15%），不会遮挡文字
2. **渐变覆盖**：使用白色渐变覆盖层，从顶部到底部逐渐变淡
3. **淡入动画**：图片加载时有 2 秒的淡入动画效果
4. **响应式**：图片会自动适应不同屏幕尺寸

## 修改样式

如果需要调整背景图片的显示效果，可以修改 `app/page.module.css` 中的以下属性：

- `opacity`: 调整透明度（当前为 0.15）
- `background-size`: 调整图片大小（当前为 `cover`）
- `background-position`: 调整图片位置（当前为 `center`）

## 示例

如果你有图片文件 `my-background.jpg`：

1. 将文件放在 `public` 目录下
2. 修改 `app/page.module.css` 第 23 行：
   ```css
   background-image: url('/my-background.jpg');
   ```

