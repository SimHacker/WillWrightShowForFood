-- Bootstrap user when table is empty (password: changeme — change after first login)
INSERT INTO users (username, password_hash, display_name)
SELECT
    'don',
    '$2b$10$Nh.B6sPRcYuzVzzCjgTzmuJls0.LoO/BaFY5m082D.q9xiQVhSy.u',
    'Don'
WHERE NOT EXISTS (SELECT 1 FROM users LIMIT 1);
