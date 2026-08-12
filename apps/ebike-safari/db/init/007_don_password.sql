-- Set bootstrap user password to don (was changeme on first deploy)
UPDATE users
SET password_hash = '$2b$10$yt4QudmT56fQ8c/GPkJxOuw2NMdfBxnAznMM/OOUa3qOEd4QL0qPK'
WHERE username = 'don';
