# Spatialite Extension

If you want to use GEO functions inside directus and are using SQLite as your
database backend, you need the [SpatiaLite](https://www.gaia-gis.it/fossil/libspatialite/index) 
extension for SQLite.

![screenshot](https://raw.githubusercontent.com/joggienl/directus-hook-sqlite-spatialite/v1.0.1/docs/screenshot.jpg)

This Directus extension will load the module into the database (it will add it
to every connection, that is the way how it works for SQLite).

Note that your Directus backend will need the library to be installed. If you are
using the official docker image you can easily build your own image with the
library included.

```Dockerfile
FROM directus/directus:10.12.0

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

- https://github.com/directus/directus/discussions/7758
- https://github.com/directus/directus/issues/13271
- https://github.com/directus/directus/pull/9917
- https://medium.com/@joelmalone/a-quick-sqlite3-and-spatialite-primer-7d9fc086e66b
