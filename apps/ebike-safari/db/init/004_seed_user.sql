-- Bootstrap user when table is empty (username/password: don/don)
INSERT INTO users (username, password_hash, display_name)
SELECT
    'don',
    '$2b$10$yt4QudmT56fQ8c/GPkJxOuw2NMdfBxnAznMM/OOUa3qOEd4QL0qPK',
    'Don'
WHERE NOT EXISTS (SELECT 1 FROM users LIMIT 1);
