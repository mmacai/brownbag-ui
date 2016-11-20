FROM lukaasp/apache:2.4.18

COPY custom-httpd.conf /usr/local/apache2/conf/custom/
COPY dist /opt/sites/brownbag-ui
RUN mkdir /var/log/apache2 && chown tc:staff /var/log/apache2

EXPOSE 80
