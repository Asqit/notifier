# Základní obraz s Go runtime
FROM golang:1.17-alpine AS builder

# Nastavení pracovního adresáře
WORKDIR /app

# Kopírování zdrojových souborů do kontejneru
COPY . .

# Kompilace Go aplikace
RUN go build -o myapp .

# Druhý stavební etapa pro snížení velikosti obrazu
FROM alpine:latest  

# Nastavení pracovního adresáře
WORKDIR /root/

# Kopírování binárního souboru z první etapy
COPY --from=builder /app/myapp .

# Nastavení portu, na kterém bude API běžet
EXPOSE 8080

# Spuštění API
CMD ["./myapp"]