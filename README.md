# Spatialite Extension

If you want to use GEO functions inside directus and are using SQLite as your
database backend, you need the
[SpatiaLite](https://www.gaia-gis.it/fossil/libspatialite/index) extension for
SQLite.

![screenshot](https://raw.githubusercontent.com/joggienl/directus-hook-sqlite-spatialite/v1.1.1/docs/screenshot.jpg)

This Directus extension will load the module into the database (it will add it
to every connection, that is the way how it works for SQLite).

> [!WARNING]  
> If used in conjunction with the
> [directus-hook-sqlite-perf](https://github.com/joggienl/directus-hook-sqlite-perf)
> extension, it is possible that if you have more connections in your database
> pool, loading of the spatialite extension happens a little to late. If this
> happens you'll get an error. Most of the time it will work when you retry
> saving.
>
> If this is an issue: set `DB_POOL__MAX` to 1!

Note that your Directus backend will need the library to be installed. If you
are using the official docker image you can easily build your own image with the
library included.

```Dockerfile
FROM directus/directus:11.0.2

## Install SQLite SpatiaLite: extend the SQLite core to support fully fledged Spatial SQL
## capabilities.
## https://pkgs.alpinelinux.org/package/edge/community/x86/libspatialite

USER root
RUN <<EOF
  apk --no-cache add libspatialite
  ln -s mod_spatialite.so.8 /usr/lib/mod_spatialite
EOF
USER node

```

## Some additional notes

This extension is inspired on the links in the list below.

-   https://github.com/directus/directus/discussions/7758
-   https://github.com/directus/directus/issues/13271
-   https://github.com/directus/directus/pull/9917
-   https://medium.com/@joelmalone/a-quick-sqlite3-and-spatialite-primer-7d9fc086e66b
