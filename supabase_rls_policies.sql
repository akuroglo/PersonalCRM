-- ============================================
-- Supabase RLS (Row Level Security) Policies
-- ============================================
-- Этот скрипт настраивает политики безопасности для таблиц базы данных
-- Выполните его в SQL Editor в панели Supabase после создания таблиц

-- ============================================
-- 1. Включение RLS для всех таблиц
-- ============================================

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. Политики для таблицы contacts
-- ============================================

-- Пользователи могут видеть только свои контакты
CREATE POLICY "Users can view their own contacts"
  ON contacts
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- Пользователи могут создавать только свои контакты
CREATE POLICY "Users can insert their own contacts"
  ON contacts
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Пользователи могут обновлять только свои контакты
CREATE POLICY "Users can update their own contacts"
  ON contacts
  FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Пользователи могут удалять только свои контакты
CREATE POLICY "Users can delete their own contacts"
  ON contacts
  FOR DELETE
  USING (auth.uid()::text = user_id);

-- ============================================
-- 3. Политики для таблицы chats
-- ============================================

-- Пользователи могут видеть только свои чаты
CREATE POLICY "Users can view their own chats"
  ON chats
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- Пользователи могут создавать только свои чаты
CREATE POLICY "Users can insert their own chats"
  ON chats
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Пользователи могут обновлять только свои чаты
CREATE POLICY "Users can update their own chats"
  ON chats
  FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Пользователи могут удалять только свои чаты
CREATE POLICY "Users can delete their own chats"
  ON chats
  FOR DELETE
  USING (auth.uid()::text = user_id);

-- ============================================
-- 4. Политики для таблицы messages
-- ============================================

-- Пользователи могут видеть сообщения только из своих чатов
CREATE POLICY "Users can view messages from their own chats"
  ON messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()::text
    )
  );

-- Пользователи могут создавать сообщения только в своих чатах
CREATE POLICY "Users can insert messages in their own chats"
  ON messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()::text
    )
  );

-- Пользователи могут обновлять сообщения только в своих чатах
CREATE POLICY "Users can update messages in their own chats"
  ON messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()::text
    )
  );

-- Пользователи могут удалять сообщения только из своих чатов
CREATE POLICY "Users can delete messages from their own chats"
  ON messages
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()::text
    )
  );

-- ============================================
-- 5. Индексы для улучшения производительности
-- ============================================

-- Индексы для быстрого поиска по user_id
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at DESC);

-- Индекс для быстрого поиска сообщений по chat_id
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- ============================================
-- Готово!
-- ============================================
-- После выполнения этого скрипта:
-- 1. Все таблицы защищены RLS политиками
-- 2. Пользователи могут работать только со своими данными
-- 3. Даже при прямом доступе к базе данных через anon key
--    пользователи не увидят чужие данные
-- ============================================

