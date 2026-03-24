FROM nginx:latest

# Xóa file mặc định của nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy file html vào nginx
COPY index.html /usr/share/nginx/html/

# Mở cổng 80
EXPOSE 80

# Chạy nginx
CMD ["nginx", "-g", "daemon off;"]