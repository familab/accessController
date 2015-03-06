drop table if exists member;
create table member (
  id integer primary key autoincrement,
  firstname text not null,
  lastname text not null,
  email text not null
);

drop table if exists card;
create table card (
  id integer primary key autoincrement,
  uid text not null,
  member_id integer not null,
  enabled boolean not null,
  FOREIGN KEY(member_id) REFERENCES member(id)
);