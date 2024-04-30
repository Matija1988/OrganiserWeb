alter table members add roles varchar(100);

insert into members (firstName, lastName, userName, password, email, isTeamLeader, roles)
values 
('Chuck',
'Norris',
'texasranger',
'$2a$12$yQlP0/3oJv0QGLJ5PJmM/eC5h47AgKGizapXB/ZC3pMHsksFImV6a', 
'texasranger@gmail.com' ,1, 'TeamLeader'),
('Marko',
'Marković',
'tester',
'$2a$12$4EKW19NiUtct2iJsVPgzmOVIW.oAvHqaw.eBhtnYP/wvCE.7//.BC', 
'matijapavkovic74@gmail.com',
0, 'Member'),

('Petar',
'Bočkaj',
'Guc2A',
'OsvetaKanižlićeve', 
'matijapavkovic74@gmail.com',
0, 'Member');

update members set roles = 'TeamLeader' where id =1;

update members set roles = 'Member' where id = 11;
