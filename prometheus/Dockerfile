FROM prom/prometheus:latest

USER root

COPY prometheus.yml.template /etc/prometheus/
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh


ENTRYPOINT ["/entrypoint.sh"]