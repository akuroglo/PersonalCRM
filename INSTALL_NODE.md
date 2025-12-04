# Установка Node.js на macOS

## Вариант 1: Через Homebrew (рекомендуется)

1. Установите Homebrew (если еще не установлен):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Установите Node.js:
   ```bash
   brew install node
   ```

3. Проверьте установку:
   ```bash
   node --version
   npm --version
   ```

## Вариант 2: Через официальный установщик

1. Перейдите на [nodejs.org](https://nodejs.org/)
2. Скачайте LTS версию для macOS
3. Установите скачанный файл
4. Проверьте установку:
   ```bash
   node --version
   npm --version
   ```

## Вариант 3: Через NVM (Node Version Manager)

1. Установите NVM:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. Перезагрузите терминал или выполните:
   ```bash
   source ~/.zshrc
   ```

3. Установите Node.js:
   ```bash
   nvm install --lts
   nvm use --lts
   ```

4. Проверьте установку:
   ```bash
   node --version
   npm --version
   ```

## После установки

Выполните в директории проекта:

```bash
cd "/Users/akuroglo/Documents/Новая папка 2/v-con"
npm install
npm run db:push
```

