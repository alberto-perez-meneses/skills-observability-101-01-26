

```md
#  Arquitectura de Observabilidad con OpenTelemetry

Este proyecto implementa una **arquitectura de observabilidad completa** para microservicios Spring Boot usando:

- **OpenTelemetry**
- **Jaeger** (trazas)
- **Prometheus** (métricas)
- **Grafana** (visualización)
- **cAdvisor** (métricas de contenedores)
- **Docker Compose**

La solución sigue buenas prácticas modernas:
- Instrumentación automática con **OpenTelemetry Java Agent**
- Centralización de telemetría en **OpenTelemetry Collector**
- Scraping de métricas desde Prometheus
- Visualización desacoplada con Grafana

---

##  Docker Compose – Servicios

Servicios principales:

| Servicio       | Puerto             | Descripción                         |
| -------------- | ------------------ | ----------------------------------- |
| service-one    | 8081               | Microservicio Spring Boot           |
| service-two    | 8082               | Microservicio Spring Boot           |
| otel-collector | 4317 / 4318 / 8889 | Receptor OTEL y exporter Prometheus |
| jaeger         | 16686              | UI de trazas                        |
| prometheus     | 9090               | Métricas                            |
| grafana        | 3000               | Dashboards                          |
| cadvisor       | 8080               | Métricas de contenedores            |

---

##  Contenedor Spring Boot con OpenTelemetry Java Agent

Los microservicios usan **instrumentación automática** vía Java Agent.

###  Dockerfile (multi-stage)

```dockerfile
# =========================
# Etapa 1: Build
# =========================
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# =========================
# Etapa 2: Runtime
# =========================
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ADD https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar .
ENV JAVA_TOOL_OPTIONS="-javaagent:./opentelemetry-javaagent.jar"
ENV JAVA_OPTS=""

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

---

##  Variables de entorno OTEL (por servicio)

```yaml
OTEL_SERVICE_NAME=service-one
OTEL_TRACES_EXPORTER=otlp
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317
OTEL_EXPORTER_OTLP_PROTOCOL=grpc

OTEL_METRICS_EXPORTER=none
OTEL_LOGS_EXPORTER=none
```

 Las métricas **NO** se exportan directamente
 Prometheus scrapea al **OpenTelemetry Collector**

---

##  OpenTelemetry Collector

###  `otel-collector-config.yaml`

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:

exporters:
  otlp/jaeger:
    endpoint: jaeger:4317
    tls:
      insecure: true

  prometheus:
    endpoint: 0.0.0.0:8889
    send_timestamps: true
    resource_to_telemetry_conversion:
      enabled: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/jaeger]

    metrics:
      receivers: [otlp]
      exporters: [prometheus]
```

---

##  Prometheus

###  `prometheus.yml`

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["prometheus:9090"]

  - job_name: "otel-collector"
    static_configs:
      - targets: ["otel-collector:8889"]

  - job_name: "cadvisor"
    static_configs:
      - targets: ["cadvisor:8080"]
```

---

##  Grafana

* URL: [http://localhost:3000](http://localhost:3000)
* Usuario: `admin`
* Password: `admin123`
* Datasource: Prometheus (`http://prometheus:9090`)

### Métricas recomendadas

* `process_cpu_usage`
* `jvm_memory_used_bytes`
* `jvm_gc_overhead`
* `jvm_threads_live`
* `http_server_requests_seconds_bucket`
* `system_load_average_1m`

---

##  Verificación rápida

```bash
# Métricas expuestas por el collector
curl http://localhost:8889/metrics

# Prometheus targets
http://localhost:9090/targets

# Jaeger UI
http://localhost:16686
```

---

##  Próximos pasos sugeridos

* Dashboards Grafana por servicio (`service_name`)
* Alertas Prometheus (heap > 80%, latencia p95)
* Logs OTEL - Loki ,openobserve o elasticsearch
* Sampling dinámico de trazas
* Create and monitoring a frontend
---
