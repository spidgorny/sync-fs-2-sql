# Synchronize File System to SQL Database

File system traversing has always been a slow process. Would it not be nice to be able to run SQL queries on your 
files. Searching not only by file name, but also by various metadata (like exif image info)?

This is an experiment that 

* (1) imports all your files into a database and 
* (2) watches the files system for changes and updates the database ASAP.
* (3) PostgreSQL database you can query from your app
* (4) HTTP REST API to query the database
* (5) Command line tools to query the database


