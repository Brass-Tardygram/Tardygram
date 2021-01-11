DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS postgram CASCADE;
DROP TABLE IF EXISTS comment;

INSERT INTO users (email, password_hash, profile_photo_url) VALUES
('test1@test.com', '$2a$04$14f5XjhjOn4OeFlClKgvxe0RMSasRgrYePJtHf4WnKvMi53UZUvaW', 'myspecialphoto.jpg')

INSERT INTO postgram (user_id, photo_url, caption, tags) VALUES
(1, 'jim.jpg', 'cool story bro', {'yolo', 'carpe diem'}),
(1, 'pam.jpg', 'cool story bro', {'yolo', 'carpe diem'}),
(1, 'dwight.jpg', 'cool story bro', {'yolo', 'carpe diem'}),
(1, 'andy.jpg', 'cool story bro', {'yolo', 'carpe diem'}),
(1, 'angela.jpg', 'cool story bro', {'yolo', 'carpe diem'}),
(1, 'oscar.jpg', 'cool story bro', {'yolo', 'carpe diem'}),
(1, 'meredith.jpg', 'cool story bro', {'yolo', 'carpe diem'}),
(1, 'bob.jpg', 'cool story bro', {'yolo', 'carpe diem'}),
(1, 'kevin.jpg', 'cool story bro', {'yolo', 'carpe diem'}),
(1, 'selfphoto.jpg', 'cool story bro', {'yolo', 'carpe diem'})

INSERT INTO comments (comment_by, post, comment) VALUES
(1, 4, 'Lookin sick my dude'),
(1, 7, 'Lookin sick my dude'),
(1, 1, 'Lookin sick my dude'),
(1, 4, 'Lookin sick my dude'),
(1, 2, 'Lookin sick my dude'),
(1, 10, 'Lookin sick my dude'),
(1, 9, 'Lookin sick my dude'),
(1, 5, 'Lookin sick my dude'),
(1, 3, 'Lookin sick my dude'),
(1, 7, 'Lookin sick my dude'),
(1, 9, 'Lookin sick my dude'),
(1, 8, 'Lookin sick my dude'),
(1, 3, 'Lookin sick my dude'),
(1, 6, 'Lookin sick my dude'),
(1, 4, 'Lookin sick my dude')