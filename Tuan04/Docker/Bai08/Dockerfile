FROM postgres:15

# Thiết lập biến môi trường cho PostgreSQL
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=123456
ENV POSTGRES_DB=postgres

# Copy file SQL vào thư mục init
COPY init.sql /docker-entrypoint-initdb.d/