-- auto-generated definition
create table folder
(
    id   serial primary key,
    parent int references folder (id),
    name varchar not null,
    size integer not null,
    ctime timestamp without time zone,
    mtime timestamp without time zone,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

