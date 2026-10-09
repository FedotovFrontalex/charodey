#!/usr/bin/env bash
# ============================================================
#  ПЕРВОНАЧАЛЬНАЯ ПУБЛИКАЦИЯ лендинга «Чародеи» на GitHub
#  Использование:
#     bash publish.sh                        — коммит со стандартным сообщением
#     bash publish.sh "feat: моё сообщение"  — со своим сообщением
# ============================================================
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

BRANCH="main"
REMOTE="origin"
DEFAULT_MSG="feat: лендинг детской стоматологии «Чародеи» — лечение зубов под наркозом"
MSG="${1:-$DEFAULT_MSG}"

# --- 1. Проверки окружения -------------------------------------------
if ! command -v git >/dev/null 2>&1; then
  echo "ERROR: git не найден. Установите Git for Windows: https://git-scm.com/download/win"
  exit 1
fi

# --- 2. Идентичность коммитов (если ещё не задана) --------------------
if [ -z "$(git config user.name)" ]; then
  git config user.name "FedotovFrontalex"
  echo "* git user.name задан локально: FedotovFrontalex"
fi
if [ -z "$(git config user.email)" ]; then
  git config user.email "FedotovFrontalex@users.noreply.github.com"
  echo "* git user.email задан локально (noreply-адрес GitHub)"
fi

# --- 3. Репозиторий и remote ------------------------------------------
if [ ! -d .git ]; then
  git init -b "$BRANCH"
  echo "* git-репозиторий инициализирован (ветка $BRANCH)"
fi

CURRENT_BRANCH="$(git branch --show-current 2>/dev/null || true)"
if [ -z "$CURRENT_BRANCH" ]; then
  CURRENT_BRANCH="$BRANCH"
fi

if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
  echo "ERROR: remote '$REMOTE' не задан. Выполните:"
  echo "  git remote add $REMOTE https://github.com/<user>/<repo>.git"
  exit 1
fi
REMOTE_URL="$(git remote get-url "$REMOTE")"
echo "* Remote: $REMOTE_URL"

# --- 4. Коммит ---------------------------------------------------------
git add -A
if git diff --cached --quiet; then
  echo "* Рабочее дерево чистое — нечего коммитить"
else
  git commit -m "$MSG"
fi

# --- 5. Публикация ------------------------------------------------------
echo "* Отправляю ветку $CURRENT_BRANCH в $REMOTE..."
if git push -u "$REMOTE" "$CURRENT_BRANCH"; then
  echo
  echo "==============================================="
  echo "OK: опубликовано в $REMOTE_URL"
  echo "==============================================="
  echo
  echo "Дальше сработает автодеплой: .github/workflows/deploy.yml"
  echo "публикует сайт на GitHub Pages при каждом пуше в main."
  echo
  echo "Разовый шаг (если ещё не сделан):"
  echo "  1. Откройте $REMOTE_URL/settings/pages"
  echo "  2. Source: GitHub Actions  ->  Save"
  echo "  3. Сайт будет на: https://fedotovfrontalex.github.io/charodey/"
  echo "     (прогресс: вкладка $REMOTE_URL/actions)"
else
  echo
  echo "ERROR: push не прошёл. Возможные причины:"
  echo "  - Git Credential Manager запросил вход в GitHub — завершите его в открывшемся окне и запустите скрипт снова;"
  echo "  - нет прав на запись в репозиторий (проверьте аккаунт/токен)."
  exit 1
fi
