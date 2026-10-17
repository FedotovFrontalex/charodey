# Автоматизация репозитория «Чародеи»

## workflows/

- **deploy.yml** — автодеплой на GitHub Pages. Запускается при каждом пуше в `main`
  (или вручную: Actions → Deploy to GitHub Pages → Run workflow).
  Сайт после деплоя: https://fedotovfrontalex.github.io/charodey/

  Разовый шаг при первом включении: **Settings → Pages → Source: «GitHub Actions»**.

## scripts/

Хелперы для работы из Git Bash (запускать из любой папки — путь до репозитория
определяется автоматически):

- **publish.sh** — первичная публикация: проверяет окружение, коммитит всё и пушит.
  ```bash
  bash .github/scripts/publish.sh                # стандартное сообщение
  bash .github/scripts/publish.sh "feat: правки" # своё сообщение
  ```
- **update.sh** — быстрые изменения: add + commit + push одной командой.
  ```bash
  bash .github/scripts/update.sh "правки цен"
  ```
- **make-tilda-embed.mjs** — пересборка кода для вставки лендинга в Tilda
  (папка `tilda/`: стили, контент, превью; картинки подменяются на CDN Tilda).
  ```bash
  node .github/scripts/make-tilda-embed.mjs
  ```
  Инструкция по вставке — в `tilda/README.md`.
