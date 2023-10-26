-- we MUST reuse the folder_id_seq to keep the ID unique
-- for folder and files
create table file
(
    id   int default nextval('folder_id_seq'::regclass) primary key,
    id_folder bigint references folder (id) ON DELETE CASCADE,
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