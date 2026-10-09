#!/usr/bin/env bash
# ============================================================
#  БЫСТРОЕ ОБНОВЛЕНИЕ: add + commit + push одной командой
#  Использование:
#     bash update.sh "правки цен"
# ============================================================
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

MSG="${1:-}"
if [ -z "$MSG" ]; then
  echo "Использование: bash update.sh \"Сообщение коммита\""
  exit 1
fi

git add -A
if git diff --cached --quiet; then
  echo "* Нет изменений для коммита"
  exit 0
fi

git commit -m "$MSG"
git push
echo "OK: изменения отправлены в $(git remote get-url origin)"
