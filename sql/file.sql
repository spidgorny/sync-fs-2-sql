-- auto-generated definition
create table file
(
    id   serial primary key,
    id_folder bigint references folder (id),
    name varchar not null,
    size integer not null,
    ctime timestamp without time zone,
    mtime timestamp without time zone,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

alter table public.file
    add constraint file_unique_parent_name
        unique (id_folder, name)
    ;