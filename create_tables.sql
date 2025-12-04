-- ============================================
-- Создание таблиц для PersonalCRM
-- ============================================
-- Выполните этот скрипт в Supabase SQL Editor
-- После выполнения таблиц выполните supabase_rls_policies.sql

-- ============================================
-- 1. Таблица contacts (контакты)
-- ============================================

CREATE TABLE IF NOT EXISTS contacts (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL,
  name TEXT NOT NULL,
  birthday DATE,
  last_contact DATE NOT NULL,
  reminder_interval INTEGER NOT NULL
);

-- ============================================
-- 2. Таблица chats (чаты с AI)
-- ============================================

CREATE TABLE IF NOT EXISTS chats (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL,
  title TEXT NOT NULL,
  model VARCHAR NOT NULL,
  enable_web_search BOOLEAN DEFAULT false NOT NULL,
  total_cost DECIMAL(10, 6) DEFAULT '0',
  total_tokens INTEGER DEFAULT 0,
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================
-- 3. Таблица messages (сообщения в чатах)
-- ============================================

CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id VARCHAR NOT NULL,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  cost_usd DECIMAL(10, 6) DEFAULT '0',
  web_search_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ============================================
-- 4. Индексы для производительности
-- ============================================

CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- ============================================
-- Готово!
-- ============================================
-- После выполнения этого скрипта выполните:
-- supabase_rls_policies.sql для настройки безопасности
-- ============================================

