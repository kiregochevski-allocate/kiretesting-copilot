# Kire Testing Application Helm Chart

This Helm chart deploys the Kire Testing Application on Kubernetes, consisting of a frontend React application and a backend .NET API.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+
- A Kubernetes cluster with access to a container registry
- PV provisioner support in the underlying infrastructure (for persistent volumes if needed)
- ArgoCD (optional, for GitOps deployments)

## Installation

### Using Helm directly

```bash
# Add repo if hosted in a Helm repository
# helm repo add kire-testing-repo https://your-helm-repo-url
# helm repo update

# Install the chart with the release name `kire-testing`
helm install kire-testing ./helm-charts/kire-testing-app

# Install with a specific environment values file
helm install kire-testing ./helm-charts/kire-testing-app -f ./helm-charts/kire-testing-app/values-dev.yaml
```

### Using ArgoCD

```bash
# Apply the ArgoCD application manifest
kubectl apply -f ./helm-charts/kire-testing-app/argocd/application-dev.yaml
```

## Configuration

The following table lists the configurable parameters of the chart and their default values.

### Global Parameters

| Parameter | Description | Default |
| --------- | ----------- | ------- |
| `global.environment` | Environment name | `dev` |

### Frontend Parameters

| Parameter | Description | Default |
| --------- | ----------- | ------- |
| `frontend.enabled` | Enable frontend deployment | `true` |
| `frontend.replicaCount` | Number of frontend replicas | `1` |
| `frontend.image.repository` | Frontend image repository | `ghcr.io/your-username/kire-testing-frontend` |
| `frontend.image.tag` | Frontend image tag | `latest` |
| `frontend.image.pullPolicy` | Frontend image pull policy | `IfNotPresent` |
| `frontend.service.type` | Frontend service type | `ClusterIP` |
| `frontend.service.port` | Frontend service port | `80` |
| `frontend.ingress.enabled` | Enable frontend ingress | `true` |
| `frontend.ingress.hosts` | Frontend ingress hosts | `[{"host": "kire-testing.example.com", "paths": [{"path": "/", "pathType": "Prefix"}]}]` |

### Backend Parameters

| Parameter | Description | Default |
| --------- | ----------- | ------- |
| `backend.enabled` | Enable backend deployment | `true` |
| `backend.replicaCount` | Number of backend replicas | `1` |
| `backend.image.repository` | Backend image repository | `ghcr.io/your-username/kire-testing-api` |
| `backend.image.tag` | Backend image tag | `latest` |
| `backend.image.pullPolicy` | Backend image pull policy | `IfNotPresent` |
| `backend.service.type` | Backend service type | `ClusterIP` |
| `backend.service.port` | Backend service port | `80` |
| `backend.env` | Environment variables for the backend | See `values.yaml` |

### Database Parameters

| Parameter | Description | Default |
| --------- | ----------- | ------- |
| `database.enabled` | Enable database configuration | `true` |
| `database.existingSecret` | Existing secret name for database credentials | `""` |
| `database.secretKey` | Secret key for database connection string | `connection-string` |
| `database.connectionString` | Database connection string | See `values.yaml` |

### Monitoring Parameters

| Parameter | Description | Default |
| --------- | ----------- | ------- |
| `monitoring.enabled` | Enable monitoring | `false` |
| `monitoring.serviceMonitor.interval` | Scrape interval | `15s` |
| `monitoring.serviceMonitor.scrapeTimeout` | Scrape timeout | `10s` |

## Upgrading

```bash
# Upgrade an existing release
helm upgrade kire-testing ./helm-charts/kire-testing-app -f ./helm-charts/kire-testing-app/values-dev.yaml
```

## Uninstalling the Chart

```bash
# Uninstall the release
helm uninstall kire-testing
```
