# Import base image and create working directory
FROM golang:latest       
WORKDIR /app

# Copy everything to the work directory
COPY . .

# Download all dependencies
RUN go mod download

# Compile the app
RUN CGO_ENABLED=0 GOOS=linux go build -o /notifier

# Expose PORT for the app
EXPOSE 8080

# Run the app
CMD ["/notifier"]