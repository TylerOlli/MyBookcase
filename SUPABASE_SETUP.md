# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to be set up (this may take a few minutes)

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and anon/public key
3. Create a `.env` file in your project root with:

```
REACT_APP_SUPABASE_URL=your_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Set Up the Database Schema

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create the user_books table
CREATE TABLE user_books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  title TEXT NOT NULL,
  authors TEXT[],
  shelf TEXT NOT NULL DEFAULT 'wantToRead',
  image_url TEXT,
  publisher TEXT,
  published_date TEXT,
  page_count INTEGER,
  isbn TEXT,
  categories TEXT[],
  description TEXT,
  language TEXT,
  average_rating DECIMAL(3,2),
  ratings_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Create indexes for better performance
CREATE INDEX idx_user_books_user_id ON user_books(user_id);
CREATE INDEX idx_user_books_shelf ON user_books(shelf);
CREATE INDEX idx_user_books_book_id ON user_books(book_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own books" ON user_books
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own books" ON user_books
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books" ON user_books
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books" ON user_books
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_user_books_updated_at
  BEFORE UPDATE ON user_books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 4. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure your site URL (e.g., `http://localhost:3000` for development)
3. Add any additional redirect URLs you need
4. Optionally enable Google OAuth:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials

## 5. Test the Setup

1. Start your React app: `npm start`
2. You should see the authentication screen
3. Create an account or sign in
4. Your books will now be saved to your personal Supabase database

## 6. Environment Variables

Make sure your `.env` file is in the project root and contains:

```
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** Never commit your `.env` file to version control. Add it to your `.gitignore` file.

## 7. Deployment

When deploying to production:

1. Update your Supabase project settings with your production domain
2. Set the environment variables in your hosting platform
3. Make sure your production domain is added to the allowed redirect URLs in Supabase

## Troubleshooting

- **Authentication errors**: Check that your environment variables are correct
- **Database errors**: Make sure you've run the SQL schema setup
- **CORS errors**: Verify your site URL is configured correctly in Supabase
- **RLS errors**: Ensure the RLS policies are created and enabled 